
Ext.define('YZSoft.src.designer.container.chart.SingleFieldAbstract', {
    extend: 'YZSoft.src.designer.container.chart.ChartInnerContainerAbstract',
    onAddPart: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            add: 'onAddPart'
        });
    },

    getChart: function () {
        return this.chartPart.getComp();
    },

    getSeries: function () {
        var me = this,
            chart = me.getChart(),
            series = Ext.Array.from(chart.getSeries())[0];

        return series;
    },

    createDropIndicator: function (source, data) {
        var me = this,
            body;

        if (me.items.getCount() == 0)
            me.dropIndicator = me.callParent(arguments);
        else
            me.dropIndicator = null;

        return me.dropIndicator;
    }
});