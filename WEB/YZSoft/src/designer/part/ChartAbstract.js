
Ext.define('YZSoft.src.designer.part.ChartAbstract', {
    extend: 'YZSoft.src.designer.part.DSNodeAbstract',
    requires: [
        'YZSoft.src.designer.runtime.ClassManager',
        'Ext.chart.plugin.ItemEvents'
    ],
    cls: 'yz-part-chart',
    optHtml: '<div class="opt delete"></div>',
    draggable: {
        ddGroup: 'chart'
    },
    inheritableStatics: {
        seriesIdPerfix: 'series_',
        chartTemplate: null,
        onDrop: function (dcnt, data, fn) {
            var me = this,
                cfg;

            cfg = me.getDemoChartConfig();
            fn && fn(cfg);
        }
    },
    prepareComp: function (config) {
        Ext.apply(config, {
            plugins: {
                chartitemevents: {
                    moveEvents: true
                }
            }
        });
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me.ccfg, {
            animation: {
                duration:200
            }
        });
        me.items = [me.ccfg];
        me.callParent();
    },

    getChart: function () {
        return this.getComp();
    },

    nextSeriesId: function (seed, perfix) {
        var me = this,
            perfix = perfix || me.self.seriesIdPerfix,
            seed = seed || 1,
            i, id;

        for (i = seed; ; i++) {
            id = perfix + i;

            if (!me.getSeriesFromId(id))
                return id;
        }
    },

    getSeriesFromId: function (seriesid) {
        var me = this,
            chart = me.getComp();

        return Ext.Array.findBy(chart.getSeries(), function (series) {
            return seriesid == series.id;
        });
    },

    getNewSeriesConfig: function (type, seriesid, config) {
        return this.self.getNewSeriesConfig(type, seriesid, config);
    },

    addSeries: function (type, seriesid, config) {
        var me = this,
            chart = me.getComp(),
            newSeries = me.getNewSeriesConfig(type, seriesid, config);

        chart.addSeries(newSeries);
        return newSeries; //返回config,而不是返回series实例
    },

    replaceSeries: function (series,newSeries) {
        var me = this,
            chart = me.getComp(),
            allseries = [].concat(chart.getSeries()),
            index;

        index = Ext.Array.indexOf(allseries, series);
        if (index != -1) {
            chart.removeSeries(series);
            Ext.Array.replace(allseries, index, 1, Ext.Array.from(newSeries));
            chart.setSeries(allseries);
        }
        else {
            chart.addSeries(newSeries);
        }
    },

    insetSeries: function (beforeSeries, newSeries) {
        var me = this,
            chart = me.getComp(),
            allseries = [].concat(chart.getSeries()),
            index;

        index = beforeSeries ? Ext.Array.indexOf(allseries, beforeSeries) : -1;

        if (index != -1) {
            Ext.Array.insert(allseries, index, Ext.Array.from(newSeries));
            chart.setSeries(allseries);
        }
        else {
            chart.addSeries(newSeries);
        }
    },

    removeSeries: function (series) {
        var me = this,
            chart = me.getComp();

        series && chart.removeSeries(series);
    },

    removeAllDemoSeries: function () {
        var me = this,
            chart = me.getComp(),
            removes = [];

        Ext.each(chart.getSeries(), function (series) {
            if (series.isDemoSeries)
                removes.push(series);
        });

        if (removes.length)
            chart.removeSeries(removes);
    },

    removeSprite: function (series, sprite) {
        if (!sprite)
            return;

        var surface = series.getSurface(),
            boundMarkers = sprite.boundMarkers || {},
            name, marker;


        for (name in boundMarkers) {
            marker = boundMarkers[name];
            marker && marker.clear(sprite.getId());
        }

        surface.remove(sprite, false);
    },

    refreshChart: function () {
        var me = this,
            chart = me.getComp(),
            series = [].concat(chart.getSeries());

        chart.setSeries(series);
    },

    refreshXAxisExpandRange: function () {
        var me = this,
            chart = me.getComp(),
            xAxis = chart.getAxis('xAxis');

        xAxis.setExpandRangeBy(0);
        Ext.each(chart.getSeries(), function (series) {
            series.updateXAxis && series.updateXAxis(xAxis);
        });
    }
});