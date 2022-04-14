
Ext.define('YZSoft.designer.YZSoft.src.designer.component.PieAngleField', {
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
            series = part.getSeries();

        me.edtTitle = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_ValueName'),
            enableKeyEvents: true,
            value: series.getTitle() || series.getAngleField(),
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                series.setTitle(value);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.chkThousands = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('ReportDesigner_Format_Thousands'),
            value: chart.rendererFormat.thousands,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    chart.rendererFormat.thousands = value;
                }
            }
        });

        me.edtScale = Ext.create('Ext.form.field.Number', {
            fieldLabel: RS.$('ReportDesigner_Format_Scale'),
            labelWidth: 120,
            hideTrigger: true,
            minValue: 1,
            allowDecimals: false,
            value: chart.rendererFormat.scale,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Math.max(1, this.getValue());

                chart.rendererFormat.scale = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.edtUnit = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ReportDesigner_Format_Unit'),
            labelWidth: 120,
            value: chart.rendererFormat.unit,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                chart.rendererFormat.unit = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.angleField = Ext.create('Ext.panel.Panel', {
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
            me.angleField
        ];

        me.callParent();
    }
});