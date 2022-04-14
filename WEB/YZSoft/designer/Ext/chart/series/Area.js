
Ext.define('YZSoft.designer.Ext.chart.series.Area', {
    extend: 'YZSoft.designer.SeriesAbstract',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            chart = part.getChart(),
            series = part.getSeries(),
            style = series.getStyle(),
            value;

        if (series.getFullStack())
            value = 'fullStack'
        else
            value = 'stacked'

        me.seriesType = Ext.create('Ext.button.Segmented', {
            cls: 'yz-semented-button-img',
            layout: {
                type: 'table',
                columns: 3
            },
            defaults: {
                iconCls: 'yz-icon-chart-series-type'
            },
            items: [{
                value: 'stacked',
                icon: YZSoft.$url(me, 'images/Area/stacked.png')
            }, {
                value: 'fullStack',
                icon: YZSoft.$url(me, 'images/Area/fullStack.png')
            }],
            value: value,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    switch (value) {
                        case 'stacked':
                            series.setFullStack(false);
                            break;
                        case 'fullStack':
                            series.setFullStack(true);
                            break;
                    }
                    series.updateStacked();
                    chart.redraw();
                }
            }
        });

        me.segSeriesType = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_ChartType'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'start'
            },
            defaults: {
                margin: '10 0 7 0'
            },
            items: [
                me.seriesType
            ]
        });

        me.edtOpacity = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_Transparency'),
            labelAlign: 'top',
            margin: '10 0 7 0',
            value: 100 - style.opacity * 100,
            minValue: 0,
            maxValue: 80,
            applySetting: function () {
                var value = 1 - this.getValue()/100.0;
                series.setStyle({
                    opacity: value
                });
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.items = [me.segSeriesType, {
            title: RS.$('ReportDesigner_Transparency'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.edtOpacity
            ]
        }];

        me.callParent();
    }
});