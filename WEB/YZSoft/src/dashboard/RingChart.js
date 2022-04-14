
Ext.define('YZSoft.src.dashboard.RingChart', {
    extend: 'Ext.chart.PolarChart',
    interactions: ['rotate'],
    innerPadding: 3,
    animation: {
        easing: 'ease',
        duration: 0
    },
    series: {
        type: 'pie',
        highlight: true,
        colors: ['yellow', '#f5f5f5'],
        xField: 'value',
        donut: 90,
        radiusFactor: 78,
        useDarkerStrokeColor: true
    },
    tpl: [
        '<div class="yz-center yz-chart-ring">',
            '<div>',
                '<div class="text">',
                '</div>',
            '</div>',
        '</div>'
    ],
    data: {
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            store: {
                fields: ['value'],
                data: [{
                    value: 0
                }, {
                    value: 1
                }]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setValue: function (value, total) {
        var me = this;

        if (me.rendered) {
            if (value == 0 && total == 0)
                total = 1;

            me.store.setData([{
                value: value
            }, {
                value: total - value
            }]);
        }
        else {
            me.on({
                single: true,
                render: function () {
                    me.setValue(value, total);
                }
            });
        }
    },

    setText: function (text) {
        var me = this,
            el = me.getEl(),
            elText = el && el.down('.text');

        if (elText)
            elText.setHtml(text.toString());
    }
});