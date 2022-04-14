
Ext.define('YZSoft.forms.field.CommentsTextBox', {
    extend: 'YZSoft.forms.field.Element',

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
        return this.dom.value;
    },

    setValue: function () {
        return this.dom.value;
    },

    setDisabled: function (disable) {
        var me = this,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        if (et.DisableBehavior == me.DisableBehavior.ReadOnly)
            me.dom.readOnly = disable;
        else
            me.dom.disabled = disable;
    }
});