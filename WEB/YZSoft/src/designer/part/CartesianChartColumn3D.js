
Ext.define('YZSoft.src.designer.part.CartesianChartColumn3D', {
    extend: 'YZSoft.src.designer.part.CartesianChartAbstract',
    inheritableStatics: {
        defaultSeriesType: 'column3d',
        supportSeries: [
            'line',
            'area'
        ],
        chartTemplate: {
            height: 500,
            captions: {
                title: {
                    text: RS.$('ReportDesigner_ChartTypeDesc_Column3D'),
                    align: 'center'
                }
            },
            legend: {
                docked: 'bottom'
            },
            innerPadding: {
                top: 30
            },
            axes: [{
                rendererFormat: { //扩展属性
                    thousands: true,
                    scale: 1,
                    unit: ''
                }
            }, {
                fields: '__demo__category__'
            }]
        }
    }
});