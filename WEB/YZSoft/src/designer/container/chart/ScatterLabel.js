/*
designer
chartPart
series
*/
Ext.define('YZSoft.src.designer.container.chart.ScatterLabel', {
    extend: 'YZSoft.src.designer.container.chart.SingleFieldAbstract',
    emptyText: RS.$('All_Label'),

    constructor: function (config) {
        var me = this,
            config = config || {},
            series = config.series,
            labelField = Ext.Array.from(series && series.label && series.label.field)[0] || '',
            items = [];

        if (labelField && labelField != '__demo__label1__') {
            items.push({
                xclass: 'YZSoft.src.designer.part.ScatterLabel',
                isPart: true,
                cnt: me,
                items: [{
                    xclass: 'YZSoft.src.designer.component.ScatterLabel',
                    columnName: labelField
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
            series = me.getSeries(),
            dsNode = part.dsNode,
            comp = part.getComp(),
            columnName = comp.columnName;

        chartPart.setDSNode(dsNode);
        series.getLabel().getTemplate().setField(columnName);
        series.processData();

        chart.redraw();
    },

    onDrop: function (source, e, data) {
        var me = this,
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.ScatterLabel', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.ScatterLabel',
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

        if (part.isScatterLabel) {
            part.cnt = me;
            return;
        }

        var comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.ScatterLabel', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.ScatterLabel',
                columnName: columnName
            }]
        });
    }
});