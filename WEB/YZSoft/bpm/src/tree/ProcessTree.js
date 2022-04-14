/*
config
bpmServer
perm
*/

Ext.define('YZSoft.bpm.src.tree.ProcessTree', {
    extend: 'Ext.tree.Panel',
    requires: [
        'YZSoft.bpm.src.model.ProcessFolder'
    ],
    perm:'Read',

    constructor: function (config) {
        var me = this,
            config = config || {},
            perm = config.perm || me.perm,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.ProcessFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams:{
                    method: 'GetTree',
                    bpmServer: config.bpmServer,
                    perm: perm
                }
            },
            listeners: {
                load: function () {
                    me.getRootNode().expand();
                }
            }
        });

        cfg = {
            title: RS.$('All_Post_Tree_Title'),
            store: me.store,
            border: false,
            rootVisible: true,
            useArrows: true,
            hideHeaders: true,
            selModel: Ext.create('Ext.selection.TreeModel', { mode: 'SINGLE' }),
            root: {
                text: RS.$('All_ProcessLib'),
                path: 'root',
                expanded: false
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.store.load({
                        loadMask: true
                    });
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    store = this.getStore(),
                    sm = this.getSelectionModel();

                sm.select(root);
                store.load({
                    loadMask: $S.loadMask.first.loadMask,
                    callback: function () {
                        root.expand(false);
                    }
                });
            }
        });
    },

    getPath: function (rec) {
        var field = 'text';

        var path = [rec.get(field)],
            parent = rec.parentNode;

        while (parent && parent.id != 'root') {
            path.unshift(parent.get(field));
            parent = parent.parentNode;
        }

        return path.join('<span style="padding:0px 2px">/</span>');
    }
});
