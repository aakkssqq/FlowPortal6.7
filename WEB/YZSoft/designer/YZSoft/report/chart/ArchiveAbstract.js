
Ext.define('YZSoft.designer.YZSoft.report.chart.ArchiveAbstract', {
    extend:'YZSoft.designer.ArchiveAbstract',
    requires: [
        'Ext.draw.Draw'
    ],

    archiveChartCaptions: function (chart, part) {
        var me = this,
            title = chart.getCaptions().title;

        return {
            title: {
                text: title.getText(),
                align: title.getAlign()
            }
        };
    },

    archiveChartLegend: function (chart, part) {
        var me = this,
            legend = chart.getLegend();

        if (!legend)
            return false;

        return {
            docked: legend.getDocked()
        };
    },

    archiveYAxis: function (chart, part) {
        var me = this,
            axis = chart.getAxis('yAxis');

        return {
            id: axis.id,
            type: axis.type,
            rendererFormat: axis.rendererFormat
        };
    },

    archiveXAxis: function (chart, part) {
        var me = this,
            axis = chart.getAxis('xAxis'),
            rv;

        rv = {
            id: axis.id,
            type: axis.type,
            fields: axis.getFields(),
            label: {
                rotate: {
                    degrees: Math.round(Ext.draw.Draw.degrees(axis.getLabel().attr.rotationRads)),
                }
            }
        };

        if (axis.rendererFormat) {
            Ext.apply(rv, {
                rendererFormat: axis.rendererFormat
            });
        }

        return rv;
    }
});