
Ext.define('YZSoft.src.designer.component.PieLabelField', {
    extend: 'Ext.Component',
    cls: 'yz-cmp-report-series',

    initComponent: function () {
        var me = this;

        me.html = me.columnName;

        me.callParent();
    }
});