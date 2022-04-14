
/*
activeNode: Demo/ProductionDevice
*/
Ext.define('YZSoft.bpm.post.Tree', {
    extend: 'Ext.tree.Panel',
    requires: [
        'YZSoft.bpm.src.model.ProcessFolder'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.ProcessFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetTree',
                    perm: 'Execute',
                    expand: true
                }
            },
            listeners: {
                single: true,
                load: function () {
                    me.getRootNode().expand();
                    if (me.activeNode) {
                        var node = me.store.getNodeById(me.activeNode);
                        if (node) {
                            var sm = me.getSelectionModel();
                            sm.select(node);
                        }
                    }
                }
            }
        });

        cfg = {
            rootVisible: true,
            useArrows: true,
            store: me.store,
            root: {
                text: RS.$('All_ProcessLib'),
                path: 'root',
                expanded: false
            },
            listeners: {
                itemclick: function (view, record, item, index, e, eOpts) {
                    e.stopEvent();
                    me.store.load({
                        params: {
                            path: record.isRoot() ? '' : record.data.path,
                            start: 0
                        }
                    });
                }
            },
            tools: [{
                type: 'refresh',
                tooltip: RS.$('All_Refresh_Tip'),
                handler: function (event, toolEl, panel) {
                    me.store.reload({
                        loadMask: true
                    });
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
