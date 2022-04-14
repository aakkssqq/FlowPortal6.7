
Ext.define('YZSoft.forms.field.TextBox', {
    extend: 'YZSoft.forms.field.Element',
    requires: [
        'YZSoft.forms.src.InputChecker'
    ],
    valueEleSelector: '.yz-xform-field-ele-input',
    displayEleSelector: '.yz-xform-field-ele-input-display',
    focusCls: 'yz-xform-field-focus',
    supportSpoor: true,

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            input: me.down(me.valueEleSelector, true),
            displayInput: me.down(me.displayEleSelector, true)
        };

        ctrls.dom.displayInput = ctrls.dom.displayInput || ctrls.dom.input;
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
            keyup: 'onKeyUp',
            keypress: 'onKeyPress',
            focus: 'onFocus',
            blur: 'onBlur'
        });
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            mapMode: 'valuefiltermap',
            sDataBind: me.getDataBind(),
            DspFormat: me.getFormat(),
            Express: me.getExp(),
            sDataSource: me.getValueToDisplayText() || me.getDataSource(),
            sDataMap: me.getMap(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            DisableBehavior: me.getAttributeLow('disablebehavior') == 'readonly' ? me.DisableBehavior.ReadOnly : me.DisableBehavior.Disable,
            HiddenExpress: me.getHiddenExp()
        };
    },

    getRawValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.input.value;
    },

    setRawValue: function (value) {
        var me = this,
            ctrls = me.controls;

        ctrls.dom.input.value = me.regularValue(value);
    },

    setMaxLength: function (len) {
        var me = this,
            ctrls = me.controls;

        ctrls.dom.input.maxLength = len;
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || (et.DisableBehavior == me.DisableBehavior.ReadOnly ? me.defauleReadonlyCls : me.defauleDisableCls);

        if (readForm)
            return;

        if(me.defauleReadonlyCls != disableCssCls)
            me.removeCls(me.defauleReadonlyCls);

        if (me.defauleDisableCls != disableCssCls)
            me.removeCls(me.defauleDisableCls);

        if (disable) {
            if (!me.hasCls(disableCssCls))
                me.addCls(disableCssCls);
        }
        else {
            me.removeCls(disableCssCls);
        }

        if (et.DisableBehavior == me.DisableBehavior.ReadOnly) {
            ctrls.dom.displayInput.disabled = false;
            ctrls.dom.displayInput.readOnly = disable;
        }
        else {
            ctrls.dom.displayInput.readOnly = false;
            ctrls.dom.displayInput.disabled = disable;
        }
    },

    onFilterChanged: function () {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls;

        me.rows = me.getTable(et.DataSource,true).rows;

        var row = me.rows[0] || {};
        if (et && et.DataSource && et.DataSource.DisplayColumn)
            ctrls.dom.displayInput.value = row[et.DataSource.DisplayColumn] || '';
    },

    doMap: function () {
        var me = this,
            rows = me.rows || [],
            row = rows[0] || {},
            et = me.getEleType();

        if (et && et.DataMap)
            me.doMapSingline(row, et.DataMap.kvs);
    },

    createInputChecker: function (et) {
        return new YZSoft.forms.src.InputChecker(et, this.valueEleSelector);
    },

    selectInput: function () {
        this.controls.dom.input.focus();
    },

    onKeyUp: function (e) {
        this.agent.fireEvent('inputChange', this);
    },

    onKeyPress: function (e) {
        var me = this,
            et = me.getEleType();

        if (!et || !et.inputChecker)
            return;

        if (!et.inputChecker.parseInput(me, e)) {
            try { e.stopEvent(); } catch (exp) { }
        }
    },

    onFocus: function (e) {
        var me = this,
            et = this.getEleType();

        me.addCls(me.focusCls)

        if (et && et.inputChecker) {
            var chk = et.inputChecker,
                rv = me.getRawValue(),
                v = chk.removeFormat(rv);

            if (v !== rv)
                me.setRawValue(v);
        }
    },

    onBlur: function (e) {
        var me = this,
            et = this.getEleType();

        me.removeCls(me.focusCls)

        if (et && et.inputChecker) {
            var chk = et.inputChecker,
                rv = me.getRawValue(),
                v = chk.getFormattedValue(rv);

            if (v !== rv)
                me.setRawValue(v);

            me.agent.fireEvent('inputChange', me);     //输入框按键不释放，移走光标或用鼠标操作Paste
        }
    }
});