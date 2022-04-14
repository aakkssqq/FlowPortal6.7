
Ext.define('YZSoft.forms.field.CheckBox', {
    extend: 'YZSoft.forms.field.RadioCheckBoxBase',

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            isCheckBox: true
        });

        if (config.sDataBind)
            config.groupBy = Ext.copyTo({}, config, ['isCheckBox', 'sDataBind']);

        return config;
    },

    getValue: function () {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            value;

        if (et.isGrouped) {
            var xels = me.mxel.GroupEles || [],
                vs = [];

            Ext.each(xels, function (xel) {
                if (xel.isChecked()) {
                    var inputvalue = xel.controls.dom.input.value;
                    if (inputvalue)
                        vs.push(inputvalue);
                }
            });
            value = vs.join(',');
        }
        else {
            value = me.isChecked() ? 1 : 0;
        }

        return value;
    },

    setValue: function (value) {
        var me = this,
            et = me.getEleType(),
            vs = (value || '').toString().split(',');

        if (et.isGrouped) {
            var xels = me.mxel.GroupEles || [];

            Ext.each(xels, function (xel) {
                var inputvalue = xel.controls.dom.input.value;
                xel.controls.dom.input.checked = me.agent.stringArrayContains(vs, inputvalue);
            });
        }
        else {
            me.controls.dom.input.checked = !(!value || String.Equ(value, '0') || String.Equ(value, 'off') || String.Equ(value, 'false'));
        }
    }
});