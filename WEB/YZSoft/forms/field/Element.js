
Ext.define('YZSoft.forms.field.Element', {
    extend: 'Ext.dom.Element',
    disableOverlayCls: 'yz-form-field-mask-overlay',
    defauleDisableCls: 'yz-xform-field-disabled',
    defauleReadonlyCls: 'yz-xform-field-readonly',
    errCls: 'yz-xform-field-validation-error',
    isElement: true,
    spnoorTextMaxLength: 200,
    DisableBehavior: {
        ReadOnly: 1,
        Disable: 2
    },
    AppendModel: {
        Append: 1,
        ClearAndAppend: 2,
        RemoveEmptyRow: 3
    },
    onReady: Ext.emptyFn,
    onFilterChanged: Ext.emptyFn,
    onBeforeSaveGridDefine: Ext.emptyFn,

    constructor: function (agent, dom) {
        var me = this;

        me.agent = agent;
        me.dom = dom;
        me.el = me;
        me.id = me.self.idSeed;
        me.self.idSeed++;
        me.mixins.observable.constructor.call(me);
    },

    getEleTypeConfig: function () {
        var me = this;

        return {
            HiddenExpress: me.getHiddenExp()
        };
    },

    inheritableStatics: {
        idSeed: 1,

        getXClass: function (dom) {
            var xclass = dom.getAttribute('xclass');
            if (!xclass) {
                var ltag = dom.tagName.toLowerCase();
                if (ltag == 'table') {
                    var dynamicArea = dom.getAttribute('dynamicarea');
                    if (dynamicArea)
                        xclass = 'YZSoft.forms.field.Grid'
                }
            }

            if (!xclass) {
                var hiddenexpress = dom.getAttribute('hiddenexpress');
                if (hiddenexpress)
                    xclass = 'YZSoft.forms.field.Element'
            }

            return xclass;
        },

        hasEleType: function (dom) {
            return dom.getAttribute('xform_eletype_index') ? true : false;
        },

        createElement: function (agent, element) {
            var xclass = this.getXClass(element);
            return xclass ? Ext.create(xclass, agent, element) : null;
        },

        getAttributeNumber: function (dom, name, def) {
            def = Ext.isDefined(def) ? def : -1;
            var attr = dom.getAttribute(name);
            var rv = Number(Ext.isEmpty(attr) ? def : attr);
            return isNaN(rv) ? def : rv;
        },

        outerHTML: function (node) {
            if (!node)
                return null;

            var html = node.outerHTML;
            if (!html) {
                var div = document.createElement('div');
                div.appendChild(node.cloneNode(true));
                html = div.innerHTML;
                div = null;
            }
            return html;
        }
    },

    parseBool: function (v, defaultValue) {
        defaultValue = defaultValue === true;

        if (v === null || v === undefined || v === '')
            return defaultValue;

        if (v === false || v === 0 || v === '0')
            return false;

        v = v.toLowerCase();
        if (v === 'false')
            return false;

        return true;
    },

    getAttribute: function (name) {
        return this.dom.getAttribute(name);
    },

    setAttribute: function (name, value) {
        return this.dom.setAttribute(name, value);
    },

    getAttributeLow: function (name) {
        var rv = this.getAttribute(name);
        if (rv)
            rv = rv.toLowerCase();
        return rv;
    },

    getAttributeNumber: function (name, def) {
        def = Ext.isDefined(def) ? def : -1;
        var attr = this.getAttribute(name);
        var rv = Number(Ext.isEmpty(attr) ? def : attr);
        return isNaN(rv) ? def : rv;
    },

    getAttributeBool: function (name, defaultValue) {
        return this.parseBool(this.getAttribute(name), defaultValue);
    },

    getEleTypeIndex: function () {
        return this.getAttributeNumber('xform_eletype_index');
    },

    setEleTypeIndex: function (index) {
        return this.setAttribute('xform_eletype_index', index);
    },

    getXEleIndex: function (force) {
        if (force || !Ext.isDefined(this.xelIndex))
            this.xelIndex = this.getAttributeNumber('xform_xele_index');
        return this.xelIndex;
    },

    setXEleIndex: function (index) {
        this.xelIndex = index;
        this.setAttribute('xform_xele_index', index);
    },

    getDynamicArea: function () {
        return this.getAttribute('dynamicarea');
    },

    getDataSource: function () {
        return this.getAttribute('xdatasource');
    },

    getDataBind: function () {
        return this.getAttribute('xdatabind');
    },

    getExp: function () {
        return this.getAttribute('express');
    },

    getDisableExp: function () {
        return this.getAttribute('disableexpress');
    },

    getHiddenExp: function () {
        return this.getAttribute('hiddenexpress');
    },

    getMap: function () {
        return this.getAttribute('datamap');
    },

    getTypeLow: function () {
        return this.getAttributeLow('type');
    },

    getName: function () {
        return this.dom.name;
    },

    getXTypeLow: function () {
        return this.getAttributeLow('xtype');
    },

    getMultiSelect: function () {
        var v = this.getAttributeLow('multiselect');
        return String.Equ(v, 'true');
    },

    getAppendModelLow: function () {
        return this.getAttributeLow('appendmode');
    },

    getValueToDisplayText: function () {
        return this.getAttribute('valuetodisplaytext');
    },

    getLen: function () {
        return this.getAttributeNumber('len', -1);
    },

    getFormat: function () {
        return this.getAttribute('format');
    },

    getElDesc: function () {
        var desc = this.dom.id || this.dom.name;
        if (!desc) {
            desc = this.outerHTML();
            if (desc.length >= 300) {
                desc = desc.substring(0, 297) + '...';
            }
        }
        return desc;
    },

    getEleType: function () {
        var me = this;

        if (!me.elType) {
            var index = this.getEleTypeIndex();
            me.elType = index == -1 ? null : me.agent.EleTypes[index];
        }

        return me.elType;
    },

    getNextSibling: function () {
        return new YZSoft.forms.field.Element(this.agent, this.dom.nextSibling);
    },

    parseDSName: function (str) {
        return String.Equ(str, 'default') ? '' : str ? str : '';
    },

    parseFilter: function (str) {
        var me = this;

        if (!str)
            return null;

        var u = YZSoft.HttpUtility;
        var rv = { kvs: [], vars: [] };
        var segs = str.split(',') || [];
        Ext.each(segs, function (seg) {
            var kv = u.parseKeyValue(seg, '->');
            kv.key = u.attrDecode(kv.key);

            var v = u.attrDecode(kv.value) || '',
                vseg = v.split('|') || [];

            kv.value = vseg[0];
            kv.op = vseg[1] || '=';
            if (kv.key) {
                if (YZSoft.Utility.isConstant(kv.value)) {
                    kv.isConstant = true;
                    kv.value = YZSoft.Utility.getConstantValue(kv.value);
                    rv.kvs.push(kv);
                }
                else if (Ext.String.startsWith(kv.value, '@@', true)) {
                    kv.isConstant = true;
                    kv.isAfterBind = true;
                    kv.value = kv.value;
                    rv.kvs.push(kv);
                }
                else {
                    rv.hasVar = true;
                    kv.vr = me.agent.getVar(this, kv.value);
                    rv.kvs.push(kv);
                    rv.vars.push(kv.vr);
                }
            }
        }, this);
        return rv.kvs.length == 0 ? null : rv;
    },

    parseMap: function (str, elType) {
        var me = this;

        elType = elType || {};

        if (!str)
            return null;

        var u = YZSoft.HttpUtility;
        var rv = { kvs: [], vars: [] };
        var segs = str.split(';') || [];
        Ext.each(segs, function (seg) {
            var kv = u.parseKeyValue(seg, '->');
            kv.key = u.attrDecode(kv.key);
            kv.value = u.attrDecode(kv.value);
            if (kv.key) {
                kv.vr = me.agent.getVar(this, kv.value);
                rv.kvs.push(kv);
                rv.vars.push(kv.vr);
            }
        }, this);

        rv = rv.kvs.length == 0 ? null : rv;

        if (rv != null) {
            rv.columnNames = [];
            Ext.each(rv.kvs, function (item) {
                rv.columnNames.push(item.key);
            });
        }
        return rv;
    },

    parseDataSource: function (value, elType, defaults) {
        if (!value)
            return null;

        var me = this,
            u = YZSoft.HttpUtility,
            dc = u.attrDecode,
            ds;

        ds = {
            DataSource: '',
            DSType: YZSoft.XForm.DSType.Table,
            Filter: null,
            OrderBy: null,
            PreventCache: false
        };

        var segs = value.split(';') || [];
        for (var i = 0; i < segs.length; i++) {
            var seg = segs[i];
            var kv = u.parseKeyValue(seg, ':', true);
            switch (kv.key) {
                case 'datasource':
                    ds.DataSource = this.parseDSName(dc(kv.value));
                    break;
                case 'tablename':
                    ds.TableName = dc(kv.value);
                    ds.ID = ds.TableName;
                    ds.DSType = YZSoft.XForm.DSType.Table;
                    break;
                case 'procedurename':
                    ds.ProcedureName = dc(kv.value);
                    ds.ID = ds.ProcedureName;
                    ds.DSType = YZSoft.XForm.DSType.Procedure;
                    break;
                case 'esb':
                    ds.ESB = dc(kv.value);
                    ds.ID = ds.ESB;
                    ds.DSType = YZSoft.XForm.DSType.ESB;
                    break;
                case 'filter':
                    ds.Filter = me.parseFilter(dc(kv.value));
                    break;
                case 'filtercolumn':
                    ds.FilterColumn = dc(kv.value);
                    break;
                case 'displaycolumn':
                    ds.DisplayColumn = dc(kv.value);
                    break;
                case 'orderby':
                    ds.OrderBy = dc(kv.value);
                    break;
                case 'preventcache':
                    ds.PreventCache = me.parseBool(dc(kv.value), false);
                    break;
            }
        }

        if (ds.FilterColumn) {
            ds.Filter = ds.Filter || { kvs: [], vars: [] };
            elType.sDataBind = elType.sDataBind || me.agent.newDataBind();
            var kv = { key: ds.FilterColumn, value: elType.sDataBind, vr: me.agent.getVar(this, elType.sDataBind) };
            ds.Filter.kvs.push(kv);
            ds.Filter.vars.push(kv.vr);
        }

        if (!elType.forceFilter) {
            if ((ds.DSType == YZSoft.XForm.DSType.Table && !ds.TableName) ||
                (ds.DSType == YZSoft.XForm.DSType.Procedure && !ds.ProcedureName) ||
                (ds.DSType == YZSoft.XForm.DSType.ESB && !ds.ESB))
                return null;
        }

        Ext.apply(ds, defaults);

        ds.identity = Ext.copyTo({}, ds, ['DSType', 'DataSource', 'TableName', 'ProcedureName', 'ESB', 'OrderBy'])
        return ds;
    },

    expandUpdater: function (ups, upidxs, up) {
        var me = this,
            elType = this.getEleType();

        if (!elType || !elType.affectTo)
            return;

        var afts = elType.affectTo[up.tag] || [];
        for (var j = 0; j < afts.length; j++) {
            var aft = afts[j];
            var cels = this.getElesFromPath(aft.path);
            for (var k = 0; k < cels.length; k++) {
                var cel = cels[k];
                if (me.agent.updaterArrayAddExt(ups, upidxs, { xel: cel, tag: aft.tag, src: aft.src }).NewTag)
                    cel.expandUpdater(ups, upidxs, up);
            }
        }
    },

    getElesFromPath: function (path, startIndex) {
        var me = this,
            ns = [me.ParentBlock];

        startIndex = startIndex || 0;

        for (var i = startIndex; i < path.length; i++) {
            var idx = path[i];
            if (idx == '.') {
                ns[0] = ns[0].ParentElement.ParentBlock;
            }
            else {
                var newns = [];
                var c1 = ns.length;
                for (var j = 0; j < c1; j++) {
                    var n = ns[j];
                    if (n.NodeType == YZSoft.XForm.NodeType.Block)
                        newns.push(n.Eles[idx]);
                    else {
                        var bs = n.Blocks, c2 = bs.length;
                        for (var k = 0; k < c2; k++)
                            newns.push(bs[k].Eles[idx])
                    }
                }
                ns = newns;
            }
        }
        return ns;
    },

    regularValue: function (v, defaultValue) {
        var tpv = typeof v;

        defaultValue = defaultValue === undefined ? '' : defaultValue;
        return (v === undefined || v === null || (tpv === 'number' && isNaN(v))) ? defaultValue : v;
    },

    getValue: function () {
        var me = this,
            v = me.getRawValue(),
            et = me.getEleType();

        if (et && et.inputChecker)
            v = et.inputChecker.removeFormat(v);

        return v;
    },

    setValue: function (value) {
        var me = this,
            et = me.getEleType();

        if (et && et.inputChecker)
            value = et.inputChecker.getFormattedValue(value);

        me.setRawValue(value);
    },

    setVisible: function (visible) {
        if (this.getVisible() != visible)
            this.internalSetVisible(visible);
    },

    getVisible: function () {
        var s = this.dom.style;
        var d = (s.display || '').toLowerCase();
        var v = (s.visibility || '').toLowerCase();
        return d != 'none' && v != 'hidden';
    },

    internalSetVisible: function (visible) {
        this.dom.style.display = visible ? '' : 'none';
    },

    setDisabled: function (v) {
        v = v !== false;

        var me = this,
            tps = YZSoft.XForm.EleTypes,
            et = me.getEleType();

        var xels
        if (et.IsGroup)
            xels = this.mxel.GroupEles || [];
        else
            xels = [this];

        for (var i = 0; i < xels.length; i++) {
            var xel = xels[i];

            //验证组永远不要disable,否则对于明细表的内容，当第一行将验证disable后，后面的行都得不到验证
            if (et.Type == tps.Span || et.Type == tps.Label)
                return;

            var rdel = (et.Type == tps.TextBox && et.sDataSource) ? xel.dom.nextSibling : xel.dom;
            if (!me.agent.Params.ReadOnly) {
                var css = Ext.String.trim((v ? et.DisableCss : et.NormalCss) || '');
                css = css || et.NormalCss || xel.dom.className;
                rdel.className = css;
            }

            switch (et.Type) {
                case tps.TextBox:
                case tps.TextArea:
                    if (xel.GetDisableBehavior() == me.DisableBehavior.ReadOnly)
                        rdel.readOnly = v;
                    else
                        rdel.disabled = v;
                    break;
                case tps.Select:
                    rdel.disabled = v;
                    break;
                default:
                    rdel.disabled = v;
                    break;
            }
        }
    },

    calcExpress: function (exp) {
        var me = this,
            p = exp.parser,
            v = {};

        for (var i = 0; i < exp.vars.length; i++) {
            var vr = exp.vars[i];
            if (vr.def.memvar) {
                v[vr.def.name] = vr.def.value;
            }
            else {
                var xels = me.getElesFromPath(vr.path) || [];
                if (xels.length == 1) {
                    v[vr.def.name] = me.agent.convertValue(xels[0].getValue(), vr.def);
                }
                else {
                    var vs = v[vr.def.name] = []
                    for (var j = 0; j < xels.length; j++) {
                        vs.push(me.agent.convertValue(xels[j].getValue(), vr.def));
                    }
                }
            }
        }

        var rv = p.evaluate(v, me, me.dom);
        return rv;
    },

    doMapSingline: function (r, kvs) {
        if (!kvs)
            return;

        this.row = r;
        this.mapedrow = (this.mapRows([r], kvs) || [])[0];

        for (var i = 0; i < kvs.length; i++) {
            var kv = kvs[i];
            var xels = this.getElesFromPath(kv.vr.path) || [];

            for (var j = 0; j < xels.length; j++)
                xels[j].setValue(r[kv.key]);
        }
    },

    doMapMultiLine: function (rows, kvs, appendModel, options) {
        var me = this,
            et = me.getEleType(),
            ups = options.ups;

        ups.splice(0, options.cidx);

        rows = rows || [];
        rows = me.mapRows(rows, kvs);

        var gpaths = et.MaptoGrids || [];
        for (var i = 0; i < gpaths.length; i++) {
            var grids = me.getElesFromPath(gpaths[i].path) || [];

            for (var j = 0; j < grids.length; j++) {
                var grid = grids[j];

                var sbi = 0;
                if (appendModel == me.AppendModel.Append) {
                    sbi = grid.Blocks.length;
                    grid.setBlockCountPrivate(grid.Blocks.length + rows.length);
                }
                else if (appendModel == me.AppendModel.ClearAndAppend) {
                    sbi = 0;
                    grid.setBlockCountPrivate(0);
                    grid.setBlockCountPrivate(rows.length);
                }
                else {
                    if (grid.Blocks.length == 1 && !grid.Blocks[0].Key && !grid.isRowModified(0)) {
                        sbi = 0;
                        grid.setBlockCountPrivate(0);
                        grid.setBlockCountPrivate(rows.length);
                    }
                    else {
                        sbi = grid.Blocks.length;
                        grid.setBlockCountPrivate(grid.Blocks.length + rows.length);
                    }
                }

                var cups = [];
                me.agent.genLineNoUpdaters(grid, sbi, cups);
                me.agent.genDeleteBlockUpdaters(grid, cups);
                for (var k = 0; k < rows.length; k++)
                    me.agent.genInsertBlockUpdaters(grid.Blocks[sbi + k], rows[k], cups);

                for (var k = 0; k < cups.length; k++)
                    me.agent.updaterArrayAdd(ups, cups[k], true);
            }
        }

        me.agent.expandUpdaters(ups);
        options.ups = me.agent.orderUpdaters(ups);
        options.cidx = 0;
    },

    mapRows: function (rows, kvs) {
        kvs = kvs || (this.getEleType().DataMap || { kvs: [] }).kvs;
        var rvs = [];
        for (var i = 0; i < rows.length; i++) {
            var rr = {};
            rvs.push(rr);
            var r = rows[i];
            for (var j = 0; j < kvs.length; j++) {
                var kv = kvs[j];
                rr[(kv.value || '').toLowerCase()] = r[kv.key];
            }
        }
        return rvs;
    },

    getTable: function (ds) {
        var me = this,
            filter = me.getCurrentFilters();

        if (!ds.PreventCache) {
            var tbs = me.agent.arrayFilter(me.agent.AssistTables, { DSType: ds.DSType, DataSource: ds.DataSource, ID: ds.ID }) || [];
            for (var i = 0; i < tbs.length; i++) {
                var tb = tbs[i];
                if (me.agent.objectEqu(tb.Filter, filter))
                    return { rows: tb.Rows };
            }
        }

        var pm = me.agent.genDSRequestParam(ds);
        pm.Filter = filter;
        tbs = me.agent.batchLoadData([pm], true, null, ds.PreventCache);
        return { rows: tbs[0].Rows };
    },

    genFilter: function () {
        var elType = this.getEleType();

        if (!elType.DataSource || !elType.DataSource.Filter)
            return null;

        var rv = null;
        var kvs = elType.DataSource.Filter.kvs;
        for (var i = 0; i < kvs.length; i++) {
            var kv = kvs[i];
            var xels = this.getElesFromPath(kv.vr.path);
            if (xels && xels.length >= 1) {
                rv = rv || {};
                rv[kv.key] = xels[0].getValue();
            }
        }

        return rv;
    },

    getCurrentFilters: function () {
        var me = this,
            et = me.getEleType();

        if (!et)
            return {};

        var ds = et.DataSource;
        if (!ds)
            return {};

        var filters = {},
            kvs = ds.Filter ? ds.Filter.kvs : [];

        for (var i = 0; i < kvs.length; i++) {
            var kv = kvs[i];

            if (kv.isConstant) {
                filters[kv.key] = {
                    value: kv.value,
                    op: kv.op
                };

                if (kv.isAfterBind)
                    filters[kv.key].afterBind = kv.isAfterBind;
            }
            else {
                var xel = (me.getElesFromPath(kv.vr.path) || [])[0] || {};
                filters[kv.key] = {
                    value: xel.getValue(),
                    op: kv.op
                };
            }
        }

        return filters;
    },

    genValueChangeUpdater: function () {
        return [{ xel: this, tag: 'value', src: 'none'}];
    },

    clone: function (newName) {
        var tagName = this.dom.tagName;
        var htm;
        if (tagName == 'INPUT')
            htm = Ext.String.format('<{0} name="{1}" type="{2}"></{0}>', tagName, newName, this.dom.type);
        else
            htm = Ext.String.format('<{0} name="{1}"></{0}>', tagName, newName);

        var nel = document.createElement(htm);
        if (tagName == 'INPUT')
            nel.value = this.dom.value || '';

        var attrs = this.dom.attributes;
        for (var i = 0; i < attrs.length; i++) {
            var attr = attrs[i];
            if (!attr.specified)
                continue;

            var n = (attr.nodeName || '').toLowerCase();
            if (n == 'name')
                continue;

            nel.setAttribute(n, attr.nodeValue);
        }

        return nel;
    },

    getSelPos: function (dom) {
        var me = this,
            tagName = dom.tagName.toLowerCase(),
            rv = {};

        if (Ext.isDefined(dom.selectionStart)) {
            rv.s = dom.selectionStart;
            rv.l = dom.selectionEnd - rv.s;
        }
        else {
            var s = document.selection.createRange();
            rv.l = s.text.length;
            var t;
            if (tagName == YZSoft.XForm.tagNames.textarea) {
                t = document.body.createTextRange();
                t.moveToElementText(dom);
            }
            else
                t = dom.createTextRange();

            s.setEndPoint("StartToStart", t);
            rv.s = s.text.length - rv.l;
        }
        rv.e = rv.s + rv.l;
        return rv;
    },

    outerHTML: function () {
        return this.self.outerHTML(this.dom);
    },

    getContainer: function () {
        if (this._container === false)
            return null;

        if (!this._container)
            this._container = Ext.findParent('div.yz-inp-cnt', this.dom);

        if (!this._container)
            this._container = false;

        return this._container || null;
    },

    getSpoor: function () {
        var cnt = this.getContainer();
        if (!cnt)
            return null;

        if (cnt._spoor === false)
            return null;

        if (!cnt._spoor)
            cnt._spoor = Ext.selectNode('div.yz-spoor', cnt);

        if (!cnt._spoor)
            cnt._spoor = false;

        return cnt._spoor || null;
    },

    createMaskOverlay: function () {
        var me = this,
            et = me.getEleType(),
            overlay;

        overlay = me.overlay = me.createChild({
            role: 'presentation',
            cls: et.DisableOverlayCls || me.disableOverlayCls,
            style: 'position:absolute;top:0px;left:0px;z-index:99999;width:100%;height:100%',
            html: '&#160;'
        });

        overlay.unselectable();
        return me.overlay;
    },

    createSpoorMark: function () {
        var me = this,
            et = me.getEleType(),
            spoor;

        me.addCls('yz-xform-field-cnt-spoor');

        spoor = me.createChild({
            role: 'presentation',
            cls: 'x-unselectable yz-xform-field-ele-spoor'
        }, null, true);

        return spoor;
    },

    showSpoorMark: function () {
        var me = this,
            spoor = me.spoor = me.down('.yz-xform-field-ele-spoor', false);

        if (spoor) {
            spoor.addCls('yz-xform-field-ele-spoor-modified');
            spoor.on({
                scope: me,
                click: 'onSpoorClick'
            });
        }
    },

    onSpoorClick: function () {
        this.showFieldSpoor();
    },

    showFieldSpoor: function () {
        var me = this,
            f = me.agent.getFieldInfo(me),
            params;

        params = {
            Method: 'GetFieldModifies',
            CKeyName: f.CKeyName,
            CKeyValue: f.CKeyValue,
            DataSource: f.Column.ParentTable.DataSource,
            TableName: f.Column.ParentTable.TableName,
            ColumnName: f.Column.ColumnName
        };

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Form.ashx'),
            params: params,
            scope: me,
            success: function (action) {
                if (me.agent.tip)
                    me.agent.tip.close();

                me.agent.tip = me.getFieldSpoorPanel(me.getSpoorTarget(), action.result);
                me.agent.tip.show();
            },
            failure: function (action) {
                alert(Ext.String.format(RS.$('Form_GetFieldSpoor_Fail'), action.result.errorMessage));
            }
        });
    },

    getFieldSpoorPanel: function (target, data) {
        var me = this,
            data = data || [],
            strtrimlen = me.spnoorTextMaxLength,
            template = '<tr class="{0}"><td><span class="yz-spoor-date">{1}</span><span class="yz-spoor-user">{2}</span><span class="yz-spoor-seprator">></span><span class="yz-spoor-value">{3}</span></td></tr>',
            html = '',
            firstRow;

        html += '<table class="yz-spoor-table">';
        firstRow = true;
        Ext.each(data, function (rec) {
            var v = me.valueToSpnoorText(rec.Value),
                modifyDate = Ext.String.format(RS.$('All_Spoor_ModifyDate'), rec.ModifyDate);

            v = (Ext.isString(v) && v.length > strtrimlen) ? (v.substr(strtrimlen - 3) + '...') : v;
            html += Ext.String.format(template, 'yz-spoor-tr-data ' + (firstRow ? 'yz-spoor-tr-data-first' : 'yz-spoor-tr-data-modify'), modifyDate, rec.UserSortName, v);
            firstRow = false;
        });
        html += '</table>';

        return Ext.create('Ext.ToolTip', {
            header: {
                layout: {
                    type: 'hbox',
                    align: 'start'
                }
            },
            headerPosition: 'right',
            target: target,
            anchor: 'left',
            html: html,
            width: 380,
            autoShow: true,
            autoHide: false,
            //closable: true, 点击外部自动关闭
            autoDestroy: true,
            closeAction: 'destroy'
        });
    },

    getSpoorTarget: function () {
        return this.down('.yz-xform-field-wrap', false);
    },

    valueToSpnoorText: function (value) {
        return this.valueToText(value);
    },

    valueToText: function (value) {
        return value;
    },

    showErrorTip: function () {
        this.addCls(this.errCls);
    },

    hideErrorTip: function () {
        this.removeCls(this.errCls);
    }
});