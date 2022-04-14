
Ext.define('YZSoft.personal.UserInfoPanel', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.Headshot',
        'YZSoft.src.form.field.Sign',
        'YZSoft.src.overrides.form.field.DisplayField'
    ],
    cls:'yz-pnl-userinfo',
    referenceHolder: true,
    scrollable: true,
    border: false,
    padding: '0 0 0 0',

    constructor: function (config) {
        var me = this,
            cmps, cfg;

        me.load({
            async: false,
            success: function (action) {
                me.result = action.result;
            }
        });

        cmps = {
            base: {
                xtype: 'panel',
                cls: 'sec base',
                overCls: 'over',
                padding: '30 0 0 0',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xclass: 'YZSoft.src.component.Headshort',
                    uid: userInfo.Account,
                    cls: ['yz-cmp-headshort', 'yz-cmp-headshort-square'],
                    editable: true,
                    thumbnail:'L',
                    width: 130,
                    height: 130,
                    listeners: {
                        headshotChanged: function () {
                            me.fireEvent('headshotChanged')
                        }
                    }
                }, {
                    xtype: 'container',
                    flex: 1,
                    padding: '0 0 0 30',
                    minHeight:130,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'component',
                        margin:'6 0 20 0',
                        bind: [
                            '<div class="name">{ShortName:text}{DisplayNameTrigger}</div>'
                        ].join(''),
                    },{
                        xtype: 'component',
                        margin: '0 0 20 0',
                        bind: [
                            '<div class="account-wrap">',
                            '<span>' + RS.$('All_Account') + ': {Account:text}</span>',
                            '<span class="sp">' + RS.$('All_HRID') + ': {HRID:text}{HRIDTrigger}</span>',
                            '<span class="sp">{Sex:sex}{SexTrigger}</span>',
                            '<span class="sp">{Birthday:old}{BirthdayTrigger}</span></div >'
                        ].join(''),
                    }, {
                        xtype: 'component',
                        bind: [
                            '<span style="max-width:100%">{Description:text}{DescriptionNameTrigger}</span>'
                        ].join(''),
                    }]
                }]
            },
            job: {
                xtype: 'panel',
                title: RS.$('All_Caption_UserPositionInfo'),
                cls: 'sec job',
                overCls: 'over',
                layout: {
                    type: 'vbox',
                    align:'stretch'
                },
                margin: '60 30 0 0',
                ui: 'light',
                glyph: 0xeace,
                header: {
                    cls: 'yz-header-active',
                    padding: '16 12 16 0'
                },
                items: [{
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'displayfield',
                        fieldLabel: RS.$('All_DateHired'),
                        editable: me.editable('DateHired'),
                        bind: '{DateHired}',
                        width:280
                    }, {
                        xtype: 'displayfield',
                        fieldLabel: RS.$('All_Office'),
                        editable: me.editable('Office'),
                        bind: '{Office}'
                    }]
                }, {
                    xtype: 'displayfield',
                    fieldLabel: RS.$('All_CostCenter'),
                    editable: me.editable('CostCenter'),
                    bind: '{CostCenter}'
                }]
            },
            contact: {
                xtype: 'panel',
                title: RS.$('All_Caption_UserContractInfo'),
                cls: 'sec contact',
                overCls: 'over',
                margin: '35 30 0 0',
                ui: 'light',
                glyph: 0xe920,
                header: {
                    cls: 'yz-header-active',
                    padding: '16 12 16 0'
                },
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: RS.$('All_OfficePhone'),
                    editable: me.editable('OfficePhone'),
                    bind: '{OfficePhone}'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: RS.$('All_HomePhone'),
                    editable: me.editable('HomePhone'),
                    bind: '{HomePhone}'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: RS.$('All_Mobile'),
                    editable: me.editable('Mobile'),
                    bind: '{Mobile}'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: RS.$('All_EMail'),
                    editable: me.editable('EMail'),
                    bind: '{EMail}'
                }, {
                    xtype: 'displayfield',
                    fieldLabel: RS.$('All_HomePage'),
                    editable: me.editable('WWWHomePage'),
                    bind: '{WWWHomePage}'
                }]
            },
            sign: {
                xtype: 'panel',
                title: RS.$('All_MySign'),
                cls: 'sec sign',
                margin: '35 30 0 0',
                padding: '0 0 60 0',
                ui: 'light',
                glyph: 0xeacf,
                header: {
                    cls: 'yz-header-active',
                    padding: '16 12 16 0',
                },
                layout: {
                    type: 'vbox'
                },
                items: [{
                    xclass: 'YZSoft.src.component.Sign',
                    uid: userInfo.Account,
                    cls: ['yz-cmp-sign'],
                    editable: true,
                    thumbnail: 'M',
                    width: 180,
                    height: 80,
                    margin:'0 0 0 200'
                }]
            }
        };

        cfg = {
            viewModel: {
                data: me.result.user,
                formulas: {
                    DisplayNameTrigger: function (get) {
                        return me.editableHtml('DisplayName');
                    },
                    HRIDTrigger: function (get) {
                        return me.editableHtml('HRID');
                    },
                    BirthdayTrigger: function (get) {
                        return me.editableHtml('Birthday');
                    },
                    DescriptionNameTrigger: function (get) {
                        return me.editableHtml('Description');
                    },
                    SexTrigger: function (get) {
                        return me.editableHtml('Sex');
                    }
                }
            },
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            defaults: {
            },
            items: [
                cmps.base,
                cmps.job,
                cmps.contact,
                cmps.sign
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            delegate: '.yz-trigger-field-editor',
            element:'body',
            click: 'onEditorTriggerClick'
        });
    },

    onActivate: function (times) {
        if (times != 0)
            this.load();
    },

    onEditorTriggerClick: function (e, t, eOpts) {
        var me = this,
            domTrigger = e.getTarget('.yz-trigger-field-editor'),
            field = domTrigger.getAttribute('yz-edit-field'),
            editor = me.getEditorConfig(field);

        if (!editor)
            return;

        Ext.apply(editor, {
            itemId: 'defaultEditor',
            name: 'value',
            value: me.getViewModel().get(field),
            msgTarget: 'under',
            validateOnFocusLeave: true,
            margin: 0,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() === e.ENTER) {
                        me.submit();
                    }
                }
            }
        });

        me.win = Ext.create('Ext.window.Window', { //777777
            title: RS.$('All_ChangeUserInfo'),
            cls:'yz-window-frame',
            autoShow: true,
            resizable: false,
            bodyPadding: '40 26 40 26',
            defaultFocus: editor.itemId,
            referenceHolder: true,
            field: field,
            items: [{
                xtype: 'form',
                reference:'form',
                items: [editor]
            }],
            buttons: [{
                text: RS.$('All_OK'),
                cls: 'yz-btn-default',
                scope:me,
                handler: 'submit'
            }]
        });
    },

    editable: function (field) {
        var me = this;
        return (field && !Ext.Array.contains(me.result.setting.Fields, field)) ? field:false;
    },

    editableHtml: function (field) {
        var me = this,
            editable = me.editable(field);

        if (editable)
            return Ext.String.format('<div class="yz-trigger-field-editor yz-glyph yz-glyph-e61c" yz-edit-field="{0}" data-qtip="{1}"></div>', field, RS.$('All_Edit'));
        else
            return '';
    },

    getEditorConfig: function (field) {
        var me = this,
            cfg;

        switch (field) {
            case 'DateHired':
            case 'Birthday':
                cfg = {
                    xtype: 'datefield',
                    editable: false,
                    maxValue: new Date(),
                    fieldLabel: RS.$('All_' + field),
                    width: 320
                };
                break;
            case 'Office':
            case 'CostCenter':
            case 'OfficePhone':
            case 'HomePhone':
            case 'Mobile':
            case 'EMail':
            case 'HRID':
            case 'DisplayName':
                cfg = {
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_' + field),
                    width: 320
                };
                break;
            case 'WWWHomePage':
                cfg = {
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_HomePage'),
                    width: 320
                };
                break;
            case 'Description':
                cfg = {
                    xtype: 'textarea',
                    fieldLabel: RS.$('All_UserDesc'),
                    width: 600,
                    grow: true,
                    growMin: 100,
                    labelAlign:'top'
                };
                break;
            case 'Sex':
                cfg = {
                    xtype: 'radiogroup',
                    fieldLabel: RS.$('All_Sex'),
                    width: 320,
                    simpleValue:true,
                    items: [
                        { boxLabel: RS.$('All_Male'), name: 'value', inputValue: 'Male' },
                        { boxLabel: RS.$('All_Female'), name: 'value', inputValue: 'Female' }
                    ]
                };
                break;
        }

        switch (field) {
            case 'DisplayName':
                Ext.apply(cfg, {
                    validator: function (value) {
                        if (!value)
                            return RS.$('All_Personal_Warn_DisplayNameEmpty');

                        return true;
                    }
                });
                break;
        }

        return cfg;
    },

    submit: function () {
        var me = this,
            win = me.win,
            formPanel = win.lookupReference('form'),
            form = formPanel.getForm(),
            value = form.getValues().value,
            field = win.field,
            data;

        if (!form.isValid())
            return;

        data = {};
        data[field] = value;

        win.close();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Personal.ashx'),
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me
            },
            params: {
                method: 'SaveUserInfo'
            },
            jsonData: [data],
            success: function (action) {
                if (field == 'DisplayName')
                    me.fireEvent('usernameChanged', value);

                me.load({
                    waitMsg: {
                        msg: RS.$('All_Save_Succeed'),
                        msgCls: 'yz-mask-msg-success',
                        target:me
                    }
                });
            }
        });
    },

    load: function (config) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Personal.ashx'),
            params: {
                method: 'GetLoginUserInfo'
            },
            success: function (action) {
                me.getViewModel().set(action.result.user);
                me.denyFields = action.result.setting.Fields;
            }
        }, config));
    }
});