﻿
/*
cnt
seriesid
*/
Ext.define('YZSoft.src.designer.part.ChartSeriesFieldAbstract', {
    extend: 'YZSoft.src.designer.part.ChartInnerPartAbstract',
    style: 'background-color:#f5f5f5;',
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
            series = me.cnt.chartPart.getSeriesFromId(me.seriesid);

        return series;
    }
});