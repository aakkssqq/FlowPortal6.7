
Ext.define('YZSoft.designer.YZSoft.report.chart.PolarChartRadar', {
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
            radiusAxis = chart.getAxis('radiusAxis'),
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

        value = chart.getSeriesTemplateName();
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
                value: 'fill',
                icon: YZSoft.$url(me, 'images/PolarChartRadar/fill.png')
            }, {
                value: 'line',
                icon: YZSoft.$url(me, 'images/PolarChartRadar/line.png')
            }],
            value: value,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    chart.setSeriesTemplate(value);
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

        me.insetPadding = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_InsetPadding'),
            labelAlign: 'top',
            value: chart.getInsetPadding().top,
            minValue: 0,
            maxValue: 100,
            applySetting: function () {
                var value = this.getValue();

                chart.setInsetPadding({
                    top: value,
                    left: value,
                    right: value,
                    bottom: value
                });

                chart.performLayout();
                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.innerPadding = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_InnerPadding'),
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

        me.segChart = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Seg_Chart'),
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
                me.insetPadding,
                me.innerPadding
            ]
        });

        me.chkThousands = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_Format_Thousands'),
            value: radiusAxis.rendererFormat.thousands,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    radiusAxis.rendererFormat.thousands = value;
                    radiusAxis.performLayout();
                }
            }
        });

        me.edtScale = Ext.create('Ext.form.field.Number', {
            fieldLabel: RS.$('ReportDesigner_Format_Scale'),
            labelWidth: 120,
            hideTrigger: true,
            minValue: 1,
            allowDecimals: false,
            value: radiusAxis.rendererFormat.scale,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Math.max(1, this.getValue());

                radiusAxis.rendererFormat.scale = value;
                radiusAxis.performLayout();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtUnit = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_Format_Unit'),
            labelWidth: 120,
            value: radiusAxis.rendererFormat.unit,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                radiusAxis.rendererFormat.unit = value;
                radiusAxis.performLayout();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.numberAxis = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_ValueAxis'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.chkThousands,
                me.edtScale,
                me.edtUnit
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
            me.numberAxis
        ];

        me.callParent();
    }
});