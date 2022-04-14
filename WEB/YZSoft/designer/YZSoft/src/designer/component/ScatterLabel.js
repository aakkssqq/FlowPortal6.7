
Ext.define('YZSoft.designer.YZSoft.src.designer.component.ScatterLabel', {
    extend: 'YZSoft.designer.ChartAbstract',
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
            label = series.getLabel();

        me.edtFontSize = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('Designer_FontSize'),
            labelAlign: 'top',
            margin: '10 0 7 0',
            value: parseFloat(label.getTemplate().attr.fontSize),
            minValue: 10,
            maxValue: 30,
            applySetting: function () {
                var value = this.getValue();

                label.getTemplate().setAttributes({
                    fontSize: value + 'px'
                });

                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.edtTranslateY = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_Legend_Pos'),
            labelAlign: 'top',
            value: label.getTemplate().translateY,
            minValue: -10,
            maxValue: 10,
            applySetting: function () {
                var value = this.getValue();

                label.getTemplate().translateY = value;
                label.getTemplate().setAttributes({
                    translateY: value
                });

                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.chkAutoColor = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_AutoColor'),
            value: !style.strokeStyle,
            listeners: {
                change: function (field, checked) {
                    if (checked) {
                        delete series._style.strokeStyle;
                        delete series._style.fillStyle;

                        series.setStyle({
                        });

                        chart.refreshLegendStore();
                        chart.redraw();
                    }
                    else {
                        var color = me.colorPicker.color;

                        series.setStyle({
                            strokeStyle: color,
                            fillStyle: color
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
                        strokeStyle: color,
                        fillStyle: color
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

        me.items = [{
            title: RS.$('All_Label'),
            cls: 'yz-property-fieldset-chart',
            bodyPadding: '6 0 6 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 0 0'
            },
            items: [
                me.edtFontSize,
                me.edtTranslateY
            ]
        }, me.segColor];

        me.callParent();
    }
});