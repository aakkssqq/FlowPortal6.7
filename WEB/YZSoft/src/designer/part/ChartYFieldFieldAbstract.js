
/*
cnt
*/
Ext.define('YZSoft.src.designer.part.ChartYFieldFieldAbstract', {
    extend: 'YZSoft.src.designer.part.ChartInnerPartAbstract',
    draggable: {
        ddGroup: 'report_ds_resultcolumn'
    },
    cls: 'yz-part-report-series',
    html: '<div class="delete"></div>',

    getChartPart: function () {
        return this.cnt.chartPart;
    },

    getChart: function () {
        return this.cnt.getChart();
    },

    getSeries: function () {
        var me = this,
            series = me.cnt.getSeries();

        return series;
    }
});