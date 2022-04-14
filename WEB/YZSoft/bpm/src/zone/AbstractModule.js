
Ext.define('YZSoft.bpm.src.zone.AbstractModule', {
    extend: 'YZSoft.frame.app.Abstract',
    getFuncPnlXClass: Ext.emptyFn,
    getCompId: function (rec) {
        var tree = this.navigatorPanel.tree;
        return Ext.String.format('StoreObject_{0}_{1}', tree.storeZoneType, YZSoft.util.hex.encode(rec.data.path));
    },

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.navigatorPanel.tree.on({
            scope: me,
            afterdeleterecord: 'onAfterDeleteRecord'
        });

        me.navigatorPanel.on({
            scope: me,
            moduleselectionchange: 'onModuleSelectionChange'
        });
    },

    onModuleSelectionChange: function (pnlNavigator, rec) {
        var me = this,
            tree = this.navigatorPanel.tree;

        me.moduleContainer.showModule({
            xclass: 'YZSoft.frame.module.Container',
            config: {
                itemId: me.getCompId(rec),
                tabWrap: false,
                items: [{
                    xclass: me.getFuncPnlXClass(rec),
                    title: rec.data.text,
                    storeZoneType: tree.storeZoneType,
                    path: rec.data.path == 'root' ? '' : rec.data.path,
                    record: rec,
                    parentRsid: rec.data.rsid
                }]
            },
            match: function (item) {
                return item.itemId == me.getCompId(rec);
            }
        });
    },

    onAfterDeleteRecord: function (rec) {
        var me = this,
            cmpid = me.getCompId(rec),
            cmp = me.moduleContainer.getComponent(cmpid);

        if (cmp)
            cmp.destroy();
    }
});
