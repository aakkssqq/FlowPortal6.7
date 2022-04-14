/*
designer
chartPart
series
*/
Ext.define('YZSoft.src.designer.container.chart.RadarSeries', {
    extend: 'YZSoft.src.designer.container.chart.SeriesAbstract',
    config: {
        seriesType: 'radar'
    },
    emptyText: RS.$('ReportDesigner_Series'),

    constructor: function (config) {
        var me = this,
            config = config || {},
            items = [],
            radiusField;

        Ext.each(config.series, function (series) {
            if (series.isDemoSeries)
                return;

            radiusField = series.radiusField;
            items.push({
                xclass: 'YZSoft.src.designer.part.RadarSeriesField',
                isPart: true,
                cnt: me,
                seriesid: series.id,
                items: [{
                    xclass: 'YZSoft.src.designer.component.RadarSeriesField',
                    columnName: radiusField
                }]
            });
        });

        config.items = items;
        me.callParent([config]);
    },

    onAddPart: function (container, part, index, eOpts) {
        var me = this,
            chartPart = me.chartPart,
            chart = chartPart.getComp(),
            angleAxis = chart.getAxis('angleAxis'),
            angleField = Ext.Array.from(angleAxis.getFields())[0],
            seriesType = me.seriesType,
            dsNode = part.dsNode,
            seriesComp = part.getComp(),
            columnName = seriesComp.columnName,
            seriesid = chartPart.nextSeriesId(),
            beforeSeries, newSeries;

        chartPart.setDSNode(dsNode);
        part.seriesid = seriesid;

        beforeSeries = me.getNextSeries(index);
        newSeries = chartPart.getNewSeriesConfig(seriesType, seriesid, {
            angleField: angleField,
            radiusField: columnName
        });

        chartPart.removeAllDemoSeries();

        Ext.suspendLayouts();
        chartPart.insetSeries(beforeSeries, newSeries);
        Ext.resumeLayouts(true);

        me.chartPart.designer.dcnt.select(part);
    },

    onDrop: function (source, e, data) {
        var me = this,
            index = me.layout.getRenderTarget().indexOf(me.dropIndicator.dom),
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.RadarSeriesField', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.RadarSeriesField',
                columnName: columnName
            }]
        });

        me.insert(index, newPart);
    },

    onDorpPart: function (part) {
        if (part.isRadarSeriesField) {
            part.cnt = this;
            return;
        }

        var me = this,
            comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.RadarSeriesField', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.RadarSeriesField',
                columnName: columnName
            }]
        });
    }
});