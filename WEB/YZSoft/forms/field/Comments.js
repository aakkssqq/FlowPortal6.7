
Ext.define('YZSoft.forms.field.Comments', {
    extend: 'YZSoft.forms.field.Element',
    inputSelector: '.yz-xform-field-ele-input',

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            input: me.down(me.inputSelector, true)
        };
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            DisableExpress: me.getDisableExp(),
            DisableBehavior: me.getAttributeLow('disablebehavior') == 'readonly' ? me.DisableBehavior.ReadOnly : me.DisableBehavior.Disable,
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp()
        };
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.input.value;
    },

    setValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.input.value;
    },

    setDisabled: function (disable) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        if (et.DisableBehavior == me.DisableBehavior.ReadOnly)
            ctrls.dom.input.readOnly = disable;
        else
            ctrls.dom.input.disabled = disable;
    }
});