
Ext.define('YZSoft.designer.YZSoft.src.designer.component.ScatterXField', {
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
            axis = chart.getAxis('xAxis'),
            series = part.getSeries();

        me.edtTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_XAxisTitle'),
            enableKeyEvents: true,
            value: axis.getTitle().attr.text,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                axis.getTitle().setAttributes({
                    text: value
                });
                series.updateXAxis(axis);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.chkThousands = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_Format_Thousands'),
            value: axis.rendererFormat.thousands,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    axis.rendererFormat.thousands = value;
                    axis.performLayout();
                }
            }
        });

        me.edtScale = Ext.create('Ext.form.field.Number', {
            fieldLabel: RS.$('ReportDesigner_Format_Scale'),
            labelWidth: 120,
            hideTrigger: true,
            minValue: 1,
            allowDecimals: false,
            value: axis.rendererFormat.scale,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Math.max(1, this.getValue());

                axis.rendererFormat.scale = value;
                axis.performLayout();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtUnit = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_Format_Unit'),
            labelWidth: 120,
            value: axis.rendererFormat.unit,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                axis.rendererFormat.unit = value;
                axis.performLayout();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.axis = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Seg_ValueFormat'),
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

        me.rotate = Ext.create('Ext.button.Segmented', {
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
            value: Math.round((axis.getLabel().attr.rotationRads / Math.PI) * 180),
            listeners: {
                change: function () {
                    var value = this.getValue();

                    axis.setLabel({
                        rotate: {
                            degrees: value
                        }
                    });

                    axis.performLayout();
                }
            }
        });

        me.segRotate = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_AxisText'),
            cls: 'yz-property-fieldset-chart',
            bodyPadding: '20 0 0 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_Rotate'),
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [me.rotate]
            }]
        });

        me.items = [
            me.edtTitle,
            me.axis,
            me.segRotate
        ];

        me.callParent();

        me.on({
            activate: function () {
                me.rotate.setValue(Math.round((axis.getLabel().attr.rotationRads / Math.PI) * 180));
            }
        });
    }
});