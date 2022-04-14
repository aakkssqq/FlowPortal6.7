
/*
*/
Ext.define('YZSoft.bpm.src.chart.ProcessUsage', {
    extend: 'Ext.chart.CartesianChart',
    requires: [
        'YZSoft.bpm.src.model.ProcessAnalysis',
        'Ext.chart.plugin.ItemEvents'
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
                fields: ['Approved'],
                minimum: 0,
                increment: 30
            }, {
                type: 'category',
                position: 'bottom',
                grid: false,
                fields: ['category']
            }],
            series: [{
                type: 'area',
                subStyle: {
                    stroke: ['rgb(241,73,91)', 'rgb(34,198,239)', 'rgb(0,255,0)'],
                    fill: ['rgba(241,73,91,0.25)', 'rgba(34,198,239,0.25)', 'rgba(0,255,0,0.25)'],
                    'stroke-width': 3
                },
                axis: 'left',
                xField: 'category',
                yField: [/*'Deleted', 'Aborted', */'Rejected', 'Approved', 'Running'],
                title: [RS.$('All_Rejected'), RS.$('All_Approved'), RS.$('All_Running')], //*****legend text
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
                        tooltip.setHtml(RS.$('All_' + item.field) + ': ' + record.get(item.field));
                    }
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});