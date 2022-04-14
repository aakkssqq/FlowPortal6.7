
Ext.define('YZSoft.forms.field.RadioCheckBoxListBase', {
    extend: 'YZSoft.forms.field.Element',
    inputElesSelector: '.yz-xform-field-repeater-item-wrap input',
    labelElesSelector: '.yz-xform-field-repeater-item-wrap label',
    inputEleSelector: 'input',

    constructor: function (agent, dom) {
        var me = this,
            labels;

        me.callParent(arguments);

        labels = me.query(me.labelElesSelector, true);
        Ext.each(labels, function (label) {
            label.setAttribute('for', '');
        });
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls = me.controls || {};

        me.dom.setAttribute("orgid",me.dom.id);
        me.dom.id = Ext.id();
        Ext.apply(ctrls, {
            cnt: Ext.get(me.dom)
        });

        ctrls.cnt.on({
            scope: me,
            click: 'onClick'
        });
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

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls,
            inputs;

        if (readForm) {
            me.addCls(disableCssCls);
            return;
        }

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        inputs = me.query(me.inputElesSelector, true);

        Ext.each(inputs, function (input) {
            input.disabled = disable;
        });
    },

    onClick: function (e) {
        var me = this,
            input = e.getTarget('input', me.dom, false),
            label = e.getTarget('label', me.dom, false);

        if (input) {
            me.onInputClicked(e, input);
        }

        if (label) {
            me.onLabelClicked(e, label);
        }
    },

    onInputClicked: function (e, input) {
        var me = this;

        Ext.defer(function () {
            me.agent.fireEvent('inputChange', me);
        }, 1);
    },

    onLabelClicked: function (e, label) {
        var me = this,
            et = me.getEleType(),
            disableCssCls = et.DisableCssClass || me.defauleDisableCls,
            domInput = Ext.fly(label).prev(me.inputEleSelector, true) || Ext.fly(label).next(me.inputEleSelector, true);

        if (me.hasCls(disableCssCls))
            return;

        if (domInput.disabled)
            return;

        e.stopEvent();

        domInput.checked = !domInput.checked

        Ext.defer(function () {
            me.agent.fireEvent('inputChange', me);
        }, 1);
    }
});