
Ext.define('YZSoft.designer.YZSoft.src.designer.container.chart.CartesianYFields', {
    extend: 'Ext.panel.Panel',

    constructor: function (config) {
        var me = this,
            part = config.part,
            comp = config.tag,
            series = comp.getSeries();

        config.part = comp; //自己充当part
        return Ext.create('YZSoft.designer.' + series.$className, config);
    }
});