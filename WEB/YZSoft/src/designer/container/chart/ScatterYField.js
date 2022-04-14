/*
designer
chartPart
series
*/
Ext.define('YZSoft.src.designer.container.chart.ScatterYField', {
    extend: 'YZSoft.src.designer.container.chart.SingleFieldAbstract',
    emptyText: 'Y',

    constructor: function (config) {
        var me = this,
            config = config || {},
            series = config.series,
            yField = Ext.Array.from(series && series.yField)[0] || '',
            items = [];

        if (yField && yField != '__demo__value2__') {
            items.push({
                xclass: 'YZSoft.src.designer.part.ScatterYField',
                isPart: true,
                cnt: me,
                items: [{
                    xclass: 'YZSoft.src.designer.component.ScatterYField',
                    columnName: yField
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
            yAxis = chart.getAxis('yAxis'),
            series = me.getSeries(),
            dsNode = part.dsNode,
            comp = part.getComp(),
            columnName = comp.columnName;

        chartPart.setDSNode(dsNode);
        series.setYField(columnName);
        yAxis.getTitle().setAttributes({
            text: columnName
        });
        series.updateYAxis(yAxis);
        chart.redraw();
    },

    onDrop: function (source, e, data) {
        var me = this,
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.ScatterYField', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.ScatterYField',
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

        if (part.isScatterYField) {
            part.cnt = me;
            return;
        }

        var comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.ScatterYField', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.ScatterYField',
                columnName: columnName
            }]
        });
    }
});