/*
config
rsid
path
perms,
securityResType
readOnly
*/

Ext.define('YZSoft.bpm.src.zone.FolderDlg', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 580,
    height: 628,
    modal: true,
    resizable: false,
    buttonAlign:'right',
    bodyPadding:0,

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            padding: '15 26 5 26',
            rsid: config.rsid,
            parentRsid: config.parentRsid,
            advanced: config.securityResType == 'ProcessFolder',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            perms: config.perms
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlSecurity
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled:config.readOnly,
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
            url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
            params: {
                method: 'SaveFolder',
                securityResType: me.securityResType,
                path: me.path
            },
            jsonData: {
                acl: acl
            },
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