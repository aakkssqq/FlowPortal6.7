
Ext.define('YZSoft.src.designer.container.chart.YFieldsAbstract', {
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
            beforeremove: function (cnt, component, eOpts) {
                component.lastIndex = me.items.indexOf(component);
            },
            remove: 'onRemovePart'
        });
    },

    tryGetPartFromSeriesId: function (seriesid) {
        var me = this;

        if (me.seriesid == seriesid)
            return me;
    },

    getSeriesIds: function () {
        return [this.seriesid];
    },

    getSeries: function () {
        var me = this,
            series = me.chartPart.getSeriesFromId(me.seriesid);

        return series;
    },
});