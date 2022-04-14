
Ext.define('YZSoft.designer.YZSoft.report.chart.PolarChartRadar_Archive', {
    extend: 'YZSoft.designer.YZSoft.report.chart.ArchiveAbstract',
    requires: [
        'Ext.draw.Draw'
    ],

    archive: function (chart, part) {
        var me = this,
            dsNode = part.dsNode,
            seriesTemplateName = chart.getSeriesTemplateName(),
            rv = me.callParent(arguments),
            seriesCfg, style;

        Ext.apply(rv, {
            dsid: dsNode ? dsNode.data.text : undefined,
            seriesTemplate: seriesTemplateName,
            height: chart.getHeight(),
            captions: me.archiveChartCaptions(chart, part),
            legend: me.archiveChartLegend(chart, part),
            insetPadding: chart.getInsetPadding(),
            innerPadding: chart.getInnerPadding(),
            axes: [me.archiveRadiusAxis(chart, part), me.archiveAngleAxis(chart, part)]
        });

        rv.series = [];
        Ext.each(chart.getSeries(), function (series) {
            seriesCfg = chart.archiveSeries(series, seriesTemplateName);

            rv.series.push(seriesCfg);
        });

        return rv;
    },

    archiveRadiusAxis: function (chart, part) {
        var me = this,
            axis = chart.getAxis('radiusAxis');

        return {
            id: axis.id,
            type: axis.type,
            rendererFormat: axis.rendererFormat
        };
    },

    archiveAngleAxis: function (chart, part) {
        var me = this,
            axis = chart.getAxis('angleAxis');

        return {
            id: axis.id,
            type: axis.type,
            fields: axis.getFields(),
        };
    }
});