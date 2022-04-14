
Ext.define('YZSoft.src.datasource.query.panel.TableAssist', {
    extend: 'Ext.panel.Panel',
    border:false,

    constructor: function (config) {
        var me = this,
            config = config || {},
            datasourceName = config.datasourceName || 'Default',
            dsNames,cfg;

        me.cmbDS = Ext.create('YZSoft.src.datasource.field.DSServerComboBox', {
            flex: 1,
            margin: 0,
            value: datasourceName,
            listeners: {
                change: function (combo, newValue, oldValue, eOpts) {
                    me.tree.setDatasource(newValue);
                }
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            glyph: 0xe60f,
            tooltip: RS.$('All_Refresh'),
            margin:0,
            handler: function () {
                me.tree.refresh();
            }
        });

        me.tree = Ext.create('YZSoft.src.datasource.query.tree.Tables', {
            flex: 1
        });

        cfg = {
            layout: 'fit',
            tbar: {
                cls: 'yz-tbar-module',
                padding: '2 3 4 3',
                style:'background-color:#f5f5f5;',
                items: [
                    me.cmbDS,
                    me.btnRefresh
                ]
            },
            items: [
                me.tree
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.tree, ['tableClick', 'columnClick']);

        me.on({
            single: true,
            afterrender: function () {
                me.tree.setDatasource(me.cmbDS.getValue());               
            }
        });
    },

    getDatasourceName: function () {
        return this.cmbDS.getValue();
    }
});