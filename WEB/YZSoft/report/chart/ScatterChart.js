
Ext.define('YZSoft.report.chart.ScatterChart', {
    extend: 'YZSoft.report.chart.CartesianChart',

    renderTip: function (tooltip, record, item) {
        var me = this,
            chart = me,
            xAxis = chart.getAxis('xAxis'),
            yAxis = chart.getAxis('yAxis'),
            series = item.series,
            labelField = Ext.Array.from(item.series.getLabel().getTemplate().getField())[0],
            xField = Ext.Array.from(series.getXField())[0],
            yField = Ext.Array.from(item.field)[0],
            label = record.get(labelField),
            x = record.get(xField),
            y = record.get(yField),
            xTitle = xAxis.getTitle().attr.text || xField,
            yTitle = yAxis.getTitle().attr.text || yField,
            html;

        x = chart.renderNumber(x,true,'xAxis');
        y = chart.renderNumber(y,true);

        html = Ext.String.format('{0}<br/>{1}: {2}<br/>{3}: {4}', label, yTitle, y, xTitle, x);
        tooltip.setHtml(html, true);
    }
});