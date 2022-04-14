
Ext.define('YZSoft.src.form.FieldContainer', {
    extend: 'Ext.form.FieldContainer',
    disabledCls: 'yz-fieldcontainer-disabled',
    isFormField: true,
    //defaultBindProperty: 'value',
    //config: {
    //    value: null
    //},

    //initComponent: function () {
    //    var me = this;

    //    me.callParent();

    //    me.on({
    //        scope: me,
    //        change: 'publishValue',
    //    });
    //},

    //publishValue: function () {
    //    var me = this;

    //    if (me.rendered && !me.getErrors().length) {
    //        me.publishState('value', me.getValue());
    //    }
    //},

    //getErrors: function () {
    //    return [];
    //},

    isValid: function () {
        return true;
    },

    isDirty: function () {
        return true;
    },

    getModelData: function () {
        var me = this,
            data = null;

        if (me.name) {      
            data = {};
            data[me.name] = me.getValue();
        }

        return data;
    },

    getSubmitData: function () {
        return this.getModelData();
    },

    setDisabled: function (value) {
        this.callParent(arguments);

        var items = this.query('grid');
        Ext.each(items, function (item) {
            item.setDisabled(value);
        });
    }
});