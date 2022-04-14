/*
config:
parentou
uid
*/
Ext.define('YZSoft.bpm.org.admin.ResetPwdDlg', {
    extend: 'Ext.window.Window', //222222
    requires: [
    ],
    cls: 'yz-window-frame',
    layout: {
        type: 'vbox',
        align:'stretch'
    },
    width: 380,
    modal: true,
    resizable: false,
    bodyPadding: '15 26 10 26',
    buttonAlign: 'right',
    referenceHolder: true,
    defaultFocus: 'pwd',

    constructor: function (config) {
        var me = this,
            cfg, refs;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            handler: function () {
                me.submit(function (uid) {
                    me.closeDialog(uid);
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
            items: [{
                xtype: 'displayfield',
                fieldLabel: RS.$('All_Account'),
                reference: 'dspUid',
                value: config.uid
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_Pwd'),
                itemId: 'pwd',
                reference: 'edtPassword',
                inputType: 'password',
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_PwdCfm'),
                reference: 'edtPasswordCfm',
                inputType: 'password'
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
            params: {
                method: 'GetUserFromAccount',
                uid: config.uid
            },
            success: function (action) {
                me.fill(action.result);
            }
        });
    },

    fill: function (user) {
        var me = this,
            refs = me.getReferences();

        me.setTitle(Ext.String.format(RS.$('Org_ResetPwd_Title'), user.DisplayName || user.Account)),
        refs.dspUid.setValue(Ext.util.Format.text(user.Account));
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            data;

        data = {
            Password: refs.edtPassword.getValue(),
            PasswordCfm: refs.edtPasswordCfm.getValue()
        };

        return data;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        if (me.validate(data) === false)
            return;

        delete data.PasswordCfm;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'ResetPassword',
                uid: me.uid,
                parentou: me.parentou
            },
            jsonData: data,
            waitMsg: {
                msg: RS.$('All_ResetPwd_LoadMask'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_ResetPwd_Success'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: 'xx',
                    fn: function () {
                        fn && fn.call(scope, action.result);
                    }
                });
            }
        });
    },

    validate: function (data) {
        var me = this,
            refs = me.getReferences();

        try {
            if (data.PasswordCfm != data.Password) {
                Ext.Error.raise({
                    msg: RS.$('All_PwdCfm_Diff'),
                    fn: function () {
                        refs.edtPassword.focus()
                    }
                });
            }
        }
        catch (e) {
            YZSoft.alert(e.message, function () {
                if (e.fn)
                    e.fn.call(e.scope || this, e);
            });
            return false;
        }
    }
});