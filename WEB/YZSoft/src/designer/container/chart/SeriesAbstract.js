
Ext.define('YZSoft.src.designer.container.chart.SeriesAbstract', {
    extend: 'YZSoft.src.designer.container.chart.ChartInnerContainerAbstract',
    config: {
        seriesType: null
    },
    emptyText: RS.$('ReportDesigner_EmptyText_SeriesContainer'),
    onAddPart: Ext.emptyFn,
    onRemovePart: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            add: 'onAddPart',
            remove: 'onRemovePart'
        });
    },

    tryGetPartFromSeriesId: function (seriesid) {
        var me = this;

        return me.items.findBy(function (part) {
            return part.seriesid == seriesid;
        });
    },

    getSeriesIds: function () {
        var me = this,
            rv = [];

        me.items.each(function (part) {
            rv.push(part.seriesid);
        });

        return rv;
    },

    getNextSeries: function (index) {
        var me = this,
            chartPart = me.chartPart,
            next = index + 1,
            series;

        if (next < this.items.getCount())
            return this.items.getAt(next).getSeries();

        return null;
    },

    onRemovePart: function (container, part, eOpts) {
        var me = this,
            chartPart = me.chartPart,
            series = part.getSeries();

        chartPart.removeSeries(series);
    },

    onDorpPartExchangePos: function (part, oldIndex, newIndex) {
        var me = this,
            chart = me.getChart(),
            allSeries = [];

        me.items.each(function (seriesPart) {
            allSeries.push(seriesPart.getSeries());
        });

        chart.setSeries(allSeries);

        me.chartPart.designer.dcnt.select(part);
    }
});