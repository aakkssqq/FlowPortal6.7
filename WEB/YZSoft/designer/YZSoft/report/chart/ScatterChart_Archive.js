
Ext.define('YZSoft.designer.YZSoft.report.chart.ScatterChart_Archive', {
    extend: 'YZSoft.designer.YZSoft.report.chart.CartesianChart_Archive',

    archiveXAxis: function (chart, part) {
        var me = this,
            axis = chart.getAxis('xAxis'),
            rv = me.callParent(arguments);

        return Ext.apply(rv, {
            title: {
                text: axis.getTitle().attr.text,
            }
        });
    },

    archiveYAxis: function (chart, part) {
        var me = this,
            axis = chart.getAxis('yAxis'),
            rv = me.callParent(arguments);

        return Ext.apply(rv,{
            title: {
                text: axis.getTitle().attr.text,
            }
        });
    },

    archive_scatter: function (series) {
        var me = this,
            label = series.getLabel(),
            style = series.getStyle();

        return {
            label: {
                fontSize: parseFloat(label.getTemplate().attr.fontSize),
                translateY: label.getTemplate().translateY
            },
            style: {
                strokeStyle: style.strokeStyle,
                fillStyle: style.fillStyle
            }
        };
    }
});