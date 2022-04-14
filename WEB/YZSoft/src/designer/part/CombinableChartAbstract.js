
Ext.define('YZSoft.src.designer.part.CombinableChartAbstract', {
    extend: 'YZSoft.src.designer.part.ChartAbstract',
    inheritableStatics: {
        defaultSeriesType: null,
        getDemoChartConfig: function () {
            var me = this,
                seriesType = me.defaultSeriesType,
                seriesTemplate = me.seriesTemplates[seriesType],
                seriesid = seriesTemplate.seriesid || (me.seriesIdPerfix + '1'),
                config = Ext.clone(me.chartTemplate),
                seriesCfg = Ext.clone(seriesTemplate.demo);

            Ext.apply(config, {
                store: me.demoStore,
                designInfo: {
                    groups: [{
                        seriesType: seriesType,
                        seriesIds: [seriesid]
                    }]
                }
            });

            config.series = [me.getNewSeriesConfig(seriesType, seriesid, Ext.apply({}, seriesCfg))];
            return config;
        },
        getNewSeriesConfig: function (type, seriesid, config) {
            var me = this,
                config = config || {},
                xField = config.xField,
                yField = Ext.Array.from(config.yField),
                title = config.title || yField,
                seriesTemplate = me.seriesTemplates[type],
                cfg;

            cfg = Ext.clone(seriesTemplate.config);
            cfg = Ext.Object.merge(cfg, {
                type: seriesTemplate.seriesType || type,
                id: seriesid,
                xField: xField,
                yField: yField,
                title: title,
                label: {
                    field: yField
                }
            });

            cfg = Ext.Object.merge(cfg, config);
            return cfg;
        }
    },

    archive: function (config) {
        var me = this,
            groups = [];

        me.seriesWrap.items.each(function (seriesContainer) {
            groups.push({
                seriesType: seriesContainer.getSeriesType(),
                seriesIds: seriesContainer.getSeriesIds()
            });
        });

        config.designInfo = {
            groups: groups
        };
    }
});