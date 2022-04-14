
Ext.define('YZSoft.designer.YZSoft.report.chart.ScatterChart', {
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

        me.innerPaddingTop = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('All_Top'),
            value: chart.getInnerPadding().top,
            minValue: 0,
            maxValue: 50,
            listeners: {
                scope: me,
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
            bodyPadding: '16 0 0 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
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
            title: RS.$('ReportDesigner_xAxis'),
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
            me.innerPadding,
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