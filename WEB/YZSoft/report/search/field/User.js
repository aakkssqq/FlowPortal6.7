
Ext.define('YZSoft.report.search.field.User', {
    extend: 'YZSoft.src.form.field.User',
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
            value = Ext.String.trim(me.getValue());

        return [{
            name: paramName,
            op: '=',
            value: value
        }];
    }
});