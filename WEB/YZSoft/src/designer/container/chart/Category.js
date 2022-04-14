
Ext.define('YZSoft.src.designer.container.chart.Category', {
    extend: 'YZSoft.src.designer.container.chart.SingleFieldAbstract',
    emptyText: RS.$('ReportDesigner_EmptyText_CategoryContainer'),

    constructor: function (config) {
        var me = this,
            config = config || {},
            items = [],
            fieldName;

        if (config.xAxis && config.xAxis.fields) {
            var fieldName = Ext.Array.from(config.xAxis.fields)[0];

            if (fieldName != '__demo__category__') {
                items.push({
                    xclass: 'YZSoft.src.designer.part.Category',
                    isPart: true,
                    cnt: me,
                    items: [{
                        xclass: 'YZSoft.src.designer.component.Category',
                        columnName: Ext.Array.from(config.xAxis.fields)[0]
                    }]
                });
            }
        }

        config.items = items;
        me.callParent([config]);
    },

    onAddPart: function (container, part, index, eOpts) {
        var me = this,
            chartPart = me.chartPart,
            chart = chartPart.getComp(),
            xAxis = chart.getAxis('xAxis'),
            dsNode = part.dsNode,
            catComp = part.getComp(),
            columnName = catComp.columnName;

        chartPart.setDSNode(dsNode);
        xAxis.setFields(columnName);
        Ext.each(chart.getSeries(), function (series) {
            series.setXField(columnName);
            series.updateXAxis(xAxis);
        });

        chart.redraw();
    },

    onDrop: function (source, e, data) {
        var me = this,
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.Category', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.Category',
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

        if (part.isCategory) {
            part.cnt = me;
            return;
        }

        var comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.Category', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.Category',
                columnName: columnName
            }]
        });
    }
});