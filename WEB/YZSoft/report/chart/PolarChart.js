
Ext.define('YZSoft.report.chart.PolarChart', {
    extend: 'Ext.chart.PolarChart',

    constructor: function (config) {
        var me = this,
            chartTemplate = me.chartTemplate,
            cfg;

        cfg = Ext.clone(chartTemplate) || {};
        if (cfg.axes) {
            Ext.merge(cfg.axes[0], config.axes[0]);
            Ext.merge(cfg.axes[1], config.axes[1]);
            delete config.axes;
        }

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
            seriesTemplate = me.seriesTemplate,
            seriescfg;

        seriescfg = Ext.clone(seriesTemplate);
        Ext.merge(seriescfg, series);

        return seriescfg;
    },

    getPercent: function (sprite) {
        var series = sprite.getSeries(),
            totalAngle = series.getTotalAngle ? series.getTotalAngle():2*Math.PI,
            attr = sprite.attr,
            startAngle = attr.startAngle,
            endAngle = attr.endAngle,
            per = Math.abs(endAngle - startAngle) / totalAngle;

        per = Math.round(per * 1000) / 10.0;

        return per;
    },

    renderNumber: function (value, withUnit) {
        var me = this,
            format = me.rendererFormat,
            thousands = format.thousands,
            scale = format.scale,
            unit = format.unit,
            formattext = [];

        formattext.push(thousands ? '0,000.##' : '0.##');

        if (withUnit && unit)
            formattext.push(' ' + unit);

        return Ext.util.Format.number(value / scale, formattext.join(''));
    },

    renderLabel: function (text, sprite, config, rendererData, index) {
        var me = this,
            series = rendererData.series,
            pieSprite = Ext.Array.from(series.getSprites())[index],
            per = me.getPercent(pieSprite);

        //return Ext.String.format('{0} {1}%', text, per);
        return text;
    },

    renderTip: function (tooltip, record, item) {
        var me = this,
            chart = me,
            series = item.series,
            sprite = Ext.Array.from(item.sprite)[0], //对于pie3d每条记录有8个sprite构成
            angleField = series.getAngleField(),
            labelField = series.getLabel().getTemplate().getField(),
            label = record.get(labelField),
            percent = me.getPercent(sprite),
            titles = Ext.Array.from(series.getTitle()),
            title = titles[0],
            value = record.get(angleField),
            formattedValue = me.renderNumber(value, true),
            html;

        title = title || angleField;

        if (title == '__demo__angle1__')
            title = RS.$('Designer_DemoData_Turnover');

        html = Ext.String.format('{0} {1}%<br/>{2}: {3}', label, percent, title, formattedValue);

        tooltip.setHtml(html, true);
    }
});