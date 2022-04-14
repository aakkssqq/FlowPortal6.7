/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.U8OpenAPI.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_U8OpenAPIDlg_Title'),
    bodyPadding: 0,
    minHeight: 478,
    default: {
        r: {
            Name: null,
            Cn: {
                from_account: null,
                app_key: null,
                app_secret: null,
                to_account: null,
                timeout: 30
            }
        }
    },
    viewModel: {
        formulas: {
            testdisabled: function (get) {
                return !get('r.Cn.from_account') || !get('r.Cn.app_key') || !get('r.Cn.app_secret') || !get('r.Cn.to_account');
            },
            savedisabled: function (get) {
                return !get('r.Name');
            }
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.pageGeneral = me.createPageGeneral({
            title: RS.$('All_General'),
            padding: '25 46 5 46'
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
                me.pageAdvanced
            ]
        });

        cfg = {
            layout: 'fit',
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createPageGeneral: function (config) {
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
                fieldLabel: RS.$('Connection_U8OpenAPI_from_account'),
                emptyText: '--from_account--',
                bind: '{r.Cn.from_account}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_U8OpenAPI_app_key'),
                emptyText: '--app_key--',
                bind: '{r.Cn.app_key}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_U8OpenAPI_app_secret'),
                emptyText: '--app_secret--',
                bind: '{r.Cn.app_secret}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_U8OpenAPI_to_account'),
                emptyText: '--to_account--',
                bind: '{r.Cn.to_account}'
            }]
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
    }
});