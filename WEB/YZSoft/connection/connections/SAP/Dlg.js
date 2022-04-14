/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.SAP.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_SAPDlg_Title'),
    bodyPadding: 0,
    minHeight: 532,
    default: {
        r: {
            Name: null,
            Cn: {
                AppServerHost: null,
                SystemNumber:null,
                Name: null,
                Client: null,
                User: null,
                Password: null,
                Language: 'EN',
                SAPRouter: null,
                PoolSize: 5,
                PeakConnectionsLimit: 10,
                ConnectionIdleTimeout: 60
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
            items: [me.tabMain],
            viewModel: {
                formulas: {
                    testdisabled: function (get) {
                        return !get('r.Cn.AppServerHost') || !get('r.Cn.SystemNumber') || !get('r.Cn.Client') || !get('r.Cn.User') || !get('r.Cn.Password') || !get('r.Cn.Name') || !get('r.Cn.Language');
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
                fieldLabel: RS.$('Connection_SAP_AppServerHost'),
                bind: '{r.Cn.AppServerHost}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SAP_SystemNumber'), //实例编号
                bind: '{r.Cn.SystemNumber}',
                anchor: '30%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SAP_Name'), //系统标识
                bind: '{r.Cn.Name}',
                anchor: '30%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SAP_Client'),
                bind: '{r.Cn.Client}',
                anchor: '30%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_UID'),
                bind: '{r.Cn.User}',
                anchor: '60%'
            }, {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: RS.$('All_Pwd'),
                bind: '{r.Cn.Password}',
                anchor: '60%'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_Language'),
                bind: '{r.Cn.Language}',
                anchor: '30%'
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
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SAP_SAPRouter'),
                bind: '{r.Cn.SAPRouter}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_SAP_PoolSize'),
                anchor: '30%',
                hideTrigger: true,
                minValue: 1,
                maxValue: 100,
                allowDecimals: false,    
                bind: '{r.Cn.PoolSize}'
            }]
        }, config));
    },

    save: function () {
        var me = this,
            rv = me.callParent();

        return rv;
    }
});