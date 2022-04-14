
Ext.define('YZSoft.personal.ChangePasswordPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.form.field.PasswordMeter'
    ],
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xtype: 'form',
                reference: 'form',
                bodyPadding: '40px 0px 30px 0px',
                layout: {
                    type: 'vbox'
                },
                defaults: {
                    xtype: 'container',
                    layout: 'hbox',
                    margin:'0 0 10 0',
                    defaults: {
                        xtype: 'textfield',
                        labelWidth: 100,
                        width: 380,
                        labelSeparator: '',
                        msgTarget: 'none'
                    }
                },
                items: [{
                    items: [{
                        fieldLabel: RS.$('Org_Pwd_Org'),
                        name: 'OrgPassword',
                        inputType: 'password'
                    }, {
                        xtype: 'component',
                        cls:'yz-msgtarget-err'
                    }]
                }, {
                    items: [{
                        xtype: 'yzpasswordmeter',
                        fieldLabel: RS.$('Org_Pwd_New'),
                        name: 'NewPassword',
                        inputType: 'password',
                        minScope: 30,
                        validator: function (value) {
                            if (!value)
                                return RS.$('All_NewPwd_NoneErr');

                            if (this.score < this.minScope)
                                return RS.$('All_PWDStrengthLow');

                            return true;
                        }
                    }, {
                        xtype: 'component',
                        cls: 'yz-msgtarget-err'
                    }]
                }, {
                    items: [{
                        fieldLabel: RS.$('Org_Pwd_Cfm'),
                        name: 'CfmPassword',
                        inputType: 'password',
                        validator: function (value) {
                            var formPanel = me.lookupReference('form'),
                                form = formPanel.getForm(),
                                data = form.getValues();

                            if (data.NewPassword != data.CfmPassword)
                                return RS.$('All_PwdCfm_Diff');

                            return true;
                        }
                    }, {
                        xtype: 'component',
                        cls: 'yz-msgtarget-err'
                    }]
                }, {
                    xtype: 'button',
                    text: RS.$('All_Sumbit'),
                    margin: '30px 0 0 103px',
                    scale: 'medium',
                    minWidth:120,
                    handler: function () {
                        me.submit();
                    }
                }],
                listeners: {
                    scope:me,
                    fielderrorchange: 'onFieldErrorChange'
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        this.reset();
    },

    reset: function () {
        var me = this,
            formPanel = this.lookupReference('form');

        formPanel.reset();
    },

    fill: function (data) {
        var me = this,
            formPanel = this.lookupReference('form'),
            form = formPanel.getForm();

        form.setValues(data);
    },

    onFieldErrorChange: function (form, cmp, error) {
        var me = this,
            cmpErr = cmp.nextSibling('[cls~=yz-msgtarget-err]'),
            errors = cmp.activeErrors,
            errorText = (errors && errors.join('')) || '';

        if (cmpErr)
            cmpErr.update(errorText);

        return;
    },

    submit: function () {
        var me = this,
            formPanel = this.lookupReference('form'),
            form = formPanel.getForm(),
            data = form.getValues();

        if (!form.isValid())
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Personal.ashx'),
            params: Ext.apply({
                method: 'ChangePassword'
            },data),
            waitMsg: {
                msg: RS.$('All_Submiting'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('Org_ChangePwd_Success'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: 'xx',
                    fn: function () {
                        me.reset();
                    }
                });
            }
        });
    }
});