
Ext.define('YZSoft.src.designer.part.CartesianChartAbstract', {
    extend: 'YZSoft.src.designer.part.CombinableChartAbstract',
    requires: [
        'YZSoft.src.designer.container.chart.CartesianSeries',
        'YZSoft.src.designer.container.chart.Category'
    ],
    inheritableStatics: {
        demoStore: Ext.create('Ext.data.Store', {
            data: [
                { __demo__category__: RS.$('ReportDesigner_DemoData_Category') + '1', __demo__value1__: 18, __demo__value2__: 37 },
                { __demo__category__: RS.$('ReportDesigner_DemoData_Category') + '2', __demo__value1__: 19, __demo__value2__: 37 },
                { __demo__category__: RS.$('ReportDesigner_DemoData_Category') + '3', __demo__value1__: 16, __demo__value2__: 36 },
                { __demo__category__: RS.$('ReportDesigner_DemoData_Category') + '4', __demo__value1__: 21, __demo__value2__: 36 }
            ]
        }),
        seriesTemplates: {
            column: {
                desc: RS.$('ReportDesigner_ChartType_Column'),
                xclass: 'YZSoft.src.designer.container.chart.CartesianYFields',
                seriesType: 'bar',
                config: {
                    stacked: false,
                    style: {
                        minBarWidth: 40,
                        maxBarWidth: 40,
                        inGroupGapWidth: 8
                    }
                },
                demo: {
                    title: RS.$('ReportDesigner_DemoData'),
                    xField: '__demo__category__',
                    yField: '__demo__value1__',
                    xAxis: 'xAxis',
                    yAxis: 'yAxis'
                }
            },
            column3d: {
                desc: RS.$('ReportDesigner_ChartTypeDesc_Column3D'),
                xclass: 'YZSoft.src.designer.container.chart.CartesianYFields',
                seriesType: 'bar3d',
                config: {
                    stacked: false,
                    style: {
                        minBarWidth: 40,
                        maxBarWidth: 40,
                        inGroupGapWidth: 3
                    }
                },
                demo: {
                    title: RS.$('ReportDesigner_DemoData'),
                    xField: '__demo__category__',
                    yField: '__demo__value1__',
                    xAxis: 'xAxis',
                    yAxis: 'yAxis'
                }
            },
            bar: {
                desc: RS.$('ReportDesigner_ChartType_Bar'),
                xclass: 'YZSoft.src.designer.container.chart.CartesianYFields',
                config: {
                    stacked: false,
                    style: {
                        minBarWidth: 26,
                        maxBarWidth: 26,
                        inGroupGapWidth: 3
                    }
                },
                demo: {
                    title: RS.$('ReportDesigner_DemoData'),
                    xField: '__demo__category__',
                    yField: '__demo__value1__',
                    xAxis: 'xAxis',
                    yAxis: 'yAxis'
                }
            },
            bar3d: {
                desc: RS.$('ReportDesigner_ChartTypeDesc_Bar3D'),
                xclass: 'YZSoft.src.designer.container.chart.CartesianYFields',
                config: {
                    stacked: false,
                    style: {
                        minBarWidth: 26,
                        maxBarWidth: 26,
                        inGroupGapWidth: 3
                    }
                },
                demo: {
                    title: RS.$('ReportDesigner_DemoData'),
                    xField: '__demo__category__',
                    yField: '__demo__value1__',
                    xAxis: 'xAxis',
                    yAxis: 'yAxis'
                }
            },
            line: {
                desc: RS.$('ReportDesigner_ChartType_Line'),
                xclass: 'YZSoft.src.designer.container.chart.CartesianSeries',
                config: {
                    style: {
                        lineWidth: 2
                    }
                },
                demo: {
                    title: RS.$('ReportDesigner_DemoData'),
                    isDemoSeries: true,
                    xField: '__demo__category__',
                    yField: '__demo__value1__',
                    xAxis: 'xAxis',
                    yAxis: 'yAxis'
                }
            },
            area: {
                desc: RS.$('ReportDesigner_ChartType_Area'),
                xclass: 'YZSoft.src.designer.container.chart.CartesianYFields',
                config: {
                    stacked: true,
                    style: {
                        opacity: 0.8
                    }
                },
                demo: {
                    title: RS.$('ReportDesigner_DemoData'),
                    xField: '__demo__category__',
                    yField: '__demo__value1__',
                    xAxis: 'xAxis',
                    yAxis: 'yAxis'
                }
            }
        },
        getSupportSeries: function () {
            var me = this,
                seriesTypes = me.supportSeries,
                seriesTemplates = me.seriesTemplates,
                data = [], series;

            Ext.each(seriesTypes, function (seriesType) {
                series = seriesTemplates[seriesType];
                data.push(Ext.apply({},{
                    seriesType: seriesType
                }, series));
            });

            return data;
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            ccfg = config.ccfg || {},
            designInfo = ccfg.designInfo,
            series = ccfg.series || [],
            seriesContainers,cfg;

        me.category = Ext.create('YZSoft.src.designer.container.chart.Category',{
            designer: config.designer,
            chartPart: me,
            xAxis: ccfg.axes && ccfg.axes[1]
        });

        seriesContainers = me.getSeriesContainers(designInfo.groups, series);

        me.seriesWrap = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: seriesContainers
        });

        cfg = {
            bbar: {
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    me.category,
                    me.seriesWrap
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            addSeriesClick: 'onAddSeriesClick'
        });
    },

    initDemoData: function (store) {
        if (store.getCount() == 0)
            return;

        var rec = store.getAt(0),
            i;

        i = 1;
        if (!('__demo__category__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__category__: RS.$('ReportDesigner_DemoData_Category') + i
                });

                i++;
            });
        }

        if (!('__demo__value1__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__value1__: Ext.Number.randomInt(0, 20) * 500
                });
            });
        }

        if (!('__demo__value2__' in rec.data)) {
            store.each(function (record) {
                Ext.apply(record.data, {
                    __demo__value2__: Ext.Number.randomInt(0, 20) * 500
                });
            });
        }
    },

    getNewSeriesConfig: function (type, seriesid, config) {
        var me = this,
            config = me.callParent(arguments),
            chart = me.getComp(),
            xAxis = chart.getAxis('xAxis');

        if (!config.xField) {
            Ext.apply(config, {
                xField: xAxis.getFields()
            });
        }

        return config;
    },

    getSeriesPart: function (series) {
        var me = this,
            seriesid = series.id,
            i, findPart;

        for (i = 0; i < me.seriesWrap.items.items.length; i++) {
            findPart = me.seriesWrap.items.items[i].tryGetPartFromSeriesId(seriesid);
            if (findPart)
                return findPart;
        }
    },

    getNextSeries: function (cnt) {
        var me = this,
            serieswrap = me.seriesWrap,
            index = serieswrap.items.indexOf(cnt),
            next = index + 1,
            i, seriesIds;

        for (i = next; i < serieswrap.items.getCount(); i++) {
            seriesIds = serieswrap.items.getAt(i).getSeriesIds();
            if (seriesIds.length != 0)
                return me.getSeriesFromId(seriesIds[0]);
        }
    },

    getGroupSeries: function (seriesIds, series) {
        var rv = [];

        Ext.each(series, function (seriesitem) {
            if (Ext.Array.contains(seriesIds, seriesitem.id))
                rv.push(seriesitem);
        });

        return rv;
    },

    parseGroups: function (groups, series) {
        var me = this,
            rv = [];

        Ext.each(groups, function (group) {
            rv.push({
                seriesType: group.seriesType,
                items: me.getGroupSeries(group.seriesIds, series)
            });
        });

        return rv;
    },

    createSeriesContainer: function (seriesType, series, cfg) {
        var me = this,
            series = Ext.Array.from(series),
            seriesTemplates = me.self.seriesTemplates,
            template = seriesTemplates[seriesType],
            container;

        cfg = Ext.apply({
            margin: '10 0 0 0'
        }, cfg);

        Ext.apply(cfg, {
            xclass: template.xclass,
            chartPart: me,
            series: series,
            seriesType: seriesType
        });

        container = Ext.create(cfg);
        me.relayEvents(container, ['addSeriesClick']);

        return container
    },

    getSeriesContainers: function (groups, series) {
        var me = this,
            groups = me.parseGroups(groups, series),
            rv = [],
            cfg;

        Ext.each(groups, function (group, index) {
            if (index == 0) {
                cfg = {
                    addOpt: true,
                    removeOpt: false
                }
            }
            else {
                cfg = {
                    addOpt: false,
                    removeOpt: true
                }
            }

            rv.push(me.createSeriesContainer(group.seriesType, group.items, cfg));
        });

        return rv;
    },

    onAddSeriesClick: function () {
        var me = this,
            chart = me.getComp(),
            chartType, series;

        series = me.self.getSupportSeries();
        if (series.length == 0)
            return;

        Ext.create('YZSoft.src.designer.dialogs.NewSeriesDialog', {
            title: RS.$('ReportDesigner_AddSeries'),
            autoShow: true,
            series: series,
            fn: function (rec) {
                var seriesType = rec.data.seriesType;

                me.seriesWrap.add(me.createSeriesContainer(seriesType, [], {
                    addOpt: false,
                    removeOpt: true
                }));
            }
        });
    }
});