
Ext.define('YZSoft.designer.YZSoft.src.designer.component.Series', {
    extend: 'YZSoft.designer.ChartAbstract',

    constructor: function (config) {
        var me = this,
            part = config.part,
            series = part.getSeries();

        return Ext.create('YZSoft.designer.' + series.$className, config);
    }
});