
Ext.define('YZSoft.src.designer.part.CartesianChartScatter', {
    extend: 'YZSoft.src.designer.part.SimpleChartAbstract',
    requires: [
        'YZSoft.src.designer.container.chart.ScatterXField'
    ],
    inheritableStatics: {
        demoStore: Ext.create('Ext.data.Store', {
            data: [
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '1', __demo__value1__: 9715, __demo__value2__: 81 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '2', __demo__value1__: 9146, __demo__value2__: 79 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '3', __demo__value1__: 7980, __demo__value2__: 82 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '4', __demo__value1__: 1367, __demo__value2__: 78 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '5', __demo__value1__: 593, __demo__value2__: 57 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '6', __demo__value1__: 3966, __demo__value2__: 83 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '7', __demo__value1__: 463, __demo__value2__: 72 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '8', __demo__value1__: 5827, __demo__value2__: 82 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '9', __demo__value1__: 20, __demo__value2__: 65 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '10', __demo__value1__: 895, __demo__value2__: 77 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '11', __demo__value1__: 2146, __demo__value2__: 81 },
                { __demo__label1__: RS.$('ReportDesigner_DemoData_Company') + '12', __demo__value1__: 49, __demo__value2__: 61 },
            ]
        }),
        chartTemplate: {
            height: 500,
            captions: {
                title: {
                    text: RS.$('ReportDesigner_DemoData_Scatter_Title'),
                    align: 'center'
                }
            },
            innerPadding: {
                top: 20,
                right: 40,
                bottom: 6,
                left: 40
            },
            axes: [{
                title: {
                    text:RS.$('ReportDesigner_DemoData_Profit')
                },
                rendererFormat: { //扩展属性
                    thousands: true,
                    scale: 1,
                    unit: ''
                }
            }, {
                title: {
                    text: RS.$('Designer_DemoData_Turnover')
                },
                rendererFormat: { //扩展属性
                    thousands: true,
                    scale: 1,
                    unit: ''
                }
            }]
        },
        seriesTemplate: {
            type:'scatter',
            title: RS.$('ReportDesigner_DemoData'),
            xField: '__demo__value1__',
            yField: '__demo__value2__',
            xAxis: 'xAxis',
            yAxis: 'yAxis',
            label: {
                field: '__demo__label1__',
                fontSize: 12,
                translateY: 2
            },
            style: {
            }
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            ccfg = config.ccfg || {},
            series = Ext.Array.from(ccfg.series)[0],
            seriesContainers, cfg;

        me.xFieldCnt = Ext.create('YZSoft.src.designer.container.chart.ScatterXField', {
            designer: config.designer,
            chartPart: me,
            series: series
        });

        me.yFieldCnt = Ext.create('YZSoft.src.designer.container.chart.ScatterYField', {
            designer: config.designer,
            chartPart: me,
            series: series,
            margin:'0 20'
        });

        me.labelFieldCnt = Ext.create('YZSoft.src.designer.container.chart.ScatterLabel', {
            designer: config.designer,
            chartPart: me,
            series: series
        });

        me.seriesWrap = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1
            },
            items: [
                me.xFieldCnt,
                me.yFieldCnt,
                me.labelFieldCnt
            ]
        });

        cfg = {
            bbar: {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    me.seriesWrap
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    initDemoData: function (store) {
        if (store.getCount() == 0)
            return;

        var rec = store.getAt(0),
            i;

        i = 1;
        if (!('__demo__label1__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__label1__: RS.$('ReportDesigner_DemoData_Company') +  i
                });

                i++;
            });
        }

        if (!('__demo__value1__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__value1__: Ext.Number.randomInt(0, 20) * 500
                });
            });
        }

        if (!('__demo__value2__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__value2__: Ext.Number.randomInt(0, 20) * 500
                });
            });
        }
    }
});