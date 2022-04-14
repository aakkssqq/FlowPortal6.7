
Ext.define('YZSoft.designer.YZSoft.report.chart.CartesianChart', {
    extend: 'YZSoft.designer.ChartAbstract',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            chart = me.tag,
            xAxis = chart.getAxis('xAxis'),
            yAxis = chart.getAxis('yAxis');

        me.edtCaption = Ext.create('Ext.form.field.TextArea',{
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
                value:'left',
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

        me.chkDisplayLegend = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_DisplayLegend'),
            checked: !chart.getLegend().getHidden(),
            listeners: {
                change: function () {
                    var legend = chart.getLegend(),
                        value = this.getValue();

                    legend.setHidden(!value);
                    me.cntLegendPos[value ? 'show' : 'hide']();
                    //me.cntLegendPos.setDisabled(!value);

                }
            }
        });

        me.segLegendPos = Ext.create('Ext.button.Segmented', {
            items: [{
                value:'top',
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

        me.cntLegendPos = Ext.create('Ext.form.FieldContainer',{
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

        me.innerPaddingTop = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('All_Top'),
            value: chart.getInnerPadding().top,
            minValue: 0,
            maxValue: 50,
            listeners: {
                scope:me,
                change: 'onInnerPaddingChanged',
                dragstart: 'onSliderDragStart',
                dragend: 'onSliderDragEnd'
            }
        });

        me.innerPaddingBottom = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('All_Bottom'),
            value: chart.getInnerPadding().bottom,
            minValue: 0,
            maxValue: 50,
            listeners: {
                scope: me,
                change: 'onInnerPaddingChanged',
                dragstart: 'onSliderDragStart',
                dragend: 'onSliderDragEnd'
            }
        });

        me.innerPaddingLeft = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('All_Left'),
            value: chart.getInnerPadding().left,
            minValue: 0,
            maxValue: 50,
            listeners: {
                scope: me,
                change: 'onInnerPaddingChanged',
                dragstart: 'onSliderDragStart',
                dragend: 'onSliderDragEnd'
            }
        });

        me.innerPaddingRight = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('All_Right'),
            value: chart.getInnerPadding().right,
            minValue: 0,
            maxValue: 50,
            listeners: {
                scope: me,
                change: 'onInnerPaddingChanged',
                dragstart: 'onSliderDragStart',
                dragend: 'onSliderDragEnd'
            }
        });

        me.innerPadding = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Padding'),
            cls: 'yz-property-fieldset-chart',
            bodyPadding:'16 0 0 0',
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            defaults: {
                margin: '0 0 3 0',
                labelWidth: 70,
            },
            items: [
                me.innerPaddingTop,
                me.innerPaddingBottom,
                me.innerPaddingLeft,
                me.innerPaddingRight
            ]
        });

        me.chkThousands = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_Format_Thousands'),
            value: yAxis.rendererFormat.thousands,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    yAxis.rendererFormat.thousands = value;
                    yAxis.performLayout();
                }
            }
        });

        me.edtScale = Ext.create('Ext.form.field.Number', {
            fieldLabel: RS.$('ReportDesigner_Format_Scale'),
            labelWidth: 120,
            hideTrigger: true,
            minValue: 1,
            allowDecimals: false,
            value: yAxis.rendererFormat.scale,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Math.max(1, this.getValue());

                yAxis.rendererFormat.scale = value;
                yAxis.performLayout();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtUnit = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_Format_Unit'),
            labelWidth: 120,
            value: yAxis.rendererFormat.unit,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                yAxis.rendererFormat.unit = value;
                yAxis.performLayout();
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
                align:'stretch'
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

        me.categoryRotate = Ext.create('Ext.button.Segmented', {
            items: [{
                text: RS.$('ReportDesigner_CategoryRotateRotate_H'),
                value: 0
            }, {
                text: RS.$('ReportDesigner_CategoryRotateRotate_V'),
                value: -90
            }, {
                text: RS.$('ReportDesigner_CategoryRotateRotate_45'),
                value: -45
            }],
            value: Math.round((xAxis.getLabel().attr.rotationRads / Math.PI) * 180),
            listeners: {
                change: function () {
                    var value = this.getValue();

                    xAxis.setLabel({
                        rotate: {
                            degrees: value
                        }
                    });

                    xAxis.performLayout();
                }
            }
        });

        me.categoryAxis = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_CategoryAxis'),
            cls: 'yz-property-fieldset-chart',
            bodyPadding:'20 0 0 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_Label_ValueAxisText'),
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [me.categoryRotate]
            }]
        });

        me.items = [
            me.edtCaption, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_TitleAlign'),
                layout: {
                    type: 'hbox',
                    pack:'end'
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
            me.legend,
            me.innerPadding,
            me.numberAxis,
            me.categoryAxis
        ];

        me.callParent();

        me.on({
            activate: function () {
                me.categoryRotate.setValue(Math.round((xAxis.getLabel().attr.rotationRads / Math.PI) * 180));
            }
        });
    }
});