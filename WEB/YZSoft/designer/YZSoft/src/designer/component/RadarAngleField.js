
Ext.define('YZSoft.designer.YZSoft.src.designer.component.RadarAngleField', {
    extend: 'YZSoft.designer.ChartAbstract',
    requires: [
        'Ext.draw.Draw'
    ],
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            chart = part.getChart(),
            series = Ext.Array.from(chart.getSeries()),
            value;

        me.cmpEmpty = Ext.create('Ext.Component', {
            style:'font-size:12px;color:#aaa;',
            html:RS.$('ReportDesigner_NoProperty')
        });

        me.segAxis = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_AngleAxis'),
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
                me.cmpEmpty
            ]
        });

        me.items = [
            me.segAxis
        ];

        me.callParent();
    }

});