
Ext.define('YZSoft.report.chart.PolarChartRadar', {
    extend: 'YZSoft.report.chart.PolarChart',
    requires: [
        'YZSoft.src.chart.theme.Default',
        'Ext.draw.sprite.Rect'
    ],
    seriesTemplate: 'fill',
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
        interactions: ['rotate'],
        axes: [{
            id: 'radiusAxis',
            type: 'numeric',
            position: 'radial',
            majorTickSteps: 4,
            grid: true,
            renderer: function (axis, label, layoutContext) {
                return this.getChart().renderNumber(label, true);
            }
        }, {
            id: 'angleAxis',
            type: 'category',
            position: 'angular',
            grid: true
        }]
    },
    seriesTemplates: {
        fill: {
            style: {
                opacity: 0.40,
                strokeStyle: 'none'
            }
        },
        line: {
            style: {
                lineWidth: 2,
                fillStyle: 'none'
            },
            marker: true,
            highlightCfg: {
                radius: 6,
                fillStyle: 'yellow'
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
        }
    },

    constructor: function (config) {
        var me = this,
            seriesTemplateName = config.seriesTemplate || me.seriesTemplate;

        me.seriesTemplate = me.seriesTemplates[seriesTemplateName];
        delete config.seriesTemplate;

        me.callParent(arguments);
    },

    getSeriesTemplateName: function () {
        var me = this,
            curSeriesTemplate = me.seriesTemplate,
            templateName;

        for (templateName in me.seriesTemplates) {
            if (me.seriesTemplates[templateName] === curSeriesTemplate)
                return templateName
        }
    },

    setSeriesTemplate: function (name) {
        var me = this,
            oldName = me.getSeriesTemplateName(),
            newSeries = [],
            seriesCfg, curTemplate, color;

        if (oldName == name)
            return;

        curTemplate = me.seriesTemplate = me.seriesTemplates[name];
        Ext.each(me.getSeries(), function (series) {
            seriesCfg = me.archiveSeries(series, oldName);
            seriesCfg.isDemoSeries = series.isDemoSeries;

            switch (name) {
                case 'fill':
                    color = seriesCfg.style.strokeStyle;
                    if (color)
                        seriesCfg.style.fillStyle = color;

                    delete seriesCfg.style.strokeStyle;
                    break;
                case 'line':
                    color = seriesCfg.style.fillStyle;
                    if (color)
                        seriesCfg.style.strokeStyle = color;

                    delete seriesCfg.style.fillStyle;
                    break;
            }
            newSeries.push(seriesCfg);
        });

        me.setSeries([]);
        me.setSeries(newSeries);
    },

    archiveSeries: function (series, seriesTemplateName) {
        var me = this,
            style = series.getStyle() || {},
            rv;

        rv = {
            id: series.id,
            type: series.type,
            title: series.getTitle(),
            angleField: series.getAngleField(),
            radiusField: series.getRadiusField(),
            style: {
            }
        };

        if (seriesTemplateName == 'fill' && style.fillStyle)
            rv.style.fillStyle = style.fillStyle;
        if (seriesTemplateName == 'line' && style.strokeStyle)
            rv.style.strokeStyle = style.strokeStyle;

        return rv;
    },

    renderNumber: function (value, withUnit) {
        var me = this,
            radiusAxis = me.getAxis('radiusAxis'),
            format = radiusAxis.rendererFormat,
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
            angleField = series.getAngleField(),
            radiusField = series.getRadiusField(),
            kpi = record.get(angleField),
            title = Ext.Array.from(series.getTitle())[0],
            value = record.get(radiusField),
            formattedValue = me.renderNumber(value, true),
            html;

        title = title || radiusField;
        html = Ext.String.format('{0}<br/>{1}: {2}', title, kpi, formattedValue);

        tooltip.setHtml(html, true);
    }
});