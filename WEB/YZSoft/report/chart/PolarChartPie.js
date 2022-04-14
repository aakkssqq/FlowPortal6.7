
Ext.define('YZSoft.report.chart.PolarChartPie', {
    extend: 'YZSoft.report.chart.PolarChart',
    requires: [
        'YZSoft.src.chart.theme.Default'
    ],
    chartTemplate: {
        theme: 'yzdefault',
        animation: {
            duration: 200
        },
        legend: {
            type: 'sprite',
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
            padding: 16
        },
        insetPadding: 0,
        interactions: ['itemhighlight', 'rotate'],
    },
    seriesTemplate: {
        label: {
            display: 'outside',
            fontFamily: '"Microsoft Yahei", "Helvetica Neue", Helvetica, Arial, sans-serif', //重要，否则设置fontSize保存后不能修改，字体被设置为default的缘故
            renderer: function (text, sprite, config, rendererData, index) {
                return this.getChart().renderLabel(text, sprite, config, rendererData, index);
            }
        },
        tooltip: {
            trackMouse: true,
            showDelay: 0,
            dismissDelay: 0,
            hideDelay: 0,
            renderer: function (tooltip, record, item) {
                this.getChart().renderTip(tooltip, record, item);
            }
        },
        highlightCfg: {
            margin: 40
        }
    }
});