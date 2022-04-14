
Ext.define('YZSoft.report.search.field.Number', {
    extend: 'Ext.form.field.Number',
    mixins: ['YZSoft.report.search.field.mixin'],
    labelAlign: 'top',
    width: 160,
    labelSeparator: false,
    hideTrigger: false,

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