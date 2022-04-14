
Ext.define('YZSoft.src.designer.component.RadarAngleField', {
    extend: 'Ext.Component',
    cls: 'yz-cmp-report-series',

    initComponent: function () {
        var me = this;

        me.html = me.columnName;

        me.callParent();
    }
});