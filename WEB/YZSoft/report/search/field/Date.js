
Ext.define('YZSoft.report.search.field.Date', {
    extend:'Ext.form.field.Date',
    mixins: ['YZSoft.report.search.field.mixin'],
    labelAlign: 'top',
    width: 160,
    labelSeparator: false,

    initComponent: function () {
        var me = this;

        me.callParent();

        if (!me.designModel && !Ext.isEmpty(me.defaultValue))
            me.setValue(me.defaultValue);
    },

    getDSFilter: function (paramName) {
        var me = this,
            value = me.getValue();

        return [{
            name: paramName,
            op: '=',
            value: value
        }];
    }
});