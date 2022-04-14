
Ext.define('YZSoft.forms.field.RadioCheckBoxBase', {
    extend: 'YZSoft.forms.field.Element',
    inputEleSelector: 'input',
    labelEleSelector: 'label',

    constructor: function (agent, dom) {
        var me = this,
            input, label,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            input: me.down(me.inputEleSelector, true),
            label: me.down(me.labelEleSelector, true)
        };

        ctrls.dom.input.id = Ext.id();

        if (ctrls.dom.label)
            ctrls.dom.label.setAttribute('for', '');
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            input: Ext.get(dom.input),
            label: Ext.get(dom.label)
        });

        ctrls.input.on({
            scope: me,
            click: 'onInputClicked'
        });

        if (ctrls.label) {
            ctrls.label.on({
                scope: me,
                click: 'onLabelClicked'
            });
        }
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            sDataBind: me.getDataBind(),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp()
        };
    },

    isChecked: function () {
        return this.controls.dom.input.checked;
    },

    setDisabledItem: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm) {
            me.addCls(disableCssCls);
            return;
        }

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        ctrls.dom.input.disabled = disable;
    },

    setDisabled: function (disable) {
        var me = this,
            et = me.getEleType(),
            xels = [];

        if (et.isGrouped)
            xels = me.mxel.GroupEles || [];
        else
            xels = [me];

        Ext.each(xels, function (xel) {
            xel.setDisabledItem(disable);
        });
    },

    setVisible: function (visible) {
        if (this.getVisible() != visible) {
            var me = this,
                et = me.getEleType(),
                xels = [];

            if (et.isGrouped)
                xels = me.mxel.GroupEles || [];
            else
                xels = [me];

            Ext.each(xels, function (xel) {
                xel.internalSetVisible(visible);
            });
        }
    },

    onInputClicked: function (e) {
        var me = this;

        Ext.defer(function () {
            me.agent.fireEvent('inputChange', me);
        }, 1);
    },

    onLabelClicked: function (e) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (me.hasCls(disableCssCls))
            return;

        e.stopEvent();

        ctrls.dom.input.checked = !ctrls.dom.input.checked

        Ext.defer(function () {
            me.agent.fireEvent('inputChange', me);
        }, 1);
    }
});