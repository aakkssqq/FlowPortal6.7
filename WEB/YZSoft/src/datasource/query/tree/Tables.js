
Ext.define('YZSoft.src.datasource.query.tree.Tables', {
    extend: 'Ext.tree.Panel',
    rootVisible: false,
    useArrows: true,
    border: false,
    hideHeaders: true,
    config: {
        datasource:null
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'Ext.data.TreeModel',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
                extraParams: {
                    method: 'GetTreeOfDataSources',
                    datasource:'Default'
                }
            }
        });

        cfg = {
            store: me.store,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                renderer: function (v, metaData, record) {
                    if (record.data.data.isColumn)
                        return Ext.String.format('{0}<span class="yz-treeitem-column-datatype">({1})</span>', v, record.data.data.Type);
                    else
                        return v;
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            itemclick: function (tree, record, item, index, e, eOpts) {
                if (record.data.data.isTable)
                    me.fireEvent('tableClick', record.data.data);
                if (record.data.data.isColumn)
                    me.fireEvent('columnClick', record.data.data);
            }
        })

        //me.on({
        //    single: true,
        //    afterrender: function (tree, eOpts) {
        //        var root = me.getRootNode(),
        //            store = me.getStore(),
        //            sm = me.getSelectionModel();

        //        store.load({
        //            loadMask: $S.loadMask.first.loadMask,
        //            callback: function () {
        //                root.expand(false);
        //            }
        //        });
        //    }
        //});
    },

    updateDatasource: function (newValue) {
        var me = this,
            root = me.getRootNode(),
            params = me.store.getProxy().getExtraParams();

        Ext.apply(params,{
            datasource: newValue || 'Default'
        });

        me.store.load({
            loadMask: {
                msg: RS.$('All_Loading'),
                target: me
            },
            callback: function () {
                root.expand(false);
            }
        });
    },

    refresh: function (config) {
        var me = this;

        me.store.load(Ext.apply({
            loadMask: {
                msg: RS.$('All_Loading'),
                target: me,
                start: 0
            }
        }, config));
    }
});