
Ext.define('YZSoft.src.designer.runtime.ClassManager', {
    singleton: true,
    components: {
        'chart.column': 'YZSoft.report.chart.CartesianChart',
        'chart.column3d': 'YZSoft.report.chart.CartesianChart',
        'chart.bar': 'YZSoft.report.chart.CartesianChart',
        'chart.bar3d': 'YZSoft.report.chart.CartesianChart',
        'chart.line': 'YZSoft.report.chart.CartesianChart',
        'chart.area': 'YZSoft.report.chart.CartesianChart',
        'chart.scatter': 'YZSoft.report.chart.ScatterChart',
        'chart.pie': 'YZSoft.report.chart.PolarChartPie',
        'chart.pie3d': 'YZSoft.report.chart.PolarChartPie3D',
        'chart.radar': 'YZSoft.report.chart.PolarChartRadar',

        'report.grid': 'YZSoft.report.grid.Panel',
        'layout.hbox': 'YZSoft.src.designer.layout.HBox',
        'report.search.panel': 'YZSoft.report.search.Panel',
        'report.search.field.text': 'YZSoft.report.search.field.Text',
        'report.search.field.number': 'YZSoft.report.search.field.Number',
        'report.search.field.date': 'YZSoft.report.search.field.Date',
        'report.search.field.combobox': 'YZSoft.report.search.field.ComboBox',
        'report.search.field.user': 'YZSoft.report.search.field.User'
    },

    constructor: function () {
        var me = this;

        Ext.Object.each(me.components, function (ctype, item) {
            if (Ext.isString(item)) {
                me.components[ctype] = item = {
                    xclass: item
                };
            }
        });
    },

    getXClass: function (ctype) {
        var me = this,
            item = me.components[ctype];

        if (!item || !item.xclass) {
            Ext.raise({
                msg: Ext.String.format(RS.$('Designer_Exception_MissCType'), ctype)
            });
        }

        return item.xclass;
    }
});