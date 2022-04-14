/*
config
folderid,
readOnly
*/

Ext.define('YZSoft.app.filesystem.FolderDlg', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 580,
    height: 628,
    modal: true,
    resizable: false,
    buttonAlign: 'right',
    bodyPadding:0,
    securityResType: 'FileSystemFolder',

    constructor: function (config) {
        var me = this,
            folderid = config.folderid,
            cfg;

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            padding: '15 26 5 26',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            advanced: false,
            rsid: 'FileSystemFolder://' + folderid,
            perms: [{
                PermName: 'Read',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Read')
            }, {
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Write')
            }, {
                PermName: 'AssignPermision',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_AssignPermision')
            }]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls:'yz-tab-bar-window-main'
            },
            items: [
                me.pnlSecurity
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (group) {
                    me.mask({
                        msg: RS.$('All_Save_Succeed'),
                        msgCls: 'yz-mask-msg-success',
                        autoClose: true,
                        fn: function () {
                            me.closeDialog(group);
                        }
                    });
                });
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    submit: function (fn, scope) {
        var me = this,
            acl = me.pnlSecurity.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'SaveACL',
                securityResType: me.securityResType,
                resName: me.folderid
            },
            jsonData: acl.aces,
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                if (fn) {
                    fn.call(scope);
                }
            }
        });
    }
});