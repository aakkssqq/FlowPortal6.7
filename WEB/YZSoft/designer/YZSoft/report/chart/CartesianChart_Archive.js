
Ext.define('YZSoft.designer.YZSoft.report.chart.CartesianChart_Archive', {
    extend: 'YZSoft.designer.YZSoft.report.chart.ArchiveAbstract',

    archive: function (chart, part) {
        var me = this,
            dsNode = part.dsNode,
            rv = me.callParent(arguments),
            seriesCfg;

        Ext.apply(rv, {
            dsid: dsNode ? dsNode.data.text : undefined,
            height: chart.getHeight(),
            captions: me.archiveChartCaptions(chart, part),
            legend: me.archiveChartLegend(chart,part),
            innerPadding: chart.getInnerPadding(),
            axes: [me.archiveYAxis(chart, part), me.archiveXAxis(chart, part)]
        });

        rv.series = [];
        Ext.each(chart.getSeries(), function (series) {
            seriesCfg = {
                type: series.type,
                id: series.id,
                xField: series.getXField(),
                yField: series.getYField(),
                title: series.getTitle(),
                xAxis: series.getXAxis().id,
                yAxis: series.getYAxis().id,
                label: {
                    field: series.getLabel().getTemplate().getField()
                }
            };

            if (series.getYFieldsColors) {
                Ext.apply(seriesCfg, {
                    yFieldsColors: series.getYFieldsColors()
                })
            }
            else {
                Ext.apply(seriesCfg, {
                    colors: series.getColors()
                })
            }

            if(me['archive_' + series.type])
                Ext.merge(seriesCfg, me['archive_' + series.type](series));

            rv.series.push(seriesCfg);
        });

        return rv;
    },

    archive_barbasic: function (series) {
        var style = series.getStyle();

        return {
            stacked: series.getStacked(),
            fullStack: series.getFullStack(),
            style: {
                minBarWidth: style.minBarWidth,
                maxBarWidth: style.maxBarWidth,
                inGroupGapWidth: style.inGroupGapWidth
            }
        };
    },

    archive_column: function (series) {
        var me = this;

        return Ext.apply(me.archive_barbasic(series), {
        });
    },

    archive_column3d: function (series) {
        var me = this;

        return Ext.apply(me.archive_barbasic(series), {
        });
    },

    archive_bar: function (series) {
        var me = this;

        return Ext.apply(me.archive_barbasic(series), {
        });
    },

    archive_bar3d: function (series) {
        var me = this;

        return Ext.apply(me.archive_barbasic(series), {
        });
    },

    archive_line: function (series) {
        var style = series.getStyle();

        return {
            curve: Ext.apply({}, series.getCurve()),
            style: {
                strokeStyle: style.strokeStyle,
                lineWidth: style.lineWidth
            }
        };
    },

    archive_area: function (series) {
        var style = series.getStyle();

        return {
            stacked: series.getStacked(),
            fullStack: series.getFullStack(),
            style: {
                opacity: style.opacity
            }
        };
    }
});