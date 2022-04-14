/*
config:
folderPath
objectName
*/
Ext.define('YZSoft.connection.connections.K3WISE.Dlg', {
    extend: 'YZSoft.connection.connections.DlgAbstract',
    title: RS.$('Connection_K3WISEDlg_Title'),
    bodyPadding: 0,
    minHeight: 532,
    default: {
        r: {
            Name: null,
            Cn: {
                address: null,
                authorityCode: null,
                timeout: 30
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
                        return !get('r.Cn.address') || !get('r.Cn.authorityCode');
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
                fieldLabel: RS.$('Connection_K3WISE_address'),
                emptyText: '--http://127.0.0.1/K3API--',
                bind: '{r.Cn.address}'
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('Connection_K3WISE_authorityCode'),
                emptyText: '--authorityCode--',
                height: 80,
                bind: '{r.Cn.authorityCode}'
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