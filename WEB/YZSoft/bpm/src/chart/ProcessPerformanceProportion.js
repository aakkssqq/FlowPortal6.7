
/*
*/
Ext.define('YZSoft.bpm.src.chart.ProcessPerformanceProportion', {
    extend: 'Ext.chart.PolarChart',
    requires: [
        'Ext.chart.plugin.ItemEvents'
    ],
    minPercentage: 500,

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
                    orderby:'SumMinutes'
                }
            },
            listeners: {
                scope: me,
                load: function (store, recs) {
                    var remove = [],
                        other = {
                            isOther: true,
                            Counts: 0,
                            Per: 0,
                            otherNames: [],
                            displayedNames: []
                        };

                    Ext.each(recs, function (rec) {
                        if (rec.data.Per < me.minPercentage) {
                            other.Counts += rec.data.Counts;
                            other.Per += rec.data.Per;
                            remove.push(rec);
                            other.otherNames.push(rec.data.ProcessName);
                        }
                        else
                            other.displayedNames.push(rec.data.ProcessName);
                    });

                    if (remove.length > 0) {
                        other.ProcessName = Ext.String.format(RS.$('Analysis_OtherNProcess'), remove.length);
                        Ext.each(remove, function (rec) {
                            store.remove(rec);
                        });
                        store.add(other);
                    }
                }
            }
        });

        cfg = {
            store: me.chartStore,
            innerPadding: 30,
            interactions: ['rotate', 'itemhighlight'],
            series: [{
                type: 'pie',
                angleField: 'Per',
                label: {
                    field: 'ProcessName',
                    calloutLine: {
                        length: 50,
                        width: 3
                    }
                },
                style: {
                    opacity: 0.80
                },
                highlight: true,
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        tooltip.setHtml(Ext.String.format('{0}: {1}%',
                            record.get('ProcessName'),
                            Math.round(record.get('Per') / 10) / 10,
                            record.get('Counts')));
                    }
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});