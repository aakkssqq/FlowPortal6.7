
Ext.define('YZSoft.src.designer.part.CartesianChartLine', {
    extend: 'YZSoft.src.designer.part.CartesianChartAbstract',
    inheritableStatics: {
        defaultSeriesType: 'line',
        supportSeries: [
            'column',
            'area'
        ],
        chartTemplate: {
            height: 500,
            captions: {
                title: {
                    text: RS.$('ReportDesigner_DemoData_Line_Title'),
                    align: 'center'
                }
            },
            legend: {
                docked: 'bottom'
            },
            innerPadding: {
                top: 40,
                right: 40,
                bottom: 6,
                left: 40
            },
            axes: [{
                rendererFormat: { //扩展属性
                    thousands: true,
                    scale: 1,
                    unit: ''
                }
            }, {
                fields: '__demo__category__',
                label: {
                    rotate: {
                        degrees: -45
                    }
                }
            }]
        }
    }
});