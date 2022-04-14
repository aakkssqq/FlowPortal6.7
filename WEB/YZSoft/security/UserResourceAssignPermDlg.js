/*
设置用户资源的权限
config:
rsid,
readOnly
*/
Ext.define('YZSoft.security.UserResourceAssignPermDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 520,
    height: 580,
    minWidth: 520,
    minHeight: 580,
    modal: true,
    bodyPadding: '10 20 6 20',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (acl) {
                    me.closeDialog(acl);
                });
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            rsid: config.rsid,
            advanced:true,
            url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
            permGrid: {
                height: 202
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.pnlSecurity]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    submit: function (fn, scope) {
        var me = this,
            acl = me.pnlSecurity.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
            params: {
                method: 'SaveACL',
                rsid: me.rsid
            },
            jsonData: acl.aces,
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                fn && fn.call(scope, acl);
            }
        });
    }
});