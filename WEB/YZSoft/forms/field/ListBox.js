
Ext.define('YZSoft.forms.field.ListBox', {
    extend: 'YZSoft.forms.field.ListBase',

    getValue: function () {
        var me = this,
            ctrls = me.controls,
            select = ctrls.dom.select,
            values = [];

        Ext.each(select.options, function (option) {
            if (option.selected && !Ext.isEmpty(option.value))
                values.push(option.value);
        });

        return values.join(',');
    },

    setValue: function (value) {
        var me = this,
            ctrls = me.controls,
            select = ctrls.dom.select,
            values = (value || '').split(',');

        Ext.each(select.options, function (option) {
            if (Ext.isEmpty(option.value)) {
                option.selected = false;
            }
            else {
                var matchValue = Ext.Array.findBy(values, function (value) {
                    return String.Equ(value, option.value);
                });

                if (matchValue)
                    option.selected = true;
                else
                    option.selected = false;
            }
        });
    }
});