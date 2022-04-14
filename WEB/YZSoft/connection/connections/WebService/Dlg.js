/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.WebService.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_WebServiceDlg_Title'),
    bodyPadding: 0,
    minHeight: 478,
    default: {
        r: {
            Name: null,
            Cn: {
                wsdlBaseUrl: null,
                extAttrs: null,
                authType: null,
                authSetting: {
                },
                requestTimeout: 30
            }
        }
    },
    netTypes2JSchema: {
        String: {
            type: 'string'
        },
        Int32: {
            type: 'integer'
        },
        Decimal: {
            type: 'number'
        },
        Boolean: {
            type: 'boolean'
        },
        DateTime: {
            type: 'string', format: 'date-time'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.pageGeneral = me.createPageGeneral({
            title: RS.$('All_General'),
            padding: '25 46 5 46'
        });

        me.pageExt = me.createPageExt({
            title: RS.$('Connection_ExtAttrs_Title'),
            padding: '25 26 5 26'
        });

        me.pageAuth = me.createPageAuth({
            title: RS.$('Connection_Auth_Title'),
            padding: '10 26 5 26'
        });

        me.pageAdvanced = me.createPageAdvanced({
            title: RS.$('All_Advanced'),
            padding: '25 46 5 46'
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pageGeneral,
                me.pageExt,
                me.pageAuth,
                me.pageAdvanced
            ]
        });

        cfg = {
            layout: 'fit',
            items: [me.tabMain],
            viewModel: {
                formulas: {
                    testdisabled: function (get) {
                        return !get('r.Cn.wsdlBaseUrl');
                    },
                    savedisabled: function (get) {
                        return !get('r.Name');
                    }
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createPageGeneral: function (config) {
        var me = this;

        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_ConnectionName'),
                cls: 'yz-field-required',
                defaultfocusfield:true,
                bind: '{r.Name}',
                vtype: 'objname'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_WebService_wsdlBaseUrl'),
                emptyText: Ext.String.format(RS.$('Connection_WebService_wsdlBaseUrl_EmptyText'), 'http://192.168.1.106'),
                bind: '{r.Cn.wsdlBaseUrl}',
                flex:1
            }]
        }, config));
    },

    createPageExt: function (config) {
        var me = this;

        me.extAttrsField = Ext.create('YZSoft.src.form.field.ExtAttributes', {
        });

        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [me.extAttrsField]
        }, config));
    },

    createPageAuth: function (config) {
        var me = this;

        me.fieldsetToken = Ext.create('Ext.form.FieldSet', {
            title: RS.$('Connection_Auth_FieldSetTitle_Token'),
            authType: 'token',
            checkboxToggle: true,
            collapsed: true,
            padding: '0 15 15 15',
            style: 'background-color:transparent;',
            layout: {
                type: 'vbox',
                align: 'middle'
            },
            items: [{
                xtype: 'button',
                text: RS.$('Connection_Auth_Setting_Token'),
                minWidth: 200,
                scope: me,
                handler: 'onSettingTokenClick'
            }]
        });

        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [me.fieldsetToken]
        }, config));
    },

    createPageAdvanced: function (config) {
        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Connection_WebService_CallTimeout'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    bind: '{r.Cn.requestTimeout}',
                    width: 80,
                    minValue: -1,
                    allowDecimals: false
                }, {
                    xtype: 'displayfield',
                    value: RS.$('Connection_TimeoutUnit'),
                    margin: '0 0 0 16'
                }]
            }]
        }, config));
    },

    onSettingTokenClick: function () {
        var me = this,
            requestSchema = me.getExtAttrSchema(),
            data = me.save();

        Ext.create('YZSoft.src.dialogs.CallWebServiceForToken', {
            title: Ext.String.format(RS.$('Connection_WebService_TokenAuthDlg_Title'), data.Name || 'Web Service'),
            autoShow: true,
            requestSchema: {
                Payload: {
                    type: 'object',
                    yzext: {
                        isPayload: true
                    },
                    properties: requestSchema
                }
            },
            data: me.fieldsetToken.authSetting,
            fn: function (setting) {
                me.fieldsetToken.authSetting = setting;
            }
        });
    },

    getExtAttrSchema: function () {
        var me = this,
            extAttrs = me.extAttrsField.getValue(),
            extAttrsProperties = {};

        Ext.each(extAttrs, function (attr) {
            extAttrsProperties[attr.name] = Ext.clone(me.netTypes2JSchema[attr.type]);
        });

        return {
            ExtAttrs: {
                type: 'object',
                properties: extAttrsProperties
            }
        };
    },

    onTestClick: function () {
        var me = this,
            data = me.save();

        if (!data.Cn.authType)
        {
            YZSoft.alert(RS.$('Connection_WebService_NoAuth_NeedNotTesting'));
            return;
        }

        me.callParent(arguments);
    },

    onLoad: function (data) {
        var me = this;

        me.extAttrsField.setValue(data.Cn.extAttrs);

        data.Cn.authSetting = data.Cn.authSetting || {};
        Ext.each([me.fieldsetToken], function (fieldset) {
            fieldset.authSetting = Ext.clone(data.Cn.authSetting[fieldset.authType]);
            if (fieldset.authType == data.Cn.authType)
                fieldset.setExpanded(true);
        });
    },

    save: function () {
        var me = this,
            rv = me.callParent();

        rv.Cn.extAttrs = me.extAttrsField.getValue();

        rv.Cn.authType = null;
        rv.Cn.authSetting = {};
        Ext.each([me.fieldsetToken], function (fieldset) {
            rv.Cn.authSetting[fieldset.authType] = fieldset.authSetting;
            if (fieldset.checkboxCmp.checked)
                rv.Cn.authType = fieldset.authType;
        });

        return rv;
    }
});