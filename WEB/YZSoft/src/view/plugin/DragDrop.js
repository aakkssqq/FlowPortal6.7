Ext.define('YZSoft.src.view.plugin.DragDrop', {
    extend: 'Ext.grid.plugin.DragDrop',
    uses: [
        'YZSoft.src.view.plugin.DragZone',
        'YZSoft.src.view.plugin.DropZone'
    ],

    onViewRender: function (view) {
        var me = this,
            ownerGrid = view.ownerCt.ownerGrid || view.ownerCt,
            dragZone = me.dragZone || {};

        ownerGrid.relayEvents(view, ['beforedrop', 'drop']);

        if (me.enableDrag) {
            if (me.containerScroll) {
                dragZone.scrollEl = view.getEl();
                dragZone.containerScroll = true;
            }

            me.dragZone = Ext.create('YZSoft.src.view.plugin.DragZone', Ext.apply({
                view: view,
                ddGroup: me.dragGroup || me.ddGroup,
                dragText: me.dragText
            }, dragZone));
        }

        if (me.enableDrop) {
            me.dropZone = Ext.create('YZSoft.src.view.plugin.DropZone', Ext.apply({
                view: view,
                ddGroup: me.dropGroup || me.ddGroup
            }, me.dropZone));
        }
    }
});
