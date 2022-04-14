
Ext.define('YZSoft.src.designer.component.ScatterYField', {
    extend: 'Ext.Component',
    cls: 'yz-cmp-report-series',

    initComponent: function () {
        var me = this;

        me.html = me.columnName;

        me.callParent();
    }
});