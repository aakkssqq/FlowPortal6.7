
Ext.define('YZSoft.src.designer.part.ClassManager', {
    singleton: true,
    parts: {
        'chart.column': 'YZSoft.src.designer.part.CartesianChartColumn',
        'chart.column3d': 'YZSoft.src.designer.part.CartesianChartColumn3D',
        'chart.bar': 'YZSoft.src.designer.part.CartesianChartBar',
        'chart.bar3d': 'YZSoft.src.designer.part.CartesianChartBar3D',
        'chart.line': 'YZSoft.src.designer.part.CartesianChartLine',
        'chart.area':'YZSoft.src.designer.part.CartesianChartArea',
        'chart.scatter': 'YZSoft.src.designer.part.CartesianChartScatter',
        'chart.pie': 'YZSoft.src.designer.part.PolarChartPie',
        'chart.pie3d': 'YZSoft.src.designer.part.PolarChartPie3D',
        'chart.radar': 'YZSoft.src.designer.part.PolarChartRadar',
        'report.grid': 'YZSoft.src.designer.part.GridReport',
        'layout.hbox': {
            xclass: 'YZSoft.src.designer.part.layout.HBox',
            config: {
                dcntConfig: {
                    ddGroup: ['chart', 'layout'],
                    minHeight: 72,
                    emptyText: RS.$('ReportDesigner_EmptyText_HBox'),
                }
            }
        },
        'report.search.panel': {
            xclass: 'YZSoft.src.designer.part.layout.Flow',
            config: {
                dcntConfig: {
                    ddGroup: ['report_ds_param','reportsearchfield'],
                    ddIndicatorCls:'yz-dd-part-indicator-searchfield',
                    minHeight: 72,
                    emptyText: RS.$('ReportDesigner_EmptyText_SearchBox')
                }
            }
        },
        'report.search.field.text': 'YZSoft.src.designer.part.ReportSearchField',
        'report.search.field.number': 'YZSoft.src.designer.part.ReportSearchField',
        'report.search.field.date': 'YZSoft.src.designer.part.ReportSearchField',
        'report.search.field.combobox': 'YZSoft.src.designer.part.ReportSearchField',
        'report.search.field.user': 'YZSoft.src.designer.part.ReportSearchField'
    },

    constructor: function () {
        var me = this;

        Ext.Object.each(me.parts, function (ctype, item) {
            if (Ext.isString(item)) {
                me.parts[ctype] = item = {
                    xclass: item
                };
            }
        });
    }
});