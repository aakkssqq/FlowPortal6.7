
Ext.define('YZSoft.forms.field.Empty', {
    extend: 'YZSoft.forms.field.Element',
    valueEleSelector: '.yz-xform-field-ele-input',

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            input: me.down(me.valueEleSelector, true)
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            input: Ext.get(dom.input)
        });

        ctrls.input.on({
            scope: me,
            change: 'onChanged'
        });
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            sDataBind: me.getDataBind(),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            HiddenExpress: me.getHiddenExp()
        };
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.input.value;
    },

    setValue: function (value) {
        var me = this,
            ctrls = me.controls;

        ctrls.dom.input.value = me.regularValue(value);
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCss || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            this.addCls(disableCssCls);
        else
            this.removeCls(disableCssCls);

        ctrls.dom.input.readOnly = disable;
    },

    onChanged:function(){
    }
});