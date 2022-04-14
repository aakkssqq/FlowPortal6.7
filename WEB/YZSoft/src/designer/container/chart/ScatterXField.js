/*
designer
chartPart
series
*/
Ext.define('YZSoft.src.designer.container.chart.ScatterXField', {
    extend: 'YZSoft.src.designer.container.chart.SingleFieldAbstract',
    emptyText: 'X',

    constructor: function (config) {
        var me = this,
            config = config || {},
            series = config.series,
            xField = Ext.Array.from(series && series.xField)[0] || '',
            items = [];

        if (xField && xField != '__demo__value1__') {
            items.push({
                xclass: 'YZSoft.src.designer.part.ScatterXField',
                isPart: true,
                cnt: me,
                items: [{
                    xclass: 'YZSoft.src.designer.component.ScatterXField',
                    columnName: xField
                }]
            });
        }

        config.items = items;
        me.callParent([config]);
    },

    onAddPart: function (container, part, index, eOpts) {
        var me = this,
            chartPart = me.chartPart,
            chart = chartPart.getComp(),
            xAxis = chart.getAxis('xAxis'),
            series = me.getSeries(),
            dsNode = part.dsNode,
            comp = part.getComp(),
            columnName = comp.columnName;

        chartPart.setDSNode(dsNode);
        xAxis.setFields(columnName);
        series.setXField(columnName);
        xAxis.getTitle().setAttributes({
            text: columnName
        });
        series.updateXAxis(xAxis);
        chart.redraw();
    },

    onDrop: function (source, e, data) {
        var me = this,
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.ScatterXField', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.ScatterXField',
                columnName: columnName
            }]
        });

        me.removeAll(true);
        me.add(newPart);

        me.designer.dcnt.select(newPart);
    },

    onDorpPart: function (part) {
        var me = this;

        if (part.ownerCt == this)
            return false;
        else
            me.removeAll(true);

        if (part.isScatterXField) {
            part.cnt = me;
            return;
        }

        var comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.ScatterXField', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.ScatterXField',
                columnName: columnName
            }]
        });
    }
});