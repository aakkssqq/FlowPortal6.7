
Ext.define('YZSoft.src.chart.theme.Base', {
    extend: 'Ext.chart.theme.Base',
    defaults: {
        fontFamily: '"Microsoft Yahei", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: '400',
        fontSize: 12,
        fontVariant: 'normal',
        fontStyle: 'normal'
    },

    resolveDefaults: function () {
        var me = this,
            sprites = Ext.clone(me.getSprites()),
            legend = Ext.clone(me.getLegend()),
            axis = Ext.clone(me.getAxis()),
            series = Ext.clone(me.getSeries()),
            div, key, config;

        me.resolveChartDefaults();

        me.replaceDefaults(sprites.text);
        me.setSprites(sprites);

        me.replaceDefaults(legend.label);
        me.setLegend(legend);

        for (key in axis) {
            config = axis[key];
            me.replaceDefaults(config.label);
            me.replaceDefaults(config.title);
        }
        me.setAxis(axis);

        for (key in series) {
            config = series[key];
            me.replaceDefaults(config.label);
        }
        me.setSeries(series);
    }
});
