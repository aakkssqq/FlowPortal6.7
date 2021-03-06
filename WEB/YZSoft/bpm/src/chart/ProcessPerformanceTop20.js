
/*
*/
Ext.define('YZSoft.bpm.src.chart.ProcessPerformanceTop20', {
    extend: 'Ext.chart.CartesianChart',
    requires: [
        'Ext.chart.plugin.ItemEvents',
        'YZSoft.bpm.src.ux.Render'
    ],
    maxProcessCount: 20,
    plugins: {
        ptype: 'chartitemevents',
        moveEvents: true
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.chartStore = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: [],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemReport.ashx'),
                extraParams: {
                    method: 'GetProcessPerformanceByProcess',
                    orderby: 'AvgMinutes'
                }
            },
            listeners: {
                scope: me,
                load: function (store, recs) {
                    var startIndex = me.maxProcessCount;
                    store.removeAt(startIndex, recs.length - startIndex);
                }
            }
        });

        cfg = {
            store: me.chartStore,
            insetPadding: {
                top: 40,
                bottom: 40,
                left: 20,
                right: 40
            },
            interactions: 'itemhighlight',
            axes: [{
                type: 'numeric',
                position: 'left',
                minimum: 0,
                increment: 30,
                grid: true,
                fields: ['AvgMinutes'],
                titleMargin: 10,
                renderer: function (axis, label, layoutContext, lastLabel) {
                    return Ext.util.Format.toElapsedString(label);
                }
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['ProcessName'],
                label: {
                    rotate: {
                        degrees: -45
                    }
                }
            }],
            animation: Ext.isIE8 ? false : {
                easing: 'backOut',
                duration: 500
            },
            series: {
                type: 'bar',
                axis: 'left',
                xField: 'ProcessName',
                yField: 'AvgMinutes',
                style: {
                    opacity: 0.80,
                    minGapWidth: 10
                },
                highlight: {
                    strokeStyle: 'black',
                    fillStyle: '#c1e30d',
                    lineDash: [5, 3]
                },
                label: {
                    field: 'AvgMinutes',
                    display: 'insideEnd',
                    renderer: function (value) {
                        return Ext.util.Format.toElapsedString(value);
                    }
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        tooltip.setHtml(record.get('ProcessName') + ': ' + Ext.util.Format.toElapsedString(record.get('AvgMinutes')));
                    }
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});