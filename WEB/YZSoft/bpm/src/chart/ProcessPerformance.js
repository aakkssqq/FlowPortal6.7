
/*
*/
Ext.define('YZSoft.bpm.src.chart.ProcessPerformance', {
    extend: 'Ext.chart.CartesianChart',
    requires: [
        'YZSoft.bpm.src.model.ProcessAnalysis',
        'Ext.chart.plugin.ItemEvents',
        'YZSoft.bpm.src.ux.Render'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.chartStore = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            model: 'YZSoft.bpm.src.model.ProcessAnalysis',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemReport.ashx'),
                extraParams: {
                    method: 'GetProcessAnalysisTrend'
                }
            }
        });

        cfg = {
            store: me.chartStore,
            insetPadding: '25px 20px 0px 30px',
            animation: true,
            legend: {
                type: 'sprite',
                docked: 'bottom',
                border: {
                    strokeStyle: 'none'
                },
                marker: {
                    type: 'rect',
                    size: 16,
                    width: 16,
                    height: 16,
                    radius: 3,
                    strokeStyle: 'none'
                },
                padding: 10
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                grid: true,
                fields: ['AvgMinutes'],
                minimum: 0,
                increment: 30,
                renderer: function (axis, label, layoutContext, lastLabel) {
                    return Ext.util.Format.toElapsedString(label);
                }
            }, {
                type: 'category',
                position: 'bottom',
                grid: false,
                fields: ['category']
            }],
            series: [{
                type: 'area',
                subStyle: {
                    stroke: ['rgb(34,198,239)'],
                    fill: ['rgba(34,198,239,0.25)'],
                    'stroke-width': 3
                },
                axis: 'left',
                xField: 'category',
                yField: ['AvgMinutes'],
                title: [RS.$('Analysis_Approve_AvgMinutes')], //*****legend text
                marker: {
                    opacity: 0,
                    scaling: 0.01,
                    fx: {
                        duration: 200,
                        easing: 'easeOut'
                    }
                },
                highlightCfg: {
                    opacity: 1,
                    scaling: 1.5
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        tooltip.setHtml(Ext.String.format('{0}<br/><span style="color:#ccc">{1}:{2}</span>', Ext.util.Format.toElapsedString(record.get(item.field)), RS.$('Analysis_ApproveCount'), record.get('Approved')));
                    }
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});