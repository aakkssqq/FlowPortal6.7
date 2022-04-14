
Ext.define('YZSoft.designer.YZSoft.src.designer.component.ScatterYField', {
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
            axis = chart.getAxis('yAxis'),
            series = part.getSeries();

        me.edtTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_YAxisTitle'),
            value: axis.getTitle().attr.text,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                axis.getTitle().setAttributes({
                    text: value
                });
                series.updateYAxis(axis);
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

        me.items = [
            me.edtTitle,
            me.axis
        ];

        me.callParent();
    }
});