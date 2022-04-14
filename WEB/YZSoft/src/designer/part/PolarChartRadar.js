
Ext.define('YZSoft.src.designer.part.PolarChartRadar', {
    extend: 'YZSoft.src.designer.part.PolarChartAbstract',
    inheritableStatics: {
        demoStore: Ext.create('Ext.data.Store', {
            data: [
                { __demo__kpi1__: RS.$('ReportDesigner_DemoData_ProfitRate'), __demo__company1__: 80, __demo__company2__: 40, __demo__company3__: 20 },
                { __demo__kpi1__: RS.$('ReportDesigner_DemoData_GrowthRate'), __demo__company1__: 80, __demo__company2__: 40, __demo__company3__: 20 },
                { __demo__kpi1__: RS.$('ReportDesigner_DemoData_QuickMovingRate'), __demo__company1__: 80, __demo__company2__: 40, __demo__company3__: 20 },
                { __demo__kpi1__: RS.$('ReportDesigner_DemoData_CapitalRate'), __demo__company1__: 80, __demo__company2__: 40, __demo__company3__: 20 },
                { __demo__kpi1__: RS.$('ReportDesigner_DemoData_PerCapitalRate'), __demo__company1__: 80, __demo__company2__: 40, __demo__company3__: 20 }
            ]
        }),
        chartTemplate: {
            height: 500,
            captions: {
                title: {
                    text: RS.$('ReportDesigner_ChartType_Radar'),
                    align: 'center'
                }
            },
            legend: {
                docked: 'right'
            },
            insetPadding:40,
            //innerPadding: 20,
            axes: [{
                rendererFormat: { //扩展属性
                    thousands: true,
                    scale: 1,
                    unit: ''
                }
            }, {
                fields: '__demo__kpi1__'
            }]
        },
        seriesTemplate: {
            type: 'radar',
            angleField: '__demo__kpi1__',
            radiusField: '__demo__company1__'
        },
        getDemoChartConfig: function () {
            var me = this,
                seriesTemplate = me.seriesTemplate,
                config = Ext.clone(me.chartTemplate),
                i;

            config = Ext.apply(config, {
                store: me.demoStore,
                series: []
            });

            for (i = 1; i < 4; i++) {
                seriesCfg = Ext.clone(seriesTemplate);
                Ext.apply(seriesCfg, {
                    title: RS.$('ReportDesigner_DemoData_Company') + i,
                    isDemoSeries: true,
                    angleField: '__demo__kpi1__',
                    radiusField: Ext.String.format('__demo__company{0}__', i)
                });

                config.series.push(seriesCfg);
            }

            return config;
        },
        getNewSeriesConfig: function (type, seriesid, config) {
            var me = this,
                config = config || {},
                radiusField = config.radiusField,
                title = config.title || radiusField,
                seriesTemplate = me.seriesTemplate,
                cfg;

            cfg = Ext.clone(seriesTemplate);
            cfg = Ext.Object.merge(cfg, {
                type: type,
                id: seriesid,
                title: title
            });

            cfg = Ext.Object.merge(cfg, config);
            return cfg;
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            ccfg = config.ccfg || {},
            series = Ext.Array.from(ccfg.series),
            seriesContainers, cfg;

        me.angleFieldCnt = Ext.create('YZSoft.src.designer.container.chart.RadarAngleField', {
            designer: config.designer,
            chartPart: me,
            angleAxis: ccfg.axes[1]
        });

        me.radiusFieldCnt = Ext.create('YZSoft.src.designer.container.chart.RadarSeries', {
            designer: config.designer,
            chartPart: me,
            series: series,
            margin: '10 0 0 0'
        });

        me.seriesWrap = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1
            },
            items: [
                me.angleFieldCnt,
                me.radiusFieldCnt
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
        if (!('__demo__kpi1__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__kpi1__: RS.$('ReportDesigner_DemoData_KPI') + i
                });

                i++;
            });
        }

        if (!('__demo__company1__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__company1__: Ext.Number.randomInt(2, 20) * 5
                });
            });
        }

        if (!('__demo__company2__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__company2__: Ext.Number.randomInt(2, 20) * 5
                });
            });
        }

        if (!('__demo__company3__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__company3__: Ext.Number.randomInt(2, 20) * 5
                });
            });
        }
    }
});