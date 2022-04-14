
Ext.define('YZSoft.designer.YZSoft.report.chart.PolarChartPie3D_Archive', {
    extend: 'YZSoft.designer.YZSoft.report.chart.ArchiveAbstract',
    requires: [
        'Ext.draw.Draw'
    ],

    archive: function (chart, part) {
        var me = this,
            dsNode = part.dsNode,
            rv = me.callParent(arguments),
            seriesCfg,label;

        Ext.apply(rv, {
            dsid: dsNode ? dsNode.data.text : undefined,
            height: chart.getHeight(),
            captions: me.archiveChartCaptions(chart, part),
            legend: me.archiveChartLegend(chart,part),
            innerPadding: chart.getInnerPadding(),
            rendererFormat: chart.rendererFormat
        });

        rv.series = [];
        Ext.each(chart.getSeries(), function (series) {
            label = series.getLabel();

            seriesCfg = {
                type: series.type,
                angleField: series.getAngleField(),
                rotation: Math.round(Ext.draw.Draw.degrees(series.getRotation())),
                donut: series.getDonut(),
                thickness: series.getThickness(),
                distortion: series.getDistortion(),
                title: series.getTitle(),
                label: {
                    field: label.getTemplate().getField(),
                    fontSize: parseFloat(label.getTemplate().attr.fontSize),
                    calloutLine: label.getTemplate().getCalloutLine()
                }
            };

            rv.series.push(seriesCfg);
        });

        return rv;
    }
});