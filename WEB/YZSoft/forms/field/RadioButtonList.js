
Ext.define('YZSoft.forms.field.RadioButtonList', {
    extend: 'YZSoft.forms.field.RadioCheckBoxListBase',

    getValue: function () {
        var me = this,
            ctrls = me.controls,
            value = '',
            inputs;

        inputs = me.query(me.inputElesSelector, true);
        Ext.each(inputs, function (input) {
            if (input.checked) {
                value = input.value;
                return false;
            }
        });

        return value;
    },

    setValue: function (value) {
        var me = this,
            ctrls = me.controls,
            inputs;

        inputs = me.query(me.inputElesSelector, true);
        Ext.each(inputs, function (input) {
            input.checked = String.Equ(input.value, (value === undefined ? '':value).toString());
        });
    }
});