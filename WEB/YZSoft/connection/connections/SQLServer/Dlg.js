/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.SQLServer.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_SQLServerDlg_Title'),
    bodyPadding: 0,
    minHeight: 478,
    default: {
        r: {
            Name: null,
            Cn: {
                DataSource: '(local)',
                IntegratedSecurity: false,
                UserID: null,
                Password: null,
                InitialCatalog: null,
                Port: 1433,
                CommandTimeout:30
            }
        }
    },
    viewModel: {
        formulas: {
            testdisabled: function (get) {
                return !get('r.Name');
            },
            savedisabled: function (get) {
                return !get('r.Name');
            },
            uiddisabled: function (get) {
                return get('r.Cn.IntegratedSecurity');
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
                //allowBlank: false,
                vtype: 'objname'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SQLServer_DataSource'),
                bind: '{r.Cn.DataSource}'
            }, {
                xtype: 'radiogroup',
                fieldLabel: RS.$('Connection_SQLServer_IntegratedSecurity'),
                simpleValue: true,  // set simpleValue to true to enable value binding
                bind: '{r.Cn.IntegratedSecurity}',
                vertical: true,
                columns: 1,
                margin: '0 0 6 0',
                items: [
                    { boxLabel: 'Windows', inputValue: true },
                    { boxLabel: 'SQL Server', inputValue: false },
                ]
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_UID'),
                bind: {
                    value: '{r.Cn.UserID}',
                    disabled: '{uiddisabled}'
                },
                margin: '0 0 10 110'
            }, {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: RS.$('All_Pwd'),
                bind: {
                    value: '{r.Cn.Password}',
                    disabled: '{uiddisabled}'
                },
                margin: '0 0 12 110'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SQLServer_InitialCatalog'),
                bind: '{r.Cn.InitialCatalog}'
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
                xtype: 'numberfield',
                fieldLabel: RS.$('All_Port'),
                bind: '{r.Cn.Port}',
                minValue: 0,
                allowDecimals: false,
                hideTrigger: true
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Connection_DBCommandTimeout'),
                margin: 0,
                layout: 'hbox',
                items: [{
                    xtype: 'numberfield',
                    bind: '{r.Cn.CommandTimeout}',
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