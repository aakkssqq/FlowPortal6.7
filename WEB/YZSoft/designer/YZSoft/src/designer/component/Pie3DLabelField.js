
Ext.define('YZSoft.designer.YZSoft.src.designer.component.Pie3DLabelField', {
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

                //触发重绘
                Ext.Array.each([1, -1], function (v) {
                    var calloutLine = Ext.clone(label.getTemplate().getCalloutLine());
                    calloutLine.length += v;
                    label.getTemplate().setCalloutLine(calloutLine);
                    Ext.Array.each(series.getSprites(), function (sprite) {
                        sprite.setDirty(true);
                    });
                    chart.redraw();
                });
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.edtCalloutLineLength = Ext.create('Ext.slider.Single', {
            fieldLabel: RS.$('ReportDesigner_Legend_Pos'),
            labelAlign: 'top',
            value: label.getTemplate().getCalloutLine().length,
            minValue: 10,
            maxValue: 100,
            applySetting: function () {
                var value = this.getValue(),
                    calloutLine = Ext.clone(label.getTemplate().getCalloutLine());

                Ext.apply(calloutLine, {
                    length: value
                });
                label.getTemplate().setCalloutLine(calloutLine);

                //触发画面重绘
                Ext.Array.each(series.getSprites(), function (sprite) {
                    sprite.setDirty(true);
                });

                chart.redraw();
            },
            listeners: {
                change: 'applySetting',
                dragstart: me.onSliderDragStart.bind(me),
                dragend: me.onSliderDragEnd.bind(me)
            }
        });

        me.items = [{
            title: RS.$('All_Label'),
            cls: 'yz-property-fieldset-chart',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [
                me.edtFontSize,
                me.edtCalloutLineLength
            ]
        }];

        me.callParent();
    }
});