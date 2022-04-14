
/* config
chartPart
series
seriesType
*/

Ext.define('YZSoft.src.designer.container.chart.CartesianYFields', {
    extend: 'YZSoft.src.designer.container.chart.CombinableYFieldAbstract',
    isYField:true,
    config: {
        settingOpt: true
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            chartPart = config.chartPart,
            series = Ext.Array.from(config.series)[0],
            items = [],
            yFields;

        if (!series) {
            series = chartPart.addSeries(config.seriesType, chartPart.nextSeriesId(), {
                yField: []
            });
        }

        me.seriesid = series.id;
        yFields = Ext.Array.from(series.yField);

        Ext.each(yFields, function (yField) {
            if (yField != '__demo__value1__') {
                items.push({
                    xclass: 'YZSoft.src.designer.part.StackedSeriesYField',
                    isPart: true,
                    cnt: me,
                    items: [{
                        xclass: 'YZSoft.src.designer.component.StackedSeriesYField',
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
            dsNode = part.dsNode,
            chart = me.getChart(),
            series = me.getSeries(),
            label = series.getLabel(),
            labelTpl = label && label.getTemplate(),
            sprites = Ext.Array.from(series.sprites),
            yField = [],
            titles = Ext.Array.from(series.getTitle(), true),
            yFieldsColors = Ext.Array.clone(series.getYFieldsColors()),
            hidden = Ext.Array.from(series.getHidden()),
            fieldName,i;

        chartPart.setDSNode(dsNode);

        me.items.each(function (yFieldPart) {
            fieldName = yFieldPart.getComp().columnName;
            yField.push(fieldName);
        });

        Ext.Array.insert(titles, index, [part.getComp().columnName]);
        Ext.Array.insert(yFieldsColors, index, [null]);
        Ext.Array.insert(hidden, index, [false]);

        for (i = 0; i < yField.length; i++) {
            if (yField[i] == '__demo__value1__') {
                Ext.Array.remove(yField, i);
                Ext.Array.remove(titles, i);
                Ext.Array.remove(yFieldsColors, i);
                i--;
            }
        }

        series.setYField(yField);
        for (var i = 0; i < sprites.length; i++) {
            sprites[i].setField(yField[i]);
        }
        labelTpl && labelTpl.setField(yField);
        series.setYFieldsColors(yFieldsColors);
        series.setTitle(titles);
        series.updateHidden(hidden);
        series.processData();

        series.updateHighlight(series.getHighlight());
        chartPart.refreshChart();

        me.items.each(function (part) {
            part.fireEvent('indexChanged');
        });

        me.chartPart.designer.dcnt.select(part);
    },

    onRemovePart: function (container, part, eOpts) {
        var me = this,
            lastIndex = part.lastIndex,
            chartPart = me.chartPart,
            chart = me.getChart(),
            series = me.getSeries(),
            label = series.getLabel(),
            labelTpl = label && label.getTemplate(),
            sprites = Ext.Array.from(series.sprites),
            surface = series.getSurface(),
            yField = [],
            titles = Ext.Array.from(series.getTitle(), true),
            yFieldsColors = Ext.Array.clone(series.getYFieldsColors()),
            hidden = Ext.Array.from(series.getHidden()),
            fieldName;

        me.items.each(function (yFieldPart) {
            fieldName = yFieldPart.getComp().columnName;
            yField.push(fieldName);
        });

        Ext.Array.removeAt(titles, lastIndex);
        Ext.Array.removeAt(yFieldsColors, lastIndex);
        Ext.Array.removeAt(hidden, lastIndex);

        for (var i = yField.length; i < sprites.length; i++) {
            chartPart.removeSprite(series, sprites[i]);
        }
        
        series.sprites = Ext.Array.erase(sprites, yField.length, sprites.length - yField.length);
        series.setYField(yField);
        for (var i = 0; i < yField.length; i++) {
            sprites[i].setField(yField[i]);
        }
        labelTpl && labelTpl.setField(yField);
        series.setYFieldsColors(yFieldsColors);
        series.setTitle(titles);
        series.updateHidden(hidden);
        series.updateStacked();
        chartPart.refreshChart(); //不加动画切换很闪烁

        me.items.each(function (part) {
            part.fireEvent('indexChanged');
        });
    },

    onDorpPartExchangePos: function (part, oldIndex, newIndex) {
        var me = this,
            chartPart = me.chartPart,
            chart = me.getChart(),
            series = me.getSeries(),
            sprites = Ext.Array.from(series.sprites),
            label = series.getLabel(),
            labelTpl = label && label.getTemplate(),
            yField = series.getYField(),
            titles = Ext.Array.from(series.getTitle(), true),
            yFieldsColors = Ext.Array.clone(series.getYFieldsColors()),
            hidden = Ext.Array.from(series.getHidden()),
            item;

        item = {
            yField: yField[oldIndex],
            titles: titles[oldIndex],
            yFieldsColors: yFieldsColors[oldIndex],
            hidden: hidden[oldIndex]
        };

        Ext.Array.removeAt(yField, oldIndex);
        Ext.Array.removeAt(titles, oldIndex);
        Ext.Array.removeAt(yFieldsColors, oldIndex);
        Ext.Array.removeAt(hidden, oldIndex);

        Ext.Array.insert(yField, newIndex, [item.yField]);
        Ext.Array.insert(titles, newIndex, [item.titles]);
        Ext.Array.insert(yFieldsColors, newIndex, [item.yFieldsColors]);
        Ext.Array.insert(hidden, newIndex, [item.hidden]);

        series.setYField(yField);
        for (var i = 0; i < yField.length; i++) {
            sprites[i].setField(yField[i]);
        }
        labelTpl && labelTpl.setField(yField);
        series.setYFieldsColors(yFieldsColors);
        series.setTitle(titles);
        series.updateHidden(hidden);
        series.updateStacked();
        chartPart.refreshChart(); //不加动画切换很闪烁

        me.items.each(function (part) {
            part.fireEvent('indexChanged');
        });

        me.chartPart.designer.dcnt.select(part);
    },

    onDrop: function (source, e, data) {
        var me = this,
            index = me.layout.getRenderTarget().indexOf(me.dropIndicator.dom),
            record = data.record,
            columnName = record.data.tag.ColumnName,
            newPart;

        newPart = Ext.create('YZSoft.src.designer.part.StackedSeriesYField', {
            isPart: true,
            dsNode: data.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.StackedSeriesYField',
                columnName: columnName
            }]
        });

        me.insert(index, newPart);
    },

    onDorpPart: function (part) {
        if (part.isYField) {
            part.cnt = this;
            return;
        }

        var me = this,
            comp = part.getComp(),
            columnName = comp.columnName,
            newPart;

        return Ext.create('YZSoft.src.designer.part.StackedSeriesYField', {
            isPart: true,
            dsNode: part.dsNode,
            cnt: me,
            items: [{
                xclass: 'YZSoft.src.designer.component.StackedSeriesYField',
                columnName: columnName
            }]
        });
    }
});