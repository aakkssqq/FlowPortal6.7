
Ext.define('YZSoft.src.designer.part.ChartInnerPartAbstract', {
    extend: 'YZSoft.src.designer.part.Abstract',
    onDeleteClick: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.on({
            scope:me,
            element:'el',
            delegate: '.delete',
            click: 'onDeleteClick'
        });

        me.callParent();
    },

    getDragData: function (e) {
        var me = this;

        //拖动时设置dsNode
        me.dsNode = me.getChartPart().dsNode;
        return me.callParent();
    }
});