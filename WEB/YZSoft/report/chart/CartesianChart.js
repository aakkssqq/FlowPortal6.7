
Ext.define('YZSoft.report.chart.CartesianChart', {
    extend: 'Ext.chart.CartesianChart',
    requires: [
        'YZSoft.src.chart.theme.Default'
    ],
    chartTemplates: {
        defaults: {
            theme: 'yzdefault'
        },
        'chart.column': {
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
            axes: [{
                id: 'yAxis',
                type: 'numeric',
                position: 'left',
                label: {
                    textAlign: 'right'
                },
                majorTickSteps: 10,
                grid: true,
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true);
                }
            }, {
                id: 'xAxis',
                type: 'category',
                position: 'bottom',
                grid: true
            }]
        },
        'chart.column3d': {
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
            axes: [{
                id: 'yAxis',
                type: 'numeric3d',
                position: 'left',
                label: {
                    textAlign: 'right'
                },
                majorTickSteps: 10,
                grid: {
                    odd: {
                        fillStyle: '#fff'
                    },
                    even: {
                        fillStyle: '#f5f5f5'
                    }
                },
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true);
                }
            }, {
                id: 'xAxis',
                type: 'category3d',
                position: 'bottom',
                grid: true
            }]
        },
        'chart.bar': {
            flipXY: true,
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
            axes: [{
                id: 'yAxis',
                type: 'numeric',
                position: 'bottom',
                label: {
                    textAlign: 'right'
                },
                majorTickSteps: 10,
                grid: true,
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true);
                }
            }, {
                id: 'xAxis',
                type: 'category',
                position: 'left',
                grid: true
            }]
        },
        'chart.bar3d': {
            flipXY: true,
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
            axes: [{
                id: 'yAxis',
                type: 'numeric3d',
                position: 'bottom',
                label: {
                    textAlign: 'right'
                },
                majorTickSteps: 10,
                grid: {
                    odd: {
                        fillStyle: '#fff'
                    },
                    even: {
                        fillStyle: '#f5f5f5'
                    }
                },
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true);
                }
            }, {
                id: 'xAxis',
                type: 'category3d',
                position: 'left',
                grid: true
            }]
        },
        'chart.line': {
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
            axes: [{
                id: 'yAxis',
                type: 'numeric',
                position: 'left',
                label: {
                    textAlign: 'right'
                },
                grid: true,
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true);
                }
            }, {
                id: 'xAxis',
                type: 'category',
                position: 'bottom',
                grid: true
            }]
        },
        'chart.area': {
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
            axes: [{
                id: 'yAxis',
                type: 'numeric',
                position: 'left',
                label: {
                    textAlign: 'right'
                },
                grid: true,
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true);
                }
            }, {
                id: 'xAxis',
                type: 'category',
                position: 'bottom',
                grid: true
            }]
        },
        'chart.scatter': {
            animation: {
                duration: 200
            },
            legend: false,
            axes: [{
                id: 'yAxis',
                type: 'numeric',
                position: 'left',
                label: {
                    textAlign: 'right'
                },
                grid: false,
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true);
                }
            }, {
                id: 'xAxis',
                type: 'numeric',
                position: 'bottom',
                grid: false,
                renderer: function (axis, label, layoutContext) {
                    return this.getChart().renderNumber(label, true, 'xAxis');
                }
            }]
        }
    },
    seriesTemplates: {
        defaults: {
            label: {
                renderer: function (text, sprite, config, rendererData, index) {
                    return this.getChart().renderNumber(text);
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
            }
        },
        bar: {
            type: 'bar',
            label: {
                display: 'insideEnd'
            },
            style: {
                opacity: 0.80
            },
            highlight: true
        },
        bar3d: {
            type: 'bar3d',
            style: {
                saturationFactor:2.2
            },
            label: {
                display: 'insideEnd'
            },
            highlightCfg: {
                saturationFactor: 1.5
            }
        },
        line: {
            type: 'line',
            marker: {
                radius: 4,
                lineWidth: 2,
                fillStyle: '#fff'
            },
            label: {
                display: 'over'
            },
            highlightCfg: {
                fillStyle: '#000',
                radius: 8,
                lineWidth: 2,
                strokeStyle: '#fff'
            }
        },
        area: {
            type: 'area',
            marker: {
                opacity: 0,
                scaling: 0.01,
                animation: {
                    duration: 200,
                    easing: 'easeOut'
                }
            },
            highlightCfg: {
                opacity: 1,
                scaling: 1.5
            }
        },
        scatter: {
            type: 'scatter',
            marker: {
                radius: 4
            },
            style: {
                selectionTolerance: 4
            },
            label: {
                display: 'over',
                fontFamily: '"Microsoft Yahei", "Helvetica Neue", Helvetica, Arial, sans-serif', //重要，否则设置fontSize保存后不能修改，字体被设置为default的缘故
                renderer: function (text, sprite, config, rendererData, index) {
                    return text || '';
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
                fillStyle: 'yellow',
                lineWidth: 2
            }
        }
    },

    constructor: function (config) {
        var me = this,
            ctype = config.ctype,
            cfg,seriescfg;

        cfg = Ext.clone(me.chartTemplates.defaults) || {};
        Ext.merge(cfg, me.chartTemplates[ctype]);
        Ext.merge(cfg.axes[0], config.axes[0]);
        Ext.merge(cfg.axes[1], config.axes[1]);
        delete config.axes;

        Ext.merge(cfg, config);
        me.callParent([cfg]);

        //bug修正，画面scroll鼠标移出窗体时出现很多残留的tooltip
        me.addElementListener({
            mouseout: function () {
                var interactions = me.getInteractions();
                Ext.Array.each(interactions, function (interaction) {
                    var tooltipItems = interaction.tooltipItems;

                    if (tooltipItems && interaction.hideTooltips) {
                        interaction.hideTooltips(interaction.tooltipItems);
                        tooltipItems.length = 0;
                    }
                });
            }
        });
    },

    applySeries: function (newSeries, oldSeries) {
        var me = this,
            newSeries = Ext.Array.from(newSeries, true),
            result = [];

        Ext.each(newSeries, function (series) {
            if (series instanceof Ext.chart.series.Series) {
            }
            else if (Ext.isObject(series)) {
                series = me.applySeriesDefaults(series);
            }

            result.push(series);
        });

        return me.callParent([result, oldSeries]);
    },

    applySeriesDefaults: function (series) {
        var me = this,
            seriescfg;

        seriescfg = Ext.clone(me.seriesTemplates.defaults);
        Ext.merge(seriescfg, me.seriesTemplates[series.type]);
        Ext.merge(seriescfg, series);

        return seriescfg;
    },

    renderNumber: function (value, withUnit, axis) {
        var me = this,
            axis = me.getAxis(axis || 'yAxis'),
            format = axis.rendererFormat,
            thousands = format.thousands,
            scale = format.scale,
            unit = format.unit,
            formattext = [];

        formattext.push(thousands ? '0,000.##' : '0.##');

        if (withUnit && unit)
            formattext.push(' ' + unit);

        return Ext.util.Format.number(value / scale, formattext.join(''));
    },

    renderTip: function (tooltip, record, item) {
        var me = this,
            chart = me,
            series = item.series,
            yField = Ext.Array.from(item.field)[0],
            xField = Ext.Array.from(series.getXField())[0],
            sprite = item.sprite,
            stacked = item.series.updateStacked,
            index = Ext.Array.indexOf(series.getSprites(), sprite),
            xFieldValue = record.get(xField),
            titles = Ext.Array.from(series.getTitle()),
            title = titles[index],
            formattedValue = chart.renderNumber(record.get(yField)),
            html;

        if (!stacked)
            html = Ext.String.format('{0}: {1}', xFieldValue, formattedValue);
        else
            html = Ext.String.format('{0}<br/>{1}: {2}', title, xFieldValue, formattedValue);

        tooltip.setHtml(html, true);
    }
});