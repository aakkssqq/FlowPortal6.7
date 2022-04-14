
/*config:
chartPart
series
seriesType
*/

Ext.define('YZSoft.src.designer.container.chart.CartesianSeries', {
    extend: 'YZSoft.src.designer.container.chart.CombinableSeriesAbstract',
    isSeries: true,
    config: {
        settingOpt: false
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            items = [],
            yField;

        Ext.each(config.series, function (series) {
            yField = Ext.Array.from(series.yField)[0];
            if (yField != '__demo__value1__') {
                items.push({
                    xclass: 'YZSoft.src.designer.part.Series',
                    isPart: true,
                    cnt: me,
                    seriesid: series.id,
                    items: [{
                        xclass: 'YZSoft.src.designer.component.Series',
                        columnName: yField
                    }]
                });
            }
        });

        config.items = items;
        me.callParent([config]);
    },

    onAddPart: function (container, part, index, eOpts) {
        var me = this,
            chartPart = me.chartPart,
            chart = chartPart.getComp(),
            xAxis = chart.getAxis('xAxis'),
            xField = Ext.Array.from(xAxis.getFields())[0],
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
            xField: xField,
            yField: columnName,
            xAxis: 'xAxis',
            yAxis: 'yAxis'
        });

        chartPart.removeAllDemoSeries();
        chartPart.insetSeries(beforeSeries, newSeries);

        me.chartPart.designer.dcnt.select(part);
    },

    onDrop: function (source, e, data) {
        var me = this,
            index = me.layout.getRenderTarget().indexOf(me.dropIndicator.dom),
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.Series', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.Series',
                columnName: columnName
            }]
        });

        me.insert(index, newPart);
    },

    onDorpPart: function (part) {
        if (part.isSeries) {
            part.cnt = this;
            return;
        }

        var me = this,
            comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.Series', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.Series',
                columnName: columnName
            }]
        });
    }
});