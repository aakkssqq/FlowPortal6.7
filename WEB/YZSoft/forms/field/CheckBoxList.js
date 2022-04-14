
Ext.define('YZSoft.forms.field.CheckBoxList', {
    extend: 'YZSoft.forms.field.RadioCheckBoxListBase',

    getValue: function () {
        var me = this,
            ctrls = me.controls,
            vs = [],
            inputs;

        inputs = me.query(me.inputElesSelector, true);
        Ext.each(inputs, function (input) {
            if (input.checked) {
                if (input.value)
                    vs.push(input.value);
            }
        });

        return vs.join(',');
    },

    setValue: function (value) {
        var me = this,
            ctrls = me.controls,
            vs = (value || '').toString().split(','),
            inputs;

        inputs = me.query(me.inputElesSelector, true);

        Ext.each(inputs, function (input) {
            input.checked = me.agent.stringArrayContains(vs, input.value);
        });
    }
});