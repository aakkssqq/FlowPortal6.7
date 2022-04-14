
Ext.define('YZSoft.forms.field.ListBase', {
    extend: 'YZSoft.forms.field.Element',
    selectEleSelector: '.yz-xform-field-ele-select',
    defauleDisableCls: 'yz-xform-field-disabled',
    focusCls: 'yz-xform-field-focus',
    onBeforeAddOption: Ext.emptyFn,
    onAfterAddOption: Ext.emptyFn,

    constructor: function (agent, dom) {
        var me = this,
            ctrls = me.controls = {};

        me.callParent(arguments);

        ctrls.dom = {
            select: me.down(me.selectEleSelector, true)
        };
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls,
            dom = ctrls.dom;

        Ext.apply(ctrls, {
            select: Ext.get(dom.select)
        });

        ctrls.select.on({
            scope: me,
            change: 'onSelectChanged',
            focus: 'onFocus',
            blur: 'onBlur'
        });
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            mapMode: 'filtervaluemap',
            sDataBind: me.getDataBind(),
            sDataSource: me.getDataSource(),
            DataSource: {
                PreLoad: true
            },
            displayColumn: me.getAttribute('displaycolumn') || me.getAttribute('valuecolumn'),
            valueColumn: me.getAttribute('valuecolumn') || me.getAttribute('displaycolumn'),
            sDataMap: me.getMap(),
            promptText: me.getAttribute('prompttext'),
            Express: me.getExp(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp(),
            SingleMap: true
        };
    },

    clearOptions: function () {
        this.controls.dom.select.innerHTML = '';
    },

    createOption: function (text, value) {
        var opt = document.createElement('OPTION');
        opt.text = text;
        opt.value = value;
        return opt;
    },

    addOption: function (opt) {
        var dom = this.controls.dom.select;
        Ext.isIE ? dom.add(opt) : dom.add(opt, null);
    },

    updateOptions: function () {
        var me = this,
            ctrls = me.controls,
            et = me.getEleType();

        if (!et.DataSource)
            return;

        var orgValue = me.getValue(),
            strorgValue = ((orgValue === 0) ? orgValue : (orgValue || '')).toString(),
            table = me.getTable(et.DataSource);

        if (!table)
            return;

        me.clearOptions();

        var rows = me.rows = me.agent.uniqueRows(table.rows, et.valueColumn);
        if (!et.rows && (!et.DataSource.Filter || !et.DataSource.Filter.hasVar))
            et.rows = rows;

        me.onBeforeAddOption(orgValue, rows);

        for (var i = 0; i < rows.length; i++) {
            var r = rows[i],
                v = r[et.valueColumn],
                d = r[et.displayColumn],
                strV = ((v === 0) ? v : (v || '')).toString(),
                opt;

            if (!d && d !== 0)
                d = v;

            opt = me.createOption(d, v);

            if (strV == strorgValue)
                opt.selected = true;

            me.addOption(opt);
        }

        me.onAfterAddOption(rows);
    },

    onBeforeSaveGridDefine: function () {
        var me = this,
            et = me.getEleType();

        if (et.DataSource) {
            if (!et.DataSource.Filter || !et.DataSource.Filter.hasVar)
                me.updateOptions();
        }
    },

    getValue: function () {
        var me = this,
            ctrls = me.controls;

        return ctrls.dom.select.value;
    },

    setValue: function (value) {
        var me = this,
            ctrls = me.controls,
            value = me.regularValue(value);

        ctrls.dom.select.value = value;

        if (!Ext.isEmpty(value) && Ext.isEmpty(ctrls.dom.select.value) ) {
            var opt = me.createOption(value, value);
            me.addOption(opt);
            ctrls.dom.select.value = me.regularValue(value);
        }
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

        ctrls.dom.select.disabled = disable;
    },

    onFilterChanged: function () {
        var me = this,
            et = me.getEleType();

        me.updateOptions();
    },

    doMap: function () {
        var me = this,
            et = me.getEleType(),
            rows = (et.DataSource && (!et.DataSource.Filter || !et.DataSource.Filter.hasVar) ? et.rows : me.rows) || [],
            ctrls = me.controls,
            dom = ctrls.dom.select;

        row = (rows ? rows[dom.selectedIndex] : Ext.decode(dom[dom.selectedIndex].getAttribute('mapvalues'))) || {};

        if (et && et.DataMap)
            me.doMapSingline(row, et.DataMap.kvs);
    },

    onSelectChanged: function () {
        this.agent.fireEvent('inputChange', this);
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

            me.agent.fireEvent('inputChange', me); //输入框按键不释放，移走光标或用鼠标操作Paste
        }
    }
});