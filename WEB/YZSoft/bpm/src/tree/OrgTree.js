/*
config
getRootOUsType
srcoupath
perm
*/

Ext.define('YZSoft.bpm.src.tree.OrgTree', {
    extend: 'Ext.tree.Panel',
    requires: [
        'YZSoft.bpm.src.model.TreeOU'
    ],
    region: 'center',
    margins: '0 0 0 0',
    rootVisible: false,
    useArrows: true,
    hideHeaders: true,
    scrollable: true,
    width: 210,
    minWidth: 160,
    dblclick: false,
    perm: ['Read'],

    constructor: function (config) {
        var me = this,
            config = config || {},
            perm = config.perm || me.perm,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.TreeOU',
            root: me.treeRoot,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: {
                    method: 'GetOrgTree',
                    perm: perm,
                    getRootOUsType: config.getRootOUsType,
                    srcoupath: config.srcoupath
                }
            }
        });

        cfg = {
            store: me.store,
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
            scope: me,
            afterrender:'onAfterRender'
        });
    },

    onAfterRender: function (tree, eOpts) {
        var me = this,
            root = me.getRootNode(),
            store = me.getStore(),
            sm = me.getSelectionModel();

        store.load({
            loadMask: $S.loadMask.first.loadMask,
            callback: function () {
                root.expand(false, function () {
                    var dirnode = store.findRecord('dirou', true);
                    if (dirnode) {
                        sm.select([dirnode]);
                        delete dirnode.data.dirou;
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