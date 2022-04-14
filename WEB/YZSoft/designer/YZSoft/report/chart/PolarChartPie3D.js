
Ext.define('YZSoft.designer.YZSoft.report.chart.PolarChartPie3D', {
    extend: 'YZSoft.designer.ChartAbstract',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            chart = me.tag,
            series = Ext.Array.from(chart.getSeries())[0],
            value;

        me.edtCaption = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: RS.$('ReportDesigner_ChartTitle'),
            labelAlign: 'top',
            cls: 'yz-textarea-3line',
            value: chart.getCaptions().title.getText(),
            enableKeyEvents: true,
            applySetting: function () {
                var title = chart.getCaptions().title,
                    value = Ext.String.trim(this.getValue());

                title.setText(value);
                chart.performLayout();
                chart.redraw();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.captionAlign = Ext.create('Ext.button.Segmented', {
            items: [{
                value: 'left',
                glyph: 0xe930
            }, {
                value: 'center',
                glyph: 0xe92e
            }, {
                value: 'right',
                glyph: 0xe92f
            }],
            value: chart.getCaptions().title.getAlign(),
            listeners: {
                change: function () {
                    var title = chart.getCaptions().title,
                        value = this.getValue();

                    title.setAlign(value);
                    chart.performLayout();
                    chart.redraw();
                }
            }
        });

        me.edtHeight = Ext.create('Ext.form.field.Number', {
            width: 94,
            hideTrigger: true,
            minValue: 1,
            allowDecimals: false,
            value: chart.getHeight(),
            enableKeyEvents: true,
            applySetting: function () {
                var value = Math.max(1, this.getValue());

                chart.setHeight(value);
            },
            listeners: {
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER)
                        this.applySetting();
                },
                blur: 'applySetting'
            }
        });

        value = series.getDonut() ? 'donut' : 'solid';
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
                value: 'solid',
                icon: YZSoft.$url(me, 'images/PolarChartPie3D/solid.png')
            }, {
                value: 'donut',
                icon: YZSoft.$url(me, 'images/PolarChartPie3D/donut.png')
            }],
            value: value,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    switch (value) {
                        case 'solid':
                            series.setDonut(0);
                            chart.redraw();
                            me.donut.hide();
                            break;
                        case 'donut':
                            me.donut.setValue(me.donut.getValue() || 50);
                            series.setDonut(me.donut.getValue());
                            chart.redraw();
                            me.donut.show();
                            break;
                    }
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

        me.chkDisplayLegend = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_DisplayLegend'),
            checked: !chart.getLegend().getHidden(),
            listeners: {
                change: function () {
                    var legend = chart.getLegend(),
                        value = this.getValue();

                    legend.setHidden(!value);
                    me.cntLegendPos[value ? 'show' : 'hide']();
                }
            }
        });

        me.segLegendPos = Ext.create('Ext.button.Segmented', {
            items: [{
                value: 'top',
                text: RS.$('All_Top')
            }, {
                value: 'right',
                text: RS.$('All_Right')
            }, {
                value: 'bottom',
                text: RS.$('All_Bottom')
            }, {
                value: 'left',
                text: RS.$('All_Left')
            }],
            value: chart.getLegend().getDocked(),
            listeners: {
                change: function () {
                    var legend = chart.getLegend(),
                        value = this.getValue();

                    legend.setDocked(value);
                }
            }
        });

        me.cntLegendPos = Ext.create('Ext.form.FieldContainer', {
            fieldLabel: RS.$('ReportDesigner_Legend_Pos'),
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [me.segLegendPos]
        });

        me.legend = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Seg_Legend'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.chkDisplayLegend,
                me.cntLegendPos
            ]
        });

        me.innerPadding = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_SimplePadding'),
            labelAlign: 'top',
            value: chart.getInnerPadding(),
            minValue: 0,
            maxValue: 100,
            applySetting: function () {
                var value = this.getValue();

                chart.setInnerPadding(value);
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.rotation = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_Rotation'),
            labelAlign: 'top',
            value: Math.round(Ext.draw.Draw.degrees(series.getRotation())) || 0,
            minValue: 0,
            maxValue: 90,
            tipText: function (thumb) {
                return String(thumb.value) + '°';
            },
            applySetting: function () {
                var value = this.getValue();
                series.setRotation(value);
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.donut = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_Donut'),
            labelAlign: 'top',
            value: series.getDonut(),
            hidden: !!series.getDonut(),
            minValue: 0,
            maxValue: 100,
            tipText: function (thumb) {
                return String(thumb.value) + '%';
            },
            applySetting: function () {
                var value = this.getValue();

                series.setDonut(value);
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.thickness = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_Thickness'),
            labelAlign: 'top',
            value: series.getThickness(),
            minValue: 20,
            maxValue: 70,
            applySetting: function () {
                var value = this.getValue();

                series.setThickness(value);
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.distortion = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_Distortion'),
            labelAlign: 'top',
            value: series.getDistortion(),
            minValue: 0.35,
            maxValue: 0.65,
            decimalPrecision: 2,
            increment:0.01,
            applySetting: function () {
                var value = this.getValue();

                series.setDistortion(value);
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.segChart = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_ChartType_Pie'),
            cls: 'yz-property-fieldset-chart',
            bodyPadding: '16 0 0 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 0 0'
            },
            items: [
                me.innerPadding,
                me.rotation,
                me.donut,
                me.thickness,
                me.distortion
            ]
        });

        me.items = [
            me.edtCaption, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_TitleAlign'),
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [me.captionAlign]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_Chart_Height'),
                layout: {
                    type: 'hbox', pack: 'end'
                },
                items: [me.edtHeight]
            },
            me.segSeriesType,
            me.legend,
            me.segChart,
            me.categoryAxis
        ];

        me.callParent();
    }
});