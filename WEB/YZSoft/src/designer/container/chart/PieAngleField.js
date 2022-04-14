/*
designer
chartPart
series
*/
Ext.define('YZSoft.src.designer.container.chart.PieAngleField', {
    extend: 'YZSoft.src.designer.container.chart.SingleFieldAbstract',
    emptyText: RS.$('ReportDesigner_ValueField'),

    constructor: function (config) {
        var me = this,
            config = config || {},
            series = config.series,
            angleField = Ext.Array.from(series && series.angleField)[0] || '',
            items = [];

        if (angleField && angleField != '__demo__angle1__') {
            items.push({
                xclass: 'YZSoft.src.designer.part.PieAngleField',
                isPart: true,
                cnt: me,
                items: [{
                    xclass: 'YZSoft.src.designer.component.PieAngleField',
                    columnName: angleField
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
        series.setAngleField(columnName);
        series.processData();

        chart.redraw();
    },

    onDrop: function (source, e, data) {
        var me = this,
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.PieAngleField', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.PieAngleField',
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

        if (part.isPieAngleField) {
            part.cnt = me;
            return;
        }

        var comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.PieAngleField', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.PieAngleField',
                columnName: columnName
            }]
        });
    }
});