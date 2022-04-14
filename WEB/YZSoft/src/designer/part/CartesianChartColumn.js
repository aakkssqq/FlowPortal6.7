
Ext.define('YZSoft.src.designer.part.CartesianChartColumn', {
    extend: 'YZSoft.src.designer.part.CartesianChartAbstract',
    inheritableStatics: {
        defaultSeriesType: 'column',
        supportSeries: [
            'line',
            'area'
        ],
        chartTemplate: {
            height: 500,
            captions: {
                title: {
                    text: RS.$('ReportDesigner_ChartType_Column'),
                    align: 'center'
                }
            },
            legend: {
                docked: 'bottom'
            },
            innerPadding: {
                top: 30
            },
            axes: [{
                rendererFormat: { //扩展属性
                    thousands: true,
                    scale: 1,
                    unit: ''
                }
            }, {
                fields: '__demo__category__'
            }]
        }
    },

    initComponent: function () {
        this.callParent(arguments);

        var me = this,
            chart = me.getComp();

        chart.on({
            scope: me,
            itemclick:'onItemclick',
            itemhighlight: 'onItemhighlight'
        });
    },

    onItemclick: function (chart, item, e) {
        var me = this,
            part = me.getSeriesPart(item.series);


        if (part.isDesignContainer) {
            var index = item.series.getSprites().indexOf(item.sprite);
            part = part.items.getAt(index);
        }

        //if (oldPart)
        //    oldPart.removeCls('yz-part-over');

        //if (part)
        //    part.addCls('yz-part-over');

        if (part) {
            me.designer.dcnt.select(part);
            e.stopEvent();
        }
    },

    onItemhighlight: function (chart, newItem, oldItem, eOpts) {
        //var me = this,
        //    oldPart = oldItem && oldItem.series && me.getSeriesPart(oldItem.series),
        //    newPart = me.getSeriesPart(newItem.series);


        //if (oldPart && oldPart.isDesignContainer) {
        //    var index = oldItem.series.getSprites().indexOf(oldItem.sprite);
        //    oldPart = oldPart.items.getAt(index);
        //}

        //if (newPart.isDesignContainer) {
        //    var index = newItem.series.getSprites().indexOf(newItem.sprite);
        //    newPart = newPart.items.getAt(index);
        //}

        ////if (oldPart)
        ////    oldPart.removeCls('yz-part-over');

        ////if (newPart)
        ////    newPart.addCls('yz-part-over');

        //if (newPart)
        //    me.designer.dcnt.select(newPart);

    }
});