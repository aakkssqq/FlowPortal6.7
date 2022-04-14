/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.RESTful.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_RESTfulDlg_Title'),
    bodyPadding: 0,
    minHeight: 532,
    default: {
        r: {
            Name: null,
            Cn: {
                baseUrl: null,
                requestDataFormat: 'JSON',
                requestDataEncoding: 65001,
                responseDataFormat: 'JSON',
                responseDataEncoding: 65001,
                queryParams: null,
                headers: null,
                form: null,
                extAttrs: null,
                authType: null,
                authSetting: {
                },
                timeout: 30
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

        me.pageQueryParams = me.createPageQueryParams({
            title: RS.$('Connection_RESTful_QueryParams_Title'),
            padding: '25 26 5 26'
        });

        me.pageHeaders = me.createPageHeaders({
            title: RS.$('Connection_RESTful_Headers_Title'),
            padding: '25 26 5 26'
        });

        me.pageForm = me.createPageForm({
            title: RS.$('Connection_RESTful_Form_Title'),
            padding: '25 26 5 26'
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
                me.pageQueryParams,
                me.pageHeaders,
                me.pageForm,
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
                        return !get('r.Cn.baseUrl');
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
                fieldLabel: RS.$('Connection_RESTful_baseUrl'),
                emptyText: Ext.String.format(RS.$('Connection_RESTful_baseUrl_EmptyText'), 'https://api.yonyouup.com'),
                bind: '{r.Cn.baseUrl}'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Connection_RESTful_requestDataFormat'),
                layout: 'hbox',
                margin: 0,
                items: [{
                    xtype: 'combobox',
                    width: 120,
                    bind: '{r.Cn.requestDataFormat}',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { value: 'JSON', name: 'JSON' },
                            { value: 'XML', name: 'XML' }
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true
                }, {
                    xtype: 'displayfield',
                    value: RS.$('Connection_RESTful_Encode') + ':',
                    margin: '0 6 0 30'
                }, {
                    xtype: 'combobox',
                    width: 120,
                    bind: '{r.Cn.requestDataEncoding}',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { value: 20127, name: 'ASCII' },
                            { value: 936, name: 'GB2312' },
                            { value: 950, name: 'BIG5' },
                            { value: 932, name: 'JIS' },
                            { value: 65001, name: 'UTF-8' },
                            { value: 1200, name: 'Unicode' }
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Connection_RESTful_responseDataFormat'),
                layout: 'hbox',
                margin: 0,
                items: [{
                    xtype: 'combobox',
                    width: 120,
                    bind: '{r.Cn.responseDataFormat}',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { value: 'JSON', name: 'JSON' },
                            { value: 'XML', name: 'XML' },
                            { value: 'Other', name: RS.$('All_Other') },
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true
                }, {
                    xtype: 'displayfield',
                    value: RS.$('Connection_RESTful_Decode') + ':',
                    margin: '0 6 0 30'
                }, {
                    xtype: 'combobox',
                    width: 120,
                    bind: '{r.Cn.responseDataEncoding}',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { value: 20127, name: 'ASCII' },
                            { value: 936, name: 'GB2312' },
                            { value: 950, name: 'BIG5' },
                            { value: 932, name: 'JIS' },
                            { value: 65001, name: 'UTF-8' },
                            { value: 1200, name: 'Unicode' }
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true
                }]
            }]
        }, config));
    },

    createPageQueryParams: function(config) {
        var me = this;

        me.queryParamsField = Ext.create('YZSoft.src.form.field.ExtAttributes', {
            types: 'String',
            typeColumn: {
                hidden: true
            }
        });

        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [me.queryParamsField]
        }, config));
    },

    createPageHeaders: function(config) {
        var me = this;

        me.headersField = Ext.create('YZSoft.src.form.field.ExtAttributes', {
            types: 'String',
            typeColumn: {
                hidden: true
            }
        });

        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [me.headersField]
        }, config));
    },

    createPageForm: function(config) {
        var me = this;

        me.formField = Ext.create('YZSoft.src.form.field.ExtAttributes', {
            types: 'String',
            typeColumn: {
                hidden: true
            }
        });

        return Ext.create('Ext.panel.Panel', Ext.apply({
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [me.formField]
        }, config));
    },

    createPageExt: function(config) {
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
                handler:'onSettingTokenClick'
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
                fieldLabel: RS.$('Connection_RequestTimeout'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    bind: '{r.Cn.timeout}',
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

        Ext.create('YZSoft.src.dialogs.CallRESTfulForToken', {
            title: Ext.String.format(RS.$('Connection_RESTful_TokenAuthDlg_Title'), data.Name || 'RESTFul'),
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
            queryParams = me.queryParamsField.getValue(),
            headers = me.headersField.getValue(),
            form = me.formField.getValue(),
            extAttrs = me.extAttrsField.getValue(),
            queryParamsProperties = {}, extAttrsProperties = {};

        Ext.each(queryParams, function (attr) {
            queryParamsProperties[attr.name] = {
                type: 'string'
            }
        });

        Ext.each(extAttrs, function (attr) {
            extAttrsProperties[attr.name] = Ext.clone(me.netTypes2JSchema[attr.type]);
        });

        return {
            QueryParams: {
                type: 'object',
                properties: queryParamsProperties
            },
            ExtAttrs: {
                type: 'object',
                properties: extAttrsProperties
            }
        };
    },

    onLoad: function (data) {
        var me = this;

        me.queryParamsField.setValue(data.Cn.queryParams);
        me.headersField.setValue(data.Cn.headers);
        me.formField.setValue(data.Cn.form);
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
        
        rv.Cn.queryParams = me.queryParamsField.getValue();
        rv.Cn.headers = me.headersField.getValue();
        rv.Cn.form = me.formField.getValue();
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