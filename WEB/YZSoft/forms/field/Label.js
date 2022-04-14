
Ext.define('YZSoft.forms.field.Label', {
    extend: 'YZSoft.forms.field.Element',
    requires: [
        'YZSoft.forms.src.InputChecker'
    ],
    valueEleSelector: '.yz-xform-field-label',
    displayEleSelector: '.yz-xform-field-label-display',

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

    getEleTypeConfig: function () {
        var me = this;

        return {
            mapMode: 'valuefiltermap',
            sDataBind: me.getDataBind(),
            DspFormat: me.getFormat(),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp(),
            sDataSource: me.getValueToDisplayText(),
            sDataMap: me.getMap()
        };
    },

    getRawValue: function () {
        var me = this,
            ctrls = me.controls;

        if ('_value' in this) 
            return this._value;

        return ctrls.dom.input.innerHTML;//发起申请时未设置过初始值_value不存在，但控件上可能设置了初始值
    },

    setRawValue: function (value) {
        var me = this,
            ctrls = me.controls;

        this._value = value;
        ctrls.dom.input.innerHTML = me.regularValue(value, '');
    },

    setDisabled: function (disable) {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType(),
            readForm = me.agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);

        ctrls.dom.input.disabled = disable;
    },

    onFilterChanged: function () {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls;

        me.rows = me.getTable(et.DataSource).rows;

        var row = me.rows[0] || {};
        if (et && et.DataSource && et.DataSource.DisplayColumn)
            ctrls.dom.displayInput.innerHTML = row[et.DataSource.DisplayColumn] || '';
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
    }
});