
Ext.define('YZSoft.designer.ChartAbstract', {
    extend: 'Ext.panel.Panel',

    onSliderDragStart: function () {
        var me = this,
            part = me.part,
            chart = part.getChart();

        chart.suspendAnimation();
    },

    onSliderDragEnd: function () {
        var me = this,
            part = me.part,
            chart = part.getChart();

        chart.resumeAnimation();
    },

    onInnerPaddingChanged: function () {
        var me = this,
            chart = me.tag;

        chart.setInnerPadding({
            top: me.innerPaddingTop.getValue(),
            bottom: me.innerPaddingBottom.getValue(),
            left: me.innerPaddingLeft.getValue(),
            right: me.innerPaddingRight.getValue()
        });

        chart.performLayout();
        chart.redraw();
    }
});