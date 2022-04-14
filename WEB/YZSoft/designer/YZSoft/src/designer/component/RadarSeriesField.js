
Ext.define('YZSoft.designer.YZSoft.src.designer.component.RadarSeriesField', {
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
            templateName = chart.getSeriesTemplateName(),
            series = part.getSeries(),
            style = series.getStyle(),
            value;

        me.edtTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_SeriesName'),
            value: series.getTitle(),
            enableKeyEvents: true,
            applySetting: function () {
                var series = part.getSeries(),
                    value = Ext.String.trim(this.getValue());

                series.setTitle(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.chkAutoColor = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_AutoColor'),
            value: !(templateName == 'fill' ? style.fillStyle : style.strokeStyle),
            listeners: {
                change: function (field, checked) {
                    var series = part.getSeries(),
                        templateName = chart.getSeriesTemplateName();

                    if (checked) {
                        if (templateName == 'fill') {
                            delete series._style.fillStyle;
                            series.setStyle({
                            });

                        }
                        else {
                            delete series._style.strokeStyle;

                            series.setStyle({
                            });
                        }

                        chart.refreshLegendStore();
                        chart.redraw();
                    }
                    else {
                        var color = me.colorPicker.color;

                        if (templateName == 'fill') {
                            series.setStyle({
                                fillStyle: color
                            });
                        }
                        else {
                            series.setStyle({
                                strokeStyle: color
                            });
                        }

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
                    var series = part.getSeries(),
                        templateName = chart.getSeriesTemplateName();

                    me.chkAutoColor.suspendEvent('change');
                    me.chkAutoColor.setValue(false);
                    me.chkAutoColor.resumeEvent('change');

                    if (templateName == 'fill') {
                        series.setStyle({
                            fillStyle: color,
                            strokeStyle: 'none'
                        });
                    }
                    else {
                        series.setStyle({
                            strokeStyle: color,
                            fillStyle:'none'
                        });
                    }

                    chart.refreshLegendStore();
                    chart.redraw();
                }
            }
        });
        me.colorPicker.setColor(series.getSprites()[0].attr[templateName == 'fill' ? 'fillStyle':'strokeStyle']);

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

        me.items = [
            me.edtTitle,
            me.segColor
        ];

        me.callParent();
    }
});