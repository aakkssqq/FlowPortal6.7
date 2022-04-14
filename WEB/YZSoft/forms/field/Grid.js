
Ext.define('YZSoft.forms.field.Grid', {
    extend: 'YZSoft.forms.field.GridBase',
    EmptyGrid: {
        KeepEmpty: 1,
        AutoAppendOneBlock: 2
    },

    constructor: function (agent, dom) {
        this.callParent(arguments);
    },

    getEleTypeConfig: function () {
        var me = this,
            config;

        config = {
            isGrid: true,
            sDynamicArea: me.getDynamicArea(),
            sDataSource: me.getDataSource(),
            sDataMap: me.getMap(),
            DisableExpress: me.getDisableExp(),
            DisableCssClass: me.getAttribute('DisableCssClass'),
            HiddenExpress: me.getHiddenExp()
        };

        if (!config.sDataSource)
            delete config.sDataMap;

        config.GridDefine = me.parseGridDefine(config.sDynamicArea);

        return config.GridDefine ? config : null;
    },

    parseGridDefine: function (dynAreaAttr) {
        var me = this;

        var dynamicArea = me.parseDynamicArea(dynAreaAttr);
        if (!dynamicArea)
            return null;

        var r = { DynamicArea: dynamicArea };
        r.GridSelectAreaWidth = 13;
        r.GridHOverDisplaySpace = /*Ext.isSafari ? 1 :*/0;

        var v = me.getAttributeLow('showoneblockalways');
        var v1 = me.getAttributeLow('deletelastrow');
        r.ShowOneBlockAlways = (v == 'true' || v1 == 'denied');

        v = me.getAttributeLow('menudock');
        r.MenuDock = v == 'left' ? me.self.MenuDock.Left : me.self.MenuDock.Right;

        v = me.getAttributeLow('emptygrid');
        r.EmptyGrid = v == 'keepempty' ? me.EmptyGrid.KeepEmpty : me.EmptyGrid.AutoAppendOneBlock;

        return r;
    },

    parseDynamicArea: function (value) {
        var me = this;

        if (!value)
            return null;

        var v = value.split(',');

        var rv = {};
        rv.startRowIndex = Number(v[0]);
        rv.rows = Number(v[1]);

        if (isNaN(rv.startRowIndex) || isNaN(rv.rows) || rv.rows == 0)
            YZSoft.Error.raise(RS.$('Form_Grid_IncorrectDynArea'), value);

        var tableRows = me.getRowCountDom();
        if (rv.startRowIndex >= tableRows)
            YZSoft.Error.raise(RS.$('Form_Grid_StartRowIndexOver'), value);

        if (rv.startRowIndex + rv.rows > tableRows)
            rv.rows = tableRows - rv.startRowIndex;

        rv.postFixRows = tableRows - (rv.startRowIndex + rv.rows);

        return rv;
    },

    onReady: function () {
        var me = this,
            ctrls = me.controls = {};

        //        Ext.apply(ctrls, {
        //            table: Ext.get(me.dom)
        //        });
    },

    setDisabled: function (disable) {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls,
            readForm = YZSoft.XForm.Agent.Params.ReadOnly,
            disableCssCls = et.DisableCssClass || me.defauleDisableCls;

        if (readForm)
            return;

        if (disable)
            me.addCls(disableCssCls);
        else
            me.removeCls(disableCssCls);
    },

    onFormFillGridDataPrepared: function (rows) {
        var me = this,
            et = me.getEleType();

        if (rows.length == 0 && et.GridDefine.EmptyGrid == me.EmptyGrid.AutoAppendOneBlock && et.GridDefine.AllowAddRecord)
            rows.push({});

        me.rows = rows;
    },

    doMap: function (rows, options) {
        var me = this,
            et = me.getEleType(),
            ups = options.ups;

        ups.splice(0, options.cidx);

        var rows = me.rows || [];
        me.setBlockCountPrivate(0);
        me.setBlockCountPrivate(rows.length);

        var cups = [];
        me.agent.genDeleteBlockUpdaters(me, cups);
        for (var i = 0; i < cups.length; i++)
            me.agent.updaterArrayAdd(ups, cups[i], true);

        cups = [];
        for (var i = 0; i < rows.length; i++)
            me.agent.genInsertBlockUpdaters(me.Blocks[i], rows[i], cups, true, i);

        for (var i = 0; i < cups.length; i++)
            ups.push(cups[i]);

        me.agent.expandUpdaters(ups);
        options.ups = me.agent.orderUpdaters(ups);
        options.cidx = 0;
    },

    saveDefaultValue: function () {
        var me = this,
            et = me.getEleType(),
            gd = et.GridDefine;

        if (!gd)
            return;

        if (!Ext.isArray(me.Blocks) || me.Blocks.length == 0)
            return;

        gd.DefaultValues = me.agent.copyBlock(me.Blocks[0], false);
    },

    isRowModified: function (blockIndex) {
        var me = this,
            et = this.getEleType();

        if (et && et.GridDefine && et.GridDefine.DefaultValues && Ext.isArray(this.Blocks) && this.Blocks.length >= 1) {
            var block = this.Blocks[blockIndex];
            if (!block.Key) {
                var vs = me.agent.copyBlock(block, false);
                return !(Ext.encode(vs) == Ext.encode(et.GridDefine.DefaultValues));
            }
        }
        return false;
    },

    onFilterChanged: function () {
        var me = this,
            et = me.getEleType(),
            ctrls = me.controls;

        me.rows = me.mapRows(me.getTable(et.DataSource).rows);
    }
});