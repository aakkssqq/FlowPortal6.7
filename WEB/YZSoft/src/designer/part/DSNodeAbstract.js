
Ext.define('YZSoft.src.designer.part.DSNodeAbstract', {
    extend: 'YZSoft.src.designer.part.Abstract',
    initDemoData: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.callParent();

        if (me.dsid)
            me.setDSNode(me.designer.getDSNode(me.dsid));
        else if (me.dsNode)
            me.setDSNode(me.dsNode);
    },

    setDSNode: function (dsNode) {
        var me = this,
            store;

        me.dsNode = dsNode;
        Ext.destroy(me.dsNodeListeners);

        store = dsNode.getStore();
        if (store)
            me.setCompStore(store);

        me.dsNodeListeners = dsNode.on({
            scope: me,
            destroyable: true,
            storechanged: function (newstore) {
                me.setCompStore(newstore);
            }
        });
    },

    setCompStore: function (store) {
        var me = this,
            comp = me.getComp();

        if (store.isLoaded())
            me.initDemoData(store);

        Ext.destroy(me.storeListeners);
        me.storeListeners = store.on({
            scope: me,
            destroyable: true,
            load: function (store, records, successful, operation, eOpts ) {
                successful && me.initDemoData(store);
            }
        });

        comp.setStore(store);
    },

    destroy: function () {
        var me = this;

        Ext.destroy(me.dsNodeListeners);
        Ext.destroy(me.storeListeners);

        me.callParent(arguments);
    }
});