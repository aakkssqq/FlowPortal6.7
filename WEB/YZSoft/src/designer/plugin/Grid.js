
//增加列点击事件用于列选择 - columnClick
Ext.define('YZSoft.src.designer.plugin.Grid', {
    extend: 'Ext.plugin.Abstract',

    init: function (grid) {
        var me = this,
            headerCt = grid.getHeaderContainer();

        me.grid = grid;

        headerCt.on({
            order: 'before',
            headerclick: function (ct, column, e, t, eOpts) {
                e.stopEvent();
                me.grid.fireEvent('columnClick', column, e);
            }
        });
    }
});