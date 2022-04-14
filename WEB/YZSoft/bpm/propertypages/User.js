/*
config
mode
readOnly

method
fill
*/
Ext.define('YZSoft.bpm.propertypages.User', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.PasswordMeter',
        'YZSoft.src.form.field.Headshot',
        'YZSoft.src.form.field.Sign'
    ],
    referenceHolder: true,
    title: RS.$('All_Title_User'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    label2Width: 70,
    label1Width: 78,
    bodyStyle: 'background-color:transparent',

    constructor: function (config) {
        var me = this,
            config = config || {},
            mode = config.mode,
            label2Width = config.label2Width || me.label2Width,
            label1Width = config.label1Width || me.label1Width,
            cfg;

        me.edtAccount = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Account'),
            name: 'Account'
        });

        me.edtDisplayName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_UserDisplayName'),
            name: 'DisplayName'
        });

        me.edtHRID = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_HRID'),
            name: 'HRID'
        });

        me.edtLogonProviderName = Ext.create('Ext.form.RadioGroup', {
            fieldLabel: RS.$('All_AuthType'),
            disabledCls: '',
            cls: 'yz-radiogroup-gap-x',
            items: [
                { boxLabel: RS.$('All_AuthType_Local'), name: 'LogonProviderName', inputValue: 'Local' },
                { boxLabel: RS.$('All_AuthType_NT'), name: 'LogonProviderName', inputValue: 'NT' }
            ]
        });

        me.edtPassword = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Pwd'),
            name: 'Password',
            disabled: mode == 'edit',
            inputType: 'password'
        });

        me.edtPasswordCfm = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_PwdCfm'),
            name: 'PasswordCfm',
            disabled: mode == 'edit',
            inputType: 'password'
        });

        me.edtBirthday = Ext.create('Ext.form.field.Date', {
            fieldLabel: RS.$('All_Birthday'),
            flex: 4,
            name: 'Birthday'
        });

        me.edtSex = Ext.create('Ext.form.RadioGroup', {
            fieldLabel: RS.$('All_Sex'),
            flex: 3,
            labelStyle: 'padding-left:12px;',
            disabledCls: '',
            cls: 'yz-radiogroup-gap-xx',
            items: [
                { boxLabel: RS.$('All_Male'), name: 'Sex', inputValue: 'Male' },
                { boxLabel: RS.$('All_Female'), name: 'Sex', inputValue: 'Female' }
            ]
        });

        me.edtDateHired = Ext.create('Ext.form.field.Date', {
            fieldLabel: RS.$('All_DateHired'),
            flex: 4,
            reference: 'edtDateHired',
            name: 'DateHired'
        });

        me.edtOffice = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Office'),
            flex: 3,
            labelStyle: 'padding-left:12px;',
            name: 'Office'
        });

        me.edtCostCenter = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_CostCenter'),
            flex: 3,
            labelStyle: 'padding-left:12px;',
            name: 'CostCenter'
        });

        me.edtOfficePhone = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_OfficePhone'),
            flex: 4,

            name: 'OfficePhone'
        });

        me.edtHomePhone = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_HomePhone'),
            flex: 3,
            labelStyle: 'padding-left:12px;',
            name: 'HomePhone'
        });

        me.edtMobile = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Mobile'),
            flex: 3,
            labelStyle: 'padding-left:12px;',
            name: 'Mobile'
        });

        me.edtEMail = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_EMail'),
            flex: 4,
            name: 'EMail'
        });

        me.edtWWWHomePage = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_HomePage'),
            flex: 6,
            labelStyle:'padding-left:12px;',
            name: 'WWWHomePage'
        });

        me.edtDescription = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: RS.$('All_Desc'),
            cls: 'yz-textarea-2line',
            flex: 1,
            reference: 'edtDescription',
            name: 'Description',
            margin:0,
        });

        me.chkDisabled = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('All_BoxLabel_Account_Disabled'),
            margin: '0 0 0 20',
            name: 'Disabled'
        });

        me.headshot = Ext.create('YZSoft.src.form.field.Headshot',{
            width: 134,
            height: 134,
            reference: 'headshot',
            editable: !config.readOnly,
            style: 'border:solid 3px #eee'
        });

        me.sign = Ext.create('YZSoft.src.form.field.Sign',{
            reference: 'sign',
            editable: !config.readOnly,
            width: 186,
            height:86,
            style: 'border:solid 3px #eee'
        });

        cfg = {
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'container',
                    flex:4,
                    layout: {
                        type: 'vbox',
                        align:'stretch'
                    },
                    items: [
                        me.edtAccount,
                        me.edtDisplayName,
                        me.edtHRID,
                        me.edtLogonProviderName,
                        me.edtPassword,
                        me.edtPasswordCfm
                    ]
                }, {
                    xtype: 'container',
                    flex: 6,
                    layout: {
                        type: 'hbox'
                    },
                    items: [me.chkDisabled, { xtype: 'tbfill' }, {
                        xtype: 'container',
                        margin:'68 80 0 0',
                        layout: {
                            type: 'vbox',
                            align: 'center'
                        },
                        items: [me.sign, {
                            xtype: 'label',
                            padding: '5px',
                            html: RS.$('All_SignWithSize')
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [{
                            xtype: 'container',
                            layout: {
                                type: 'vbox',
                                align:'center'
                            },
                            items: [me.headshot, {
                                xtype: 'label',
                                padding: '5px',
                                html: RS.$('All_HeadshotWithSize')
                            }]
                        }]
                    }]
                }]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    me.edtBirthday,
                    me.edtSex, {
                        flex:3
                    }
                ]
            },{
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    me.edtDateHired,
                    me.edtOffice,
                    me.edtCostCenter
                ]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    me.edtOfficePhone,
                    me.edtHomePhone,
                    me.edtMobile
                ]
            }, {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [
                    me.edtEMail,
                    me.edtWWWHomePage
                ]
            }, me.edtDescription]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    applyStatus: function (readOnly, objectEditable) {
        var me = this,
            disabled = readOnly || !objectEditable;

        if (readOnly)
            disabled = false;

        me.edtAccount.setReadOnly(disabled);
        me.edtDisplayName.setReadOnly(disabled);
        me.edtHRID.setReadOnly(disabled);
        me.edtBirthday.setReadOnly(disabled);
        me.edtDateHired.setReadOnly(disabled);
        me.edtOffice.setReadOnly(disabled);
        me.edtCostCenter.setReadOnly(disabled);
        me.edtOfficePhone.setReadOnly(disabled);
        me.edtHomePhone.setReadOnly(disabled);
        me.edtMobile.setReadOnly(disabled);
        me.edtEMail.setReadOnly(disabled);
        me.edtWWWHomePage.setReadOnly(disabled);
        me.edtDescription.setReadOnly(disabled);

        me.edtLogonProviderName.setDisabled(disabled);
        me.edtSex.setDisabled(disabled);
    },

    fill: function (data) {
        var me = this;

        me.headshot.setValue(data.Account);
        me.sign.setValue(data.Account);
        me.headshot.upload.params.temporaryUid = data.temporaryUid;
        me.sign.upload.params.temporaryUid = data.temporaryUid;
        me.getForm().setValues(data);
    },

    save: function () {
        var me = this,
            rv = me.getValuesSubmit();

        rv.Account = Ext.String.trim(rv.Account);
        rv.headshot = me.headshot.getValue();
        rv.sign = me.sign.getValue();

        if (!rv.Sex)
            rv.Sex = 'Unknown';

        return rv;
    }
});