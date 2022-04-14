/*
config
rsid
perms
advanced
readOnly
*/

Ext.define('YZSoft.security.WellKnownRSIDAssignPermDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 580,
    height: 628,
    minWidth: 580,
    minHeight: 628,
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

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            rsid: config.rsid,
            advanced: config.advanced,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            perms: config.perms,
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
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'SaveACL',
                securityResType: 'RSID',
                rsid: me.rsid
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