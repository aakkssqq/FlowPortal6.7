
Ext.define('YZSoft.designer.YZSoft.src.designer.component.Category', {
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
            axis = chart.getAxis('xAxis');

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

        me.segAxis = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_CategoryAxis'),
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
                fieldLabel: RS.$('ReportDesigner_Label_ValueAxisText'),
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [me.rotate]
            }]
        });

        me.items = [
            me.segAxis
        ];

        me.callParent();

        me.on({
            activate: function () {
                me.rotate.setValue(Math.round((axis.getLabel().attr.rotationRads / Math.PI) * 180));
            }
        });
    }
});