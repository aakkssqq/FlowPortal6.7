/*
designer
chartPart
series
*/
Ext.define('YZSoft.src.designer.container.chart.RadarAngleField', {
    extend: 'YZSoft.src.designer.container.chart.SingleFieldAbstract',
    emptyText: RS.$('ReportDesigner_EmptyText_RadarAngleField'),

    constructor: function (config) {
        var me = this,
            config = config || {},
            angleAxis = config.angleAxis,
            angleField = Ext.Array.from(angleAxis && angleAxis.fields)[0] || '',
            items = [];

        if (angleField && angleField != '__demo__kpi1__') {
            items.push({
                xclass: 'YZSoft.src.designer.part.RadarAngleField',
                isPart: true,
                cnt: me,
                items: [{
                    xclass: 'YZSoft.src.designer.component.RadarAngleField',
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
            angleAxis = chart.getAxis('angleAxis'),
            dsNode = part.dsNode,
            comp = part.getComp(),
            columnName = comp.columnName;

        chartPart.setDSNode(dsNode);
        angleAxis.setFields(columnName);

        Ext.each(chart.getSeries(), function (series) {
            series.setAngleField(columnName);
            //series.processData();
        });

        //chart.refreshLegendStore();
        chart.processData();

        chart.redraw();
    },

    onDrop: function (source, e, data) {
        var me = this,
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.RadarAngleField', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.RadarAngleField',
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

        if (part.isRadarAngleField) {
            part.cnt = me;
            return;
        }

        var comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.RadarAngleField', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.RadarAngleField',
                columnName: columnName
            }]
        });
    }
});