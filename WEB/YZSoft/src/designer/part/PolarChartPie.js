
Ext.define('YZSoft.src.designer.part.PolarChartPie', {
    extend: 'YZSoft.src.designer.part.PolarChartAbstract',
    inheritableStatics: {
        chartTemplate: {
            height: 500,
            captions: {
                title: {
                    text: RS.$('ReportDesigner_ChartType_Pie'),
                    align: 'center'
                }
            },
            legend: {
                docked: 'right'
            },
            innerPadding: 40,
            rendererFormat: { //扩展属性
                thousands: true,
                scale: 1,
                unit: ''
            }
        },
        seriesTemplate: {
            type: 'pie',
            angleField: '__demo__angle1__',
            rotation: 0,
            donut: 0,
            title: null,
            label: {
                field: '__demo__label1__',
                //fontSize: '12px',
                calloutLine: {
                    length: 60,
                    width: 3
                }
            }
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            ccfg = config.ccfg || {},
            series = Ext.Array.from(ccfg.series)[0],
            seriesContainers, cfg;

        me.labelFieldCnt = Ext.create('YZSoft.src.designer.container.chart.PieLabelField', {
            designer: config.designer,
            chartPart: me,
            series: series,
            margin: '0 20 0 0'
        });

        me.angleFieldCnt = Ext.create('YZSoft.src.designer.container.chart.PieAngleField', {
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
                me.labelFieldCnt,
                me.angleFieldCnt
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
    }
});