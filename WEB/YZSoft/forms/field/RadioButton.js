
Ext.define('YZSoft.forms.field.RadioButton', {
    extend: 'YZSoft.forms.field.RadioCheckBoxBase',

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            isRadioButton: true,
            groupName: me.controls.dom.input.name
        });

        if (config.groupName)
            config.groupBy = Ext.copyTo({}, config, ['isRadioButton', 'groupName']);

        return config;
    },

    getValue: function () {
        var me = this,
            et = me.getEleType(),
            xels = [],
            value;

        if (et.isGrouped)
            xels = me.mxel.GroupEles || [];
        else
            xels = [me];

        value = '';
        Ext.each(xels, function (xel) {
            if (xel.isChecked()) {
                value = xel.controls.dom.input.value;
                return false;
            }
        });

        return value;
    },

    setValue: function (value) {
        var me = this,
            et = me.getEleType(),
            xels = [];

        if (et.isGrouped)
            xels = me.mxel.GroupEles || [];
        else
            xels = [me];

        Ext.each(xels, function (xel) {
            xel.controls.dom.input.checked = String.Equ(xel.controls.dom.input.value, value);
        });
    }
});