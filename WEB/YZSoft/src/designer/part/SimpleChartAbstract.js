
Ext.define('YZSoft.src.designer.part.SimpleChartAbstract', {
    extend: 'YZSoft.src.designer.part.ChartAbstract',
    inheritableStatics: {
        getDemoChartConfig: function () {
            var me = this,
                seriesTemplate = me.seriesTemplate,
                seriesid = seriesTemplate.seriesid || (me.seriesIdPerfix + '1'),
                config = Ext.clone(me.chartTemplate),
                seriesCfg = Ext.clone(seriesTemplate);

            Ext.apply(config, {
                store: me.demoStore
            });

            config.series = seriesCfg;

            return config;
        }
    },

    archive: function (config) {
    }
});