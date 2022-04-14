
Ext.define('YZSoft.designer.Ext.chart.series.Bar3D', {
    extend: 'YZSoft.designer.SeriesAbstract',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            part = config.part,
            chart = part.getChart(),
            flipXY = chart.getFlipXY();

        if (!flipXY)
            return Ext.create('YZSoft.designer.Ext.chart.series.Column3D', config);

        this.callParent(arguments);
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            chart = part.getChart(),
            series = part.getSeries(),
            style = series.getStyle(),
            value;

        if (series.getStacked()) {
            if (series.getFullStack())
                value = 'fullStack'
            else
                value = 'stacked'
        }
        else {
            value = 'group';
        }

        me.seriesType = Ext.create('Ext.button.Segmented', {
            cls:'yz-semented-button-img',
            layout: {
                type: 'table',
                columns: 3
            },
            defaults: {
                iconCls: 'yz-icon-chart-series-type'
            },
            items: [{
                value: 'group',
                icon: YZSoft.$url(me, 'images/Bar3D/group.png')
            }, {
                value: 'stacked',
                icon: YZSoft.$url(me, 'images/Bar3D/stacked.png')
            }, {
                value: 'fullStack',
                icon: YZSoft.$url(me, 'images/Bar3D/fullStack.png')
            }],
            value: value,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    switch (value) {
                        case 'group':
                            series.setStacked(false);
                            break;
                        case 'stacked':
                            series.setStacked(true);
                            series.setFullStack(false);
                            break;
                        case 'fullStack':
                            series.setStacked(true);
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

        me.edtMinBarWidth = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_BarWidth'),
            labelAlign: 'top',
            margin: '10 0 7 0',
            value: style.minBarWidth,
            minValue: 20,
            maxValue: 100,
            applySetting: function () {
                var value = this.getValue();
                series.setStyle({
                    minBarWidth: value,
                    maxBarWidth: value
                });
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.edtInGroupGapWidth = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_InGroupGap'),
            labelAlign: 'top',
            value: style.inGroupGapWidth,
            minValue: 0,
            maxValue: 30,
            applySetting: function () {
                var value = this.getValue();
                series.setStyle({
                    inGroupGapWidth: value
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
            title: RS.$('ReportDesigner_Seg_Width'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.edtMinBarWidth,
                me.edtInGroupGapWidth
            ]
        }];

        me.callParent();
    }
});