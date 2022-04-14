/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.WeChatWork.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_WeChatWorkDlg_Title'),
    bodyPadding: 0,
    minHeight: 478,
    default: {
        r: {
            Name: null,
            Cn: {
                corpId: null,
                corpSecret: null,
                agentId: null,
                timeout: 30
            }
        }
    },
    viewModel: {
        formulas: {
            testdisabled: function (get) {
                return !get('r.Cn.corpId') || !get('r.Cn.corpSecret');
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
                fieldLabel: RS.$('Connection_WeChatWork_corpId'),
                emptyText: '--corpId--',
                bind: '{r.Cn.corpId}'
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('Connection_WeChatWork_corpSecret'),
                emptyText: '--corpSecret--',
                height: 80,
                bind: '{r.Cn.corpSecret}'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Connection_WeChatWork_agentId'),
                emptyText: '--agentId--',
                bind: '{r.Cn.agentId}'
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