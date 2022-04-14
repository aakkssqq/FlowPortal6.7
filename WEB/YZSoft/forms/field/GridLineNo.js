
Ext.define('YZSoft.forms.field.GridLineNo', {
    extend: 'YZSoft.forms.field.Element',
    valueEleSelector: '.yz-xform-field-label',

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            label: me.down(me.valueEleSelector, true)
        };
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            isGridLineNo: true,
            NoCopy: true,
            seed: me.getAttributeNumber('LineNoInitValue', 1),
            increase: me.getAttributeNumber('LineNoIncrease', 1),
            sDataBind: me.getDataBind()
        };
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.label.innerHTML;
    },

    setValue: function (value) {
        var me = this,
            ctrls = me.controls;

        ctrls.dom.label.innerHTML = me.regularValue(value, '');
    },

    getLineNo: function (blockIndex) {
        var me = this,
            et = me.getEleType();

        return et.seed + blockIndex * et.increase;
    }
});