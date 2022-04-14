
Ext.define('YZSoft.designer.Ext.chart.series.Line', {
    extend: 'YZSoft.designer.SeriesAbstract',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    curves: {
        linear: {
            type: 'linear'
        },
        cardinal: {
            type: 'cardinal',
            tension:0.5
        },
        natural: {
            type: 'natural'
        },
        'step-after': {
            type: 'step-after'
        }
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            chart = part.getChart(),
            series = part.getSeries(),
            style = series.getStyle();

        me.edtTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_SeriesName'),
            value: series.getTitle(),
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                series.setTitle(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

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
                value: 'linear',
                icon: YZSoft.$url(me, 'images/Line/linear.png')
            }, {
                value: 'cardinal',
                hidden: true,
                icon: YZSoft.$url(me, 'images/Line/cardinal.png')
            }, {
                value: 'natural',
                icon: YZSoft.$url(me, 'images/Line/natural.png')
            }, {
                value: 'step-after',
                icon: YZSoft.$url(me, 'images/Line/step-after.png')
            }],
            value: series.getCurve().type,
            listeners: {
                change: function () {
                    var value = this.getValue(),
                        curve = me.curves[value];

                    series.setCurve(curve);
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

        me.chkAutoColor = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_AutoColor'),
            value: !style.strokeStyle,
            listeners: {
                change: function (field, checked) {
                    if (checked) {
                        delete series._style.strokeStyle;

                        series.setStyle({
                        });

                        chart.refreshLegendStore();
                        chart.redraw();
                    }
                    else {
                        var color = me.colorPicker.color;

                        series.setStyle({
                            strokeStyle: color
                        });

                        chart.refreshLegendStore();
                        chart.redraw();
                    }
                }
            }
        });

        me.colorPicker = Ext.create('YZSoft.src.button.ColorPickerTextBox', {
            flex: 1,
            listeners: {
                picked: function (color) {
                    me.chkAutoColor.suspendEvent('change');
                    me.chkAutoColor.setValue(false);
                    me.chkAutoColor.resumeEvent('change');

                    series.setStyle({
                        strokeStyle: color
                    });

                    chart.refreshLegendStore();
                    chart.redraw();
                }
            }
        });
        me.colorPicker.setColor(series.getSprites()[0].attr.strokeStyle);

        me.segColor = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Seg_Color'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.chkAutoColor, {
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('ReportDesigner_SpecialColor'),
                    layout: {
                        type: 'hbox',
                        align: 'center'
                    },
                    items: [me.colorPicker]
                }
            ]
        });


        me.edtLineWidth = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_LineWidth'),
            labelAlign: 'top',
            value: style.lineWidth,
            minValue: 1,
            maxValue: 20,
            applySetting: function () {
                var value = this.getValue();
                series.setStyle({
                    lineWidth: value
                });
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.items = [
            me.edtTitle, me.segSeriesType, me.segColor, {
                title: RS.$('ReportDesigner_Seg_Line'),
                cls: 'yz-property-fieldset-chart',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 0 7 0'
                },
                items: [me.edtLineWidth]
            }
        ];

        me.callParent();
    }
});