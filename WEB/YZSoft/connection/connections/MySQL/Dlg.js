/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.MySQL.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_MySQLDlg_Title'),
    bodyPadding: 0,
    minHeight: 478,
    default: {
        r: {
            Name: null,
            Cn: {
                Server: 'localhost',
                UserID: 'root',
                Password: null,
                Port: 3306,
                Database: null,
                CommandTimeout: 30
            }
        }
    },
    viewModel: {
        formulas: {
            testdisabled: function (get) {
                return !get('r.Cn.Server') || !get('r.Cn.UserID') || !get('r.Cn.Password') || !get('r.Cn.Port');
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
                //allowBlank: false,
                vtype: 'objname'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_MySQL_Server'),
                bind: '{r.Cn.Server}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_UID'),
                bind: '{r.Cn.UserID}',
                anchor: '60%'
            }, {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: RS.$('All_Pwd'),
                bind: '{r.Cn.Password}',
                anchor: '60%'
            }, {
                xtype: 'numberfield',
                fieldLabel: RS.$('All_Port'),
                bind: '{r.Cn.Port}',
                minValue: 0,
                allowDecimals: false,
                hideTrigger: true,
                anchor: '30%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_MySQL_Database'),
                bind: '{r.Cn.Database}'
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