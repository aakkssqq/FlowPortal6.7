// JScript 文件
// XFormAgent Ver1.0 Shanghai 2011-11-21
// XFormAgent Ver2.0 Shanghai 2015-07-25

YZSoft.XForm = YZSoft.XForm || {};

YZSoft.XForm.tagNames = {
    table: 'table',
    select: 'select',
    input: 'input',
    textarea: 'textarea',
    label: 'label',
    a: 'a',
    span: 'span'
};

YZSoft.XForm.xtypeNames = {
    gridlineno: 'gridlineno'
};

YZSoft.XForm.DSType = {
    Table: 1,
    Procedure: 2,
    ESB:3
};

YZSoft.XForm.NodeType = {
    Element: 1,
    Block: 2
};

YZSoft.XForm.EleTypes = {
    Select: 1,
    Button: 2,
    Table: 3,
    LineNo: 4,
    TextBox: 5,
    Radio: 6,
    CheckBox: 7,
    Label: 8,
    TextArea: 9,
    A: 10,
    Span: 11
};

YZSoft.XForm.DataType = {
    Decimal: 1,
    Double: 2,
    Single: 3,
    Int16: 4,
    Int32: 5,
    Int64: 6,
    SByte: 7,
    UInt16: 8,
    UInt32: 9,
    UInt64: 10,
    Byte: 11,
    Boolean: 12,
    DateTime: 13,
    String: 14,
    Binary: 15
};

//Ext.Loader.setConfig({ disableCaching: true, disableCachingParam:'ghf=55' });
Ext.Loader.loadScriptsSync(YZSoft.$url('YZSoft/forms/src/Parser.js'));
Ext.syncRequire([
    'YZSoft.forms.field.Element',
    'YZSoft.forms.src.Block',
    'YZSoft.forms.src.ElementTypeInfo',
    'YZSoft.forms.src.Validator'
]);

/*
events:
ready - 表单数据加载、填充完成，准备提交
*/
Ext.define('YZSoft.XForm.Agent', {
    extend: 'Ext.Evented',
    requires: [
    ],

    ValuePriority: {
        'none': 1,
        'default': 2,
        'map': 3,
        'value': 4,
        'set': 5
    },
    Models: {
        Snapshot: 1,
        Share: 2,
        Process: 3,
        Read: 4,
        App: 5,
        Draft: 6,
        Post: 7,
        Form: 8
    },
    DataTypeMap: {
        'decimal': YZSoft.XForm.DataType.Decimal,
        'double': YZSoft.XForm.DataType.Double,
        'single': YZSoft.XForm.DataType.Single,
        'int16': YZSoft.XForm.DataType.Int16,
        'int32': YZSoft.XForm.DataType.Int32,
        'int64': YZSoft.XForm.DataType.Int64,
        'sbyte': YZSoft.XForm.DataType.SByte,
        'uint16': YZSoft.XForm.DataType.UInt16,
        'uint32': YZSoft.XForm.DataType.UInt32,
        'uint64': YZSoft.XForm.DataType.UInt64,
        'byte': YZSoft.XForm.DataType.Byte,
        'boolean': YZSoft.XForm.DataType.Boolean,
        'datetime': YZSoft.XForm.DataType.DateTime,
        'byte[]': YZSoft.XForm.DataType.Binary
    },

    constructor: function () {
        var me = this;

        Ext.apply(me, {
            Vars: {},
            EleTypes: [],
            Eles: [],
            FormTables: [],
            FormTablesByName: {},
            AssistTables: [],
            RootBlock: new YZSoft.forms.src.Block(me),
            ETRootBlock: new YZSoft.forms.src.Block(me),
            userFuncs: {}
        });

        me.callParent(arguments);

        me.on({
            scope: me,
            inputChange: 'onInputChanged'
        });
    },

    inheritableStatics: {
        arrayFilter: function (arr, filter, returnMatchItem) {
            var me = this,
                returnMatchItem = returnMatchItem !== false;

            if (!arr)
                return null;

            if (!filter)
                return arr;

            var rv = [];
            for (var i = 0; i < arr.length; i++) {
                if (me.objectMatchFilter(arr[i], filter) === returnMatchItem)
                    rv.push(arr[i]);
            }

            return rv;
        },

        arrayContains: function (arr, itm) {
            var me = this;
            if (!arr || !itm)
                return false;

            for (var i = 0; i < arr.length; i++) {
                if (me.objectMatchFilter(arr[i], itm))
                    return arr[i];
            }

            return null;
        },

        stringArrayContains: function (arr, n) {
            if (!arr || !n)
                return false;

            for (var i = 0; i < arr.length; i++) {
                if (String.Equ(arr[i], n))
                    return true;
            }

            return false;
        },

        objectMatchFilter: function (srcObject, filterObject) {
            var me = this;

            if (!filterObject)
                return true;

            if (srcObject === filterObject)
                return true;

            for (var p in filterObject) {
                if (!(p in srcObject))
                    return false;

                var v1 = filterObject[p],
                    v2 = srcObject[p];

                if (Ext.isObject(v1) && Ext.isObject(v2)) {
                    if (!me.objectEqu(v1, v2))
                        return false;
                }
                else {
                    if (Ext.isString(v1) && Ext.isString(v2)) {
                        v1 = Ext.String.trim((v1 || '').toLowerCase());
                        v2 = Ext.String.trim((v2 || '').toLowerCase());
                    }

                    if (v1 != v2)
                        return false;
                }
            }
            return true;
        },

        objectEqu: function (object1, object2) {
            var me = this;

            if (!object1 && !object2)
                return true;

            if (!me.objectMatchFilter(object1, object2))
                return false;

            for (var p in object1) {
                if (!(p in object2))
                    return false;
            }

            return true;
        }
    },

    registFunc: function (name, func) {
        this.userFuncs[name] = func;
    },

    getFunc: function (name) {
        var me = this;

        name = Ext.String.trim(name || '');
        if (name) {
            try {
                var func = me.userFuncs[name];
                if (!func) {
                    func = eval(name);
                    me.registFunc(name, func);
                }
                return func;
            }
            catch (e) {
            }
        }
    },

    initEnv: function () {
        var me = this;

        Ext.setKeyboardMode(false);

        me.sDataProviderURL = YZSoft.$url('YZSoft.Services.REST/BPM/FormDataProvider.ashx');
        me.sPostURL = YZSoft.$url('YZSoft.Services.REST/BPM/Post.ashx');
        me.sBaseUrl = YZSoft.$url('YZSoft/Forms/');

        var qs = Ext.String.trim(document.location.search);
        if (qs.charAt(0) == '?')
            qs = qs.substring(1);

        var s = me.urlParams = Ext.urlDecode(qs, true);
        var p = me.Params = {};

        p.Share = s.share == '1';
        p.ProcessName = s.pn;
        p.ProcessVersion = s.version || ProcessVersion; //js全局变量
        p.RestartTaskID = Number(s.restartTaskID || -1);
        p.position = s.position;
        p.StepID = Number(s.pid || -1);
        p.TaskID = Number(s.tid || -1);
        p.Owner = s.owner;
        p.Ver = Number(s.ver || -1);
        p.DraftGuid = s.did;
        p.AppName = s.app;
        p.AppShortName = s.appShortName;
        p.FormState = s.formstate;
        p.Key = s.key;
        p.stk = s.stk;

        var m = me.Models;
        if (p.Ver != -1) p.Model = m.Snapshot;
        else if (p.StepID != -1) p.Model = p.Share ? m.Share : m.Process;
        else if (p.TaskID != -1) p.Model = m.Read;
        else if (p.AppName) p.Model = m.App;
        else if (p.DraftGuid) p.Model = m.Draft;
        else if (p.ProcessName) p.Model = m.Post;
        else p.Model = m.Form;

        me.FirstTimeUse = (p.Model == m.Post || (p.Model == m.App && !p.Key));

        switch (p.Model) {
            case m.Read:
            case m.Snapshot:
                Ext.getBody().addCls('yz-xform-read');
                break;
        }
    },

    onBeforeRequest: function (params) {
        var me = this;
        if (me.Params.stk && params)
            params.stk = me.Params.stk;

        return params;
    },

    catchEleTypes: function (eles) {
        var me = this;

        var len = eles.length;
        for (var i = 0; i < len; i++) {
            var domel = eles[i],
                xclass = YZSoft.forms.field.Element.getXClass(domel),
                xel;

            if (xclass) {
                xel = Ext.create(xclass, me, domel);
                var et = new YZSoft.forms.src.ElementTypeInfo(me, xel);

                if (et.isValid) {
                    if (et.groupBy) {
                        var existet = me.arrayContains(me.EleTypes, et.groupBy);
                        if (existet) {
                            et = existet;
                            et.isGrouped = true;
                        }
                    }
                    if (!('index' in et)) {
                        me.EleTypes.push(et);
                        et.index = me.EleTypes.length - 1;
                        et.DataBind = me.registerVar(xel, et.sDataBind, et);
                    }
                    xel.setEleTypeIndex(et.index);
                    xel.elType = et;

                    var nlen = me.Eles.push(xel);
                    xel.setXEleIndex(nlen - 1);
                }
            }
        }

        for (var varname in me.Vars) {
            var vr = me.Vars[varname];
            if (!vr.memvar && !vr.elType) {
                if (vr.xel)
                    YZSoft.Error.raise(RS.$('Form_DependencyNotExist'), YZSoft.HttpUtility.htmlEncode(vr.xel.getElDesc(), true), vr.name);
                else
                    YZSoft.Error.raise(RS.$('Form_VarNotExist'), vr.name);
            }
        }
    },

    applyDataControlInfo: function () {
        var me = this,
            xels = me.Eles,
            len = xels.length;

        for (var i = 0; i < len; i++) {
            var xel = xels[i];
            var t = xel.getEleType();
            var dc = t.DataBind ? t.DataBind.DataColumn : null;
            if (dc) {
                if (dc.Writeable === false)
                    xel.setDisabled(true);

                if (dc.Type == YZSoft.XForm.DataType.String && dc.Length != -1) {
                    if (xel.setMaxLength)
                        xel.setMaxLength(dc.Length);
                }

                if (dc.ShowSpoor) {
                    me.hasSpoor = true;
                    xel.supportSpoor && xel.createSpoorMark();
                }
            }
        }
    },

    /*
    spoors = [{
    DataSourceName: 'Default',
    TableName: 'Purchase',
    PrimaryKey: 893,
    ColumnName: 'Amount'
    }, {
    DataSourceName: 'Default',
    TableName: 'PurchaseDetail',
    PrimaryKey: 592,
    ColumnName: 'Price'
    }, {
    DataSourceName: 'Default',
    TableName: 'PurchaseDetail',
    PrimaryKey: 592,
    ColumnName: 'SubTotal'
    }];
    */
    showSpoorMarks: function (spoors) {
        var me = this;

        if (!me.hasSpoor)
            return;

        if (!spoors) {
            var params;

            switch (me.Params.Model) {
                case me.Models.Snapshot:
                case me.Models.Share:
                case me.Models.Process:
                case me.Models.Read:
                    params = {
                        Method: 'GetTaskDirtyFields',
                        TaskID: me.Params.TaskID
                    };
                    break;
                case me.Models.App:
                    params = {
                        Method: 'GetFormAppDirtyFields',
                        AppName: me.Params.AppShortName,
                        Key: me.Params.Key
                    };
                    break;
            }

            me.onBeforeRequest(params);
            if (params) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/Form.ashx'),
                    params: params,
                    scope: me,
                    success: function (action) {
                        me.showSpoorMarks(action.result);
                    },
                    failure: function (action) {
                    }
                });
            }
        }
        else {
            var xels = me.Eles,
                len = xels.length,
                spoors;

            for (var i = 0; i < len; i++) {
                var xel = xels[i],
                    t = xel.getEleType(),
                    dc = t.DataBind ? t.DataBind.DataColumn : null;


                if (dc && dc.ShowSpoor) {
                    var f = me.getFieldInfo(xel),
                        dataSourceName = f.Column.ParentTable.DataSource,
                        tableName = f.Column.ParentTable.TableName,
                        primaryKey = f.CKeyValue,
                        columnName = f.Column.ColumnName;

                    var spoor = Ext.Array.findBy(spoors, function (spoorItem) {
                        if (String.Equ(primaryKey, spoorItem.PrimaryKey) &&
                            String.Equ(tableName, spoorItem.TableName) &&
                            String.Equ(columnName, spoorItem.ColumnName))
                            return true;
                    });

                    if (spoor)
                        xel.showSpoorMark();
                }
            }
        }
    },

    buildXFormDOM: function (block, xels) {
        var me = this;

        for (var i = 0; i < xels.length; i++) {
            var xel = xels[i];
            if (xel.catched)
                continue;

            var et = xel.getEleType();
            if (!et)
                continue;

            xel.ParentBlock = block;
            if (!et.isGrouped) {
                block.Eles.push(xel);
            }
            else {
                var mxel = null;
                for (var j = block.Eles.length - 1; j >= 0; j--) {
                    if (block.Eles[j].getEleType() === et) {
                        mxel = block.Eles[j];
                        break;
                    }
                }

                if (!mxel) {
                    mxel = xel;
                    mxel.GroupEles = [];
                    block.Eles.push(mxel);
                }

                mxel.GroupEles.push(xel);
                xel.mxel = mxel;
            }
            xel.catched = true;

            if (xel.isGrid) {
                var blockCount = xel.getBlockCountDom();
                for (var j = 0; j < blockCount; j++) {
                    var cxels = xel.getBlockElesDom(j);

                    xel.Blocks = xel.Blocks || [];
                    var newBlock = new YZSoft.forms.src.Block(me);
                    newBlock.ParentElement = xel;
                    xel.Blocks.push(newBlock);

                    me.buildXFormDOM(newBlock, cxels);
                }
            }
        }
    },

    copyEleTypeDOMFromXFormDOM: function (block, etblock) {
        var me = this;

        block = block || me.RootBlock;
        etblock = etblock || me.ETRootBlock;

        for (var i = 0; i < block.Eles.length; i++) {
            var xel = block.Eles[i];
            var et = xel.getEleType();
            if (!et)
                continue;

            et.index = i;
            et.ParentBlock = etblock;
            etblock.Eles.push(et);

            if (xel.Blocks) {
                for (var j = 0; j < xel.Blocks.length; j++) {
                    et.Blocks = et.Blocks || [];

                    var newBlock = new YZSoft.forms.src.Block(me);
                    newBlock.index = et.Blocks.length;
                    newBlock.ParentElement = et;
                    et.Blocks.push(newBlock);

                    me.copyEleTypeDOMFromXFormDOM(xel.Blocks[j], newBlock);
                }
            }
        }
    },

    createAffect: function (src, tag, nof, not) {
        var me = this,
            tvr = tag.vr || {};

        tvr.src = src.prop;
        tvr.tag = tag.prop;
        tvr.path = me.toRelativePath(tag.path, src.path);
        tvr.elType = src.elType;
        tvr.ext = tag.ext;

        if (!nof) {
            var t = tag.elType;
            t.affectFrom = t.affectFrom || {};
            t.affectFrom[tag.prop] = t.affectFrom[tag.prop] || [];
            t.affectFrom[tag.prop].push(tvr);
        }

        if (src.elType && !not) { //非内存变量
            var svr = src.vr || {};
            svr.src = src.prop;
            svr.tag = tag.prop;
            svr.path = me.toRelativePath(src.path, tag.path);
            svr.elType = tag.elType;
            svr.ext = src.ext;

            var s = src.elType;
            s.affectTo = s.affectTo || {};
            s.affectTo[src.prop] = s.affectTo[src.prop] || [];
            s.affectTo[src.prop].push(svr);
        }
    },

    compile: function (block) {
        var me = this;

        block = block || me.ETRootBlock;

        //创建相互影响关系
        var blockPath = block.getPath();
        for (var i = 0; i < block.Eles.length; i++) {
            var elType = block.Eles[i];
            var elPath = null;

            if (elType.Expresses) {
                for (var name in elType.Expresses) {
                    elType.affectFrom = elType.affectFrom || {};
                    elType.affectFrom[name] = elType.affectFrom[name] || [];

                    var exp = elType.Expresses[name];
                    var vars = exp.vars || [];

                    for (var j = 0; j < vars.length; j++) {
                        var vr = vars[j];
                        var etsrc = vr.def.elType;

                        if (elPath == null) {
                            elPath = [].concat(blockPath);
                            elPath.push(i);
                        }

                        var v2v = etsrc == elType && name == 'value';
                        var spath = etsrc ? etsrc.getPath() : null;
                        me.createAffect({ prop: 'value', path: spath, elType: etsrc }, { prop: name, path: elPath, elType: elType, vr: vr }, v2v, v2v);
                    }
                }
            }

            if (elType.DataSource && elType.DataSource.Filter) {
                elType.affectFrom = elType.affectFrom || {};
                elType.affectFrom['filter'] = elType.affectFrom['filter'] || [];

                var vars = elType.DataSource.Filter.vars;
                for (var j = 0; j < vars.length; j++) {
                    var vr = vars[j];
                    var etsrc = vr.def.elType;
                    if (etsrc == null) //内存变量
                        continue;

                    if (elPath == null) {
                        elPath = [].concat(blockPath);
                        elPath.push(i);
                    }

                    var spath = etsrc.getPath();
                    var noaf = elType.filterNoAffect;
                    //var noaf = (elType.Type == x.EleTypes.Button) || (elType.Type == x.EleTypes.TextBox && !elType.DataSource.DisplayColumn); voith textbox做datasource
                    me.createAffect({ prop: 'value', path: spath, elType: etsrc }, { prop: 'filter', path: elPath, elType: elType, vr: vr }, noaf, noaf);
                }

                if (elType.mapMode == 'filtervaluemap') {
                    me.createAffect({ prop: 'filter', path: elPath, elType: elType }, { prop: 'value', path: elPath, elType: elType });
                }
            }

            if (elType.DataMap) {
                elType.affectFrom = elType.affectFrom || {};
                elType.affectFrom['map'] = elType.affectFrom['map'] || [];

                if (elPath == null) {
                    elPath = [].concat(blockPath);
                    elPath.push(i);
                }

                if (elType.mapMode == 'valuefiltermap') {
                    me.createAffect({ prop: 'filter', path: elPath, elType: elType }, { prop: 'map', path: elPath, elType: elType });
                }
                else if (elType.mapMode == 'filtervaluemap') {
                    me.createAffect({ prop: 'value', path: elPath, elType: elType }, { prop: 'map', path: elPath, elType: elType });
                }


                if (elType.isGrid) {
                    elType.affectFrom['filter'] = elType.affectFrom['filter'] || [];
                    if (elType.affectFrom['filter'].length == 0)
                        me.createAffect({ prop: 'value', path: elPath, elType: elType }, { prop: 'filter', path: elPath, elType: elType });
                    me.createAffect({ prop: 'filter', path: elPath, elType: elType }, { prop: 'map', path: elPath, elType: elType });
                }

                var vars = elType.DataMap.vars,
                    nof = elType.filterNoAffect;
                for (var j = 0; j < vars.length; j++) {
                    var vr = vars[j];
                    var ettag = vr.def.elType;
                    if (ettag == null) //内存变量
                        continue;

                    if (elPath == null) {
                        elPath = [].concat(blockPath);
                        elPath.push(i);
                    }

                    var tpath = ettag.getPath();
                    me.createAffect({ prop: 'map', path: elPath, elType: elType, vr: vr }, { prop: 'value', path: tpath, elType: ettag, ext: { selType: elType} }, nof);

                    if (elType.filterNoAffect) {
                        elType.MaptoGrids = elType.MaptoGrids || [];
                        if (ettag.ParentBlock.ParentElement) {
                            var pitm = { elType: ettag.ParentBlock.ParentElement };
                            if (!me.arrayContains(elType.MaptoGrids, pitm)) {
                                pitm.path = me.toRelativePath(elPath, ettag.ParentBlock.ParentElement.getPath());
                                elType.MaptoGrids.push(pitm);
                            }
                        }
                    }
                }
            }
            else if (elType.isGrid) {
                if (elPath == null) {
                    elPath = [].concat(blockPath);
                    elPath.push(i);
                }
                elType.affectFrom = elType.affectFrom || {};
                elType.affectFrom['filter'] = elType.affectFrom['filter'] || [];
                me.createAffect({ prop: 'filter', path: elPath, elType: elType }, { prop: 'map', path: elPath, elType: elType });
            }

            if (elType.Blocks) {
                for (var j = 0; j < elType.Blocks.length; j++) {
                    me.compile(elType.Blocks[j]);
                }
            }
        }
    },

    buildSetValueOrder: function () {
        var me = this;

        var ets = [].concat(me.EleTypes);
        var len = ets.length;
        for (var i = 0; i < len; i++) {
            var et = ets[i];
            var af = et.affectFrom;
            et.taf = {};
            var t = et.taf;
            if (af) {
                for (var p in af)
                    t[p] = [].concat(af[p]);
            }
            t.value = t.value || [];
        }

        var idx = 1;
        while (ets.length != 0) {
            var bi = idx;
            for (var i = 0; i < ets.length; i++) {
                var et = ets[i];
                var af = et.taf || {};
                var am = 0;
                var remove = true;
                for (var p in af) {
                    var afc = af[p] || [];
                    for (var j = afc.length - 1; j >= 0; j--) {
                        var afi = afc[j];
                        if (!afi.elType || (afi.elType.Orders && afi.elType.Orders[afi.src]))
                            afc.splice(j, 1);
                    }

                    am += afc.length;
                    var pgdorders = ((et.ParentBlock || {}).ParentElement || { Orders: null }).Orders;
                    if (afc.length == 0 && (!pgdorders || pgdorders['map'])) {
                        et.Orders = et.Orders || {};
                        et.Orders[p] = idx;

                        delete af[p];
                        idx++;
                    }
                    else
                        remove = false;
                }

                if (am == 0 && remove) {
                    ets.splice(i, 1);
                    i--;
                }
            }

            if (idx == bi) {
                var a = [];
                for (var i = 0; i < ets.length; i++)
                    a.push(ets[i].xel.getElDesc());
                YZSoft.Error.raise(RS.$('Form_DepdencyDeadloop'), a.join(','));
            }
        }

        //me.showOrderInfo();
    },

    registerVar: function (xel, varname, elType, autoRegist) {
        var me = this,
            nameLow = (varname || '').toLowerCase();

        if (!nameLow)
            return null;

        var vr = me.Vars[nameLow];
        if (vr) {
            //允许重复绑定
            //if (vr.elType && elType)
            //    YZSoft.Error.raise('XForm_重复绑定',varname);

            vr.elType = vr.elType || elType;
            vr.xel = vr.xel || xel;
        }
        else {
            autoRegist = autoRegist === false ? false : true;
            if (autoRegist) {
                vr = { nameLow: nameLow, name: varname, elType: elType, xel: xel };
                me.Vars[nameLow] = vr;
            }
            else
                YZSoft.Error.raise(RS.$('Form_VarNotExist'), varname);
        }

        return vr;
    },

    registerMemVar: function (varname, value) {
        var me = this,
            nameLow = varname.toLowerCase(),
            vr;

        vr = { nameLow: nameLow, name: varname, memvar: true, value: value };
        me.Vars[nameLow] = vr;
    },

    getVar: function (xel, varname, autoRegist) {
        var vr = this.registerVar(xel, varname, null, autoRegist);
        return { def: vr };
    },

    toVarArray: function (xel, srcArr, autoRegist) {
        var me = this,
            rv = [];

        srcArr = srcArr || [];

        for (var i = 0; i < srcArr.length; i++) {
            rv.push(me.getVar(xel, srcArr[i], autoRegist));
        }

        return rv;
    },

    getPath: function (obj) {
        var path = [];

        while (obj != null) {
            if (obj.NodeType == YZSoft.XForm.NodeType.Element)
                path.push(obj.index);
            obj = obj.ParentBlock || obj.ParentElement || null;
        }

        return path.reverse();
    },

    //返回path1到path2的相对路径
    toRelativePath: function (path1, path2) {
        if (!path1 || !path2) //内存变量不需要相对地址
            return null;
        var count = Math.min(path1.length, path2.length) - 1; //避免就是自己的时候相对路径为空路径
        var equCount = 0;
        for (var i = 0; i < count; i++) {
            if (path1[i] != path2[i])
                break;
            equCount++;
        }

        var rv = [];
        for (var i = 0; i < path1.length - equCount - 1; i++)
            rv.push('.');

        for (var i = equCount; i < path2.length; i++)
            rv.push(path2[i]);

        return rv;
    },

    //一次Request加载多个表，以节省时间
    batchLoadData: function (pms, sync, fn, preventCatch) {
        if (pms.length == 0)
            return;

        var me = this,
            xe = YZSoft.util.xml,
            url = me.sDataProviderURL,
            rv = {};

        preventCatch = preventCatch === true;
        pms = Ext.isArray(pms) ? pms : [pms];

        var timebegin = (new Date()).getTime();
        me.Debug.LoadData = me.Debug.LoadData || {};
        //转换参数
        //var xmlData = xe.encode('Requests', { Params: pms });

        var params = {};

        me.onBeforeRequest(params);
        Ext.Ajax.request({
            method: 'POST',
            disableCaching: true,
            async: !sync,
            params: params,
            url: url,
            //xmlData: xmlData,
            jsonData: pms,
            success: function (response) {
                rv = Ext.decode(response.responseText);
                rv.errorMessage = Ext.String.htmlDecode(rv.errorMessage);

                if (!rv.success)
                    YZSoft.Error.raise(RS.$('Form_LoadDataFailed'), rv.errorMessage);

                //加入缓存
                var tbs = [];
                for (var i = 0; i < rv.Tables.length; i++) {
                    var table = rv.Tables[i];
                    tbs.push((table.DataSource ? table.DataSource + ':' : '') + table.TableName + ',Rows:' + table.Rows.length);
                    if (table.FormTable) {
                        me.FormTables.push(table);
                        me.FormTablesByName[table.TableName] = table;
                        var ismemvar = table.TableName == 'Global';
                        if (ismemvar)
                            Ext.apply(me, table.Rows[0]);

                        for (var j = 0; j < table.Columns.length; j++) {
                            var col = table.Columns[j];
                            col.ParentTable = table;
                            col.CType = col.Type;
                            col.Type = me.parseDataType(col.CType);

                            if (col.PrimaryKey || col.AutoIncrement) {
                                table.PrimaryColumns = table.PrimaryColumns || [];
                                table.PrimaryColumns.push(col);
                                col.FullNameLow = me.combinFieldName(table.DataSource, table.TableName, col.ColumnName);
                            }

                            if (ismemvar) {
                                var mvar = me.Vars[me.combinFieldName('', table.TableName, col.ColumnName)];
                                if (mvar)
                                    mvar.value = table.Rows[0][col.ColumnName];
                            }
                        }
                    }
                    else {
                        if (!preventCatch) {
                            var pm = pms[table.Index];
                            table.Filter = pm.Filter || null;
                            table.DSType = pm.DSType;
                            table.DataSource = pm.DataSource;
                            table.ID = pm.ID;
                            me.AssistTables.push(table);
                        }
                    }
                }

                me.Debug.LoadData[tbs.join(',')] = eval((new Date()).getTime() - timebegin);

                if (fn)
                    fn();
            },

            failure: function (response) {
                YZSoft.Error.raise(RS.$('Form_LoadDataHttpErr'), url);
            }
        });

        return rv.Tables;
    },

    bufferFormData: function () {
        var me = this,
            m = me.Models,
            p = me.Params,
            pms = [],
            fpm

        switch (p.Model) {
            case m.Post:
                fpm = {
                    Method: 'GetFormPostData',
                    ProcessName: p.ProcessName,
                    ProcessVersion: p.ProcessVersion,
                    RestartTaskID: p.RestartTaskID,
                    Owner: p.Owner
                };
                break;
            case m.Process:
            case m.Share:
                fpm = {
                    Method: 'GetFormProcessData',
                    PID: p.StepID
                };
                break;
            case m.Read:
                fpm = {
                    Method: 'GetFormReadData',
                    TID: p.TaskID,
                    PID: me.urlParams.tpid
                };
                break;
            case m.Snapshot:
                fpm = {
                    Method: 'GetSnapshotData',
                    TID: p.TaskID,
                    Version: p.Ver
                };
                break;
            case m.Draft:
                fpm = {
                    Method: 'GetDraftData',
                    DraftID: p.DraftGuid
                };
                break;
            case m.App:
                fpm = {
                    Method: 'GetFormApplicationData',
                    ApplicationName: p.AppName,
                    FormState: p.FormState,
                    PrimaryKey: p.Key
                };
                break;
        }

        if (fpm) //m.Form模式 fpm为空
            pms.push(fpm);

        for (var i = 0; i < me.EleTypes.length; i++) {
            var et = me.EleTypes[i],
                ds = et.DataSource;

            if (!ds || !ds.PreLoad || ds.PreventCache || (ds.Filter && ds.Filter.hasVar))
                continue;

            var npm = me.genDSRequestParam(ds);
            npm.Filter = me.getConstantFilter(ds);

            var tbs = me.arrayFilter(pms, { DSType: ds.DSType, DataSource: ds.DataSource, ID: ds.ID }) || [];
            var exist = false;
            for (var k = 0; k < tbs.length; k++) {
                var tb = tbs[k];
                if (me.objectEqu(tb.Filter, npm.Filter)) {
                    exist = true;
                    break;
                }
            }

            if (!exist)
                pms.push(npm);
        }

        me.batchLoadData(pms, true, function () { me.DataBuffered = true; });
    },

    getConstantFilter: function (ds) {
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
            }
        }

        return filters;
    },

    genDSRequestParam: function (ds) {
        var pm = {
            DataSource: ds.DataSource,
            ID: ds.ID,
            DSType: ds.DSType
        };

        switch (ds.DSType) {
            case YZSoft.XForm.DSType.Table:
                pm.Method = 'GetUserDataTable';
                pm.TableName = ds.TableName;
                pm.OrderBy = ds.OrderBy;
                break;
            case YZSoft.XForm.DSType.Procedure:
                pm.Method = 'GetUserDataProcedure';
                pm.ProcedureName = ds.ProcedureName;
                break;
            case YZSoft.XForm.DSType.ESB:
                pm.Method = 'GetUserDataESB';
                pm.ESB = ds.ESB;
                pm.OrderBy = ds.OrderBy;
                break;
        }

        return pm;
    },

    beforeSaveGridDefine: function () {
        var me = this;

        var len = me.Eles.length;
        for (var i = 0; i < len; i++) {
            var xel = me.Eles[i];
            xel.onBeforeSaveGridDefine();
        }
    },

    expandUpdaters: function (ups) {
        var upidxs = {};
        for (var i = 0; i < ups.length; i++) {
            var up = ups[i];
            var id = up.xel ? up.xel.id : 0;
            var upidx = upidxs[id] = upidxs[id] || [];
            upidx.push(up);
        }

        for (var i = 0; i < ups.length; i++) {
            var up = ups[i];
            up.xel.expandUpdater(ups, upidxs, up);
        }

        ups.splice(0, ups.length);
        for (idx in upidxs) {
            var upidx = upidxs[idx];
            for (var i = 0; i < upidx.length; i++) {
                ups.push(upidx[i]);
            }
        }
    },

    doUpdater: function (ups) {
        //var timebegin1 = (new Date()).getTime();
        var me = this;

        for (var cidx = 0; cidx < ups.length; ) {
            var u = ups[cidx++]; //shift IE上效率很低
            if (!u.xel.dom)
                continue;

            var t = u.xel.getEleType();
            if (!t)
                continue;

            switch (u.tag) {
                case 'disable':
                    switch (u.src) {
                        case 'value':
                            if (t.canWrite())
                                u.xel.setDisabled(u.xel.calcExpress(t.Expresses.disable));
                            break;
                    }
                    break;
                case 'hide':
                    switch (u.src) {
                        case 'value':
                            u.xel.setVisible(!u.xel.calcExpress(t.Expresses.hide));
                            break;
                    }
                    break;
                case 'value':
                    switch (u.src) {
                        case 'set':
                        case 'default':
                            u.xel.setValue(u.value);
                            break;
                        case 'value':
                            u.xel.setValue(u.xel.calcExpress(t.Expresses.value));
                            break;
                        case 'map':
                            break;
                    }
                    break;
                case 'filter':
                    switch (u.src) {
                        case 'set':
                            u.xel.onFormFillGridDataPrepared(u.rows);
                            break;
                        case 'value':
                            u.xel.onFilterChanged();
                            break;
                    }
                    break;
                case 'map':
                    if (u.xel && u.xel.doMap) {
                        var rows = u.xel.rows = u.rows || u.xel.rows,
                            options;

                        options = {
                            ups: ups,
                            cidx: cidx
                        };

                        u.xel.doMap(rows, options);

                        ups = options.ups;
                        cidx = options.cidx;
                    }
                    else if (t.Type == YZSoft.XForm.EleTypes.Button) {
                        if (!t.MultiSelect) {
                        }
                        else {
                            ups.splice(0, cidx);
                            cidx = 0;

                            var rows = u.xel.mapRows(u.rows);

                            var gpaths = t.MaptoGrids || [];
                            for (var i = 0; i < gpaths.length; i++) {
                                var grids = u.xel.getElesFromPath(gpaths[i].path) || [];

                                for (var j = 0; j < grids.length; j++) {
                                    var grid = grids[j];

                                    var sbi = 0;
                                    if (t.AppendModel == [button].AppendModel.Append) {
                                        sbi = grid.Blocks.length;
                                        grid.SetBlockCountPrivate(grid.Blocks.length + rows.length);
                                    }
                                    else if (t.AppendModel == [button].AppendModel.ClearAndAppend) {
                                        sbi = 0;
                                        grid.SetBlockCountPrivate(0);
                                        grid.SetBlockCountPrivate(rows.length);
                                    }
                                    else {
                                        if (grid.Blocks.length == 1 && !grid.Blocks[0].Key && !grid.isRowModified(0)) {
                                            sbi = 0;
                                            grid.SetBlockCountPrivate(0);
                                            grid.SetBlockCountPrivate(rows.length);
                                        }
                                        else {
                                            sbi = grid.Blocks.length;
                                            grid.SetBlockCountPrivate(grid.Blocks.length + rows.length);
                                        }
                                    }

                                    var cups = [];
                                    me.genLineNoUpdaters(grid, sbi, cups);
                                    me.genDeleteBlockUpdaters(grid, cups);
                                    for (var k = 0; k < rows.length; k++)
                                        me.genInsertBlockUpdaters(grid.Blocks[sbi + k], rows[k], cups);

                                    for (var k = 0; k < cups.length; k++)
                                        me.updaterArrayAdd(ups, cups[k], true);
                                }
                            }

                            me.expandUpdaters(ups);
                            ups = me.orderUpdaters(ups);
                        }
                    }
                    break;
            }
        }
        //xa.Debug.JS.Time150A = eval((new Date()).getTime() - timebegin1);
    },

    initFill: function () {
        var me = this;

        var rrow = {};
        for (var i = 0; i < me.FormTables.length; i++) {
            var table = me.FormTables[i];
            if (table.IsRepeatable) {
                var et = table.elType || {};
                if (me.FirstTimeUse ? !et.DataSource : true) {
                    var ptable = table.ParentTable;
                    var prows = [];
                    if (ptable) {
                        for (var j = 0; j < ptable.Rows.length; j++) {
                            var prow = ptable.Rows[j].DumpRow;
                            if (prow)
                                prows.push(prow);
                        }
                    }
                    else {
                        prows.push(rrow);
                    }

                    for (var j = 0; j < prows.length; j++) {
                        var prow = prows[j]
                        var ctname = me.combinTableName(table.DataSource, table.TableName);
                        prow._sys_child_tables = prow._sys_child_tables || {};
                        prow._sys_child_tables[ctname] = prow._sys_child_tables[ctname] || [];
                    }
                }
            }

            for (var j = 0; j < table.Rows.length; j++) {
                var dr = table.Rows[j];

                var wrow = rrow;
                if (table.IsRepeatable) {
                    wrow = null;
                    var prow = rrow;
                    if (table.ParentTable) {
                        var pdr = me.arrayContains(table.ParentTable.Rows, { RelationRowGuid: dr['RelationParentRowGuid'] });
                        prow = pdr ? pdr.DumpRow : rrow;
                    }

                    var ctname = me.combinTableName(table.DataSource, table.TableName);
                    if (prow && prow._sys_child_tables && prow._sys_child_tables[ctname]) {
                        var wtab = prow._sys_child_tables[ctname]
                        wrow = {};
                        wtab.push(wrow);
                    }
                }

                if (wrow) {
                    for (var colName in dr) {
                        var name = me.combinFieldName(table.DataSource, table.TableName, colName);
                        var value = dr[colName];
                        wrow[name] = value;
                    }
                    dr.DumpRow = wrow;
                }
            }
        }

        var ups = [];
        me.genInsertBlockUpdaters(me.RootBlock, rrow, ups);
        me.expandUpdaters(ups);
        ups = me.orderUpdaters(ups);
        //me.showUpdaters(ups);
        me.doUpdater(ups);
    },

    orderSortFunc: function (up1, up2) {
        var et1 = up1.xel.getEleType();
        var et2 = up2.xel.getEleType();
        return (et1.Orders[up1.tag] || -1) - (et2.Orders[up2.tag] || -1);
    },

    orderUpdaters: function (ups) {
        //return  ups.sort(this.orderSortFunc); 慢，下面的方法快
        var rv = [];
        var upsteam = [];
        var l = ups.length;
        for (var i = 0; i < l; i++) {
            var upi = ups[i];
            var et = upi.xel.getEleType();
            if (!et) continue; //例如开窗查询未设置DataMap
            var orderIndex = et.Orders[upi.tag] || -1;

            if (orderIndex == -1)
                rv.push(upi);
            else {
                upsteam[orderIndex] = upsteam[orderIndex] || []
                upsteam[orderIndex].push(upi);
            }
        }

        for (var i = 0; i < upsteam.length; i++) {
            var upsi = upsteam[i];
            if (upsi) {
                for (var j = 0; j < upsi.length; j++)
                    rv.push(upsi[j]);
            }
        }

        return rv;
    },

    combinFieldName: function (dsName, tableName, colName) {
        return Ext.String.trim((dsName ? (dsName + ':') : '') + tableName + '.' + colName || '').toLowerCase();
    },

    combinTableName: function (dsName, tableName) {
        return Ext.String.trim((dsName ? (dsName + ':') : '') + tableName).toLowerCase();
    },

    arrayFilter: function (arr, filter, returnMatchItem) {
        return this.self.arrayFilter.apply(this.self, arguments);
    },

    arrayContains: function (arr, itm) {
        return this.self.arrayContains.apply(this.self, arguments);
    },

    stringArrayContains: function (arr, n) {
        return this.self.stringArrayContains.apply(this.self, arguments);
    },

    objectMatchFilter: function (srcObject, filterObject) {
        return this.self.objectMatchFilter.apply(this.self, arguments);
    },

    objectEqu: function (object1, object2) {
        return this.self.objectEqu.apply(this.self, arguments);
    },

    updaterArrayAdd: function (ups, itm, cmpxel) {
        var me = this;

        if (!ups || !itm)
            return;

        var rv = { NewTag: false },
            f = false,
            len = ups.length;

        for (var i = 0; i < len; i++) {
            var upi = ups[i];
            if ((cmpxel === false || itm.xel == upi.xel) && (itm.tag == upi.tag)) {
                if (me.ValuePriority[itm.src] > me.ValuePriority[upi.src])
                    ups.splice(i, 1, itm);
                f = true;
                break;
            }
        }

        if (!f) {
            rv.NewTag = true;
            ups.push(itm);
        }

        return rv;
    },

    updaterArrayAddExt: function (ups, upidxs, itm) { //大数据量效率更高，优于updaterArrayAdd，特别是在IE上
        var me = this;

        if (!ups || !itm)
            return;

        var rv = { NewTag: false };
        var f = false;
        var id = itm.xel ? itm.xel.id : 0;
        var upidx = upidxs[id];

        if (upidx) {
            var len = upidx.length;
            for (var i = 0; i < len; i++) {
                var upi = upidx[i];
                if (itm.xel == upi.xel && itm.tag == upi.tag) {
                    if (me.ValuePriority[itm.src] > me.ValuePriority[upi.src])
                        upidx.splice(i, 1, itm);
                    f = true;
                    break;
                }
            }
        }

        if (!f) {
            rv.NewTag = true;
            ups.push(itm);
            if (!upidx)
                upidx = upidxs[id] = [];
            upidx.push(itm);
        }

        return rv;
    },

    uniqueRows: function (rows, prop) {
        if (!rows)
            return [];

        var rv = [];
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            var v = r[prop];

            var c = false;
            for (var j = 0; j < rv.length; j++) {
                if (rv[j][prop] == v) {
                    c = true;
                    break;
                }
            }

            if (!c)
                rv.push(r);
        }

        return rv;
    },

    findGridFromTableName: function (del, tableName) {
        var me = this;

        for (var i = 0; i < me.EleTypes.length - 1; i++) {
            var et = me.EleTypes[i],
                gd = et.GridDefine;

            if (!gd || !gd.AllowAddRecord || !gd.WriteToTable || !String.Equ(tableName, gd.WriteToTable.TableName))
                continue;

            var block = me.getParentBlock(del);
            var delpath = block.toETBlock().getPath().concat(0);
            var rpath = me.toRelativePath(delpath, et.getPath());

            var xel = new YZSoft.forms.field.Element(me);
            xel.ParentBlock = block;

            var grids = xel.getElesFromPath(rpath);
            return grids[0];
        }
    },

    appendBlock: function (del, tableName) {
        var me = this,
            grid;

        grid = me.findGridFromTableName(del, tableName);
        if (!grid)
            return;

        grid.appendBlock(1);
    },

    newDataBind: function () {
        var me = this;

        me.NewVarIndex = me.NewVarIndex || 1;
        var databind = '_sys_var_' + me.NewVarIndex;
        me.NewVarIndex++;

        return databind;
    },

    saveGridDefine: function () {
        var me = this;

        var len = me.Eles.length;
        for (var i = 0; i < len; i++) {
            var xel = me.Eles[i];

            if (xel.saveGridDefine)
                xel.saveGridDefine();
        }
    },

    linkDataBindToColumn: function () {
        var me = this;

        var vr = me.VarDataColumnMap = {};
        for (var i = 0; i < me.FormTables.length; i++) {
            var t = me.FormTables[i];
            for (var j = 0; j < t.Columns.length; j++) {
                var c = t.Columns[j];
                var name = me.combinFieldName(t.DataSource, t.TableName, c.ColumnName);
                vr[name] = c;
            }
        }

        var len = me.EleTypes.length;
        for (var i = 0; i < len; i++) {
            var et = me.EleTypes[i];
            if (et.DataBind) {
                et.DataBind.DataColumn = vr[et.DataBind.nameLow];
                if (et.DataBind.DataColumn && et.ParentBlock.ParentElement && !et.DataBind.DataColumn.ParentTable.IsRepeatable)
                    YZSoft.Error.raise(RS.$('Form_Grid_BindNoRepeatableVar'), et.DataBind.name);
            }
        }
    },

    deleteBlockEles: function (block) {
        var me = this;

        for (var i = 0; i < block.Eles.length; i++) {
            var xel = block.Eles[i];
            xel.dom = null;

            if (xel.Blocks) {
                for (var j = 0; j < xel.Blocks.length; j++)
                    me.deleteBlockEles(xel.Blocks[j]);
            }
        }
    },

    copyBlock: function (block, copychild) {
        var me = this;

        rec = {};
        for (var i = 0; i < block.Eles.length; i++) {
            var xel = block.Eles[i];
            var et = xel.getEleType();

            if (!et.DataBind || et.NoCopy)
                continue;

            rec[et.DataBind.nameLow] = xel.getValue();
            if (copychild !== false) {
                if (et.WriteToTable) {
                    var ctname = me.combinTableName(et.WriteToTable.DataSource, et.WriteToTable.TableName);
                    rec._sys_child_tables = rec._sys_child_tables || {};
                    rec._sys_child_tables[ctname] = rec._sys_child_tables[ctname] || [];
                    for (var j = 0; j < xel.Blocks.length; j++) {
                        var crec = copyBlock(xel.Blocks[j]);
                        rec._sys_child_tables[ctname].push(crec);
                    }
                }
            }
        }

        return rec;
    },

    genInsertBlockUpdaters: function (block, row, ups, genlnoup, blockIndex) {
        if (!ups)
            return;

        var me = this;

        row = row || {};

        var gd = (block && block.ParentElement && block.ParentElement.getEleType()) ? block.ParentElement.getEleType().GridDefine : null;
        if (gd && gd.WriteToTable) {
            var wt = gd.WriteToTable;
            for (var i = 0; i < wt.PrimaryColumns.length; i++) {
                var c = wt.PrimaryColumns[i];
                if (c.FullNameLow in row) {
                    block.Key = block.Key || {};
                    block.CKeyName = c.ColumnName;
                    block.CKeyValue = block.Key[c.ColumnName] = row[c.FullNameLow];
                }
            }
        }

        var len = block.Eles.length;
        for (var i = 0; i < len; i++) {
            var xel = block.Eles[i],
                et = xel.getEleType(),
                af = et.affectFrom || {},
                vflag = false,
                elups = [{ xel: xel, src: 'none', tag: 'value'}];

            if (et.HiddenExpress)
                elups.push({ xel: xel, src: 'value', tag: 'hide' });

            if (et.DisableExpress)
                elups.push({ xel: xel, src: 'value', tag: 'disable' });

            for (var afn in af) {
                var afitms = af[afn] || [],
                    aflen = afitms.length;

                for (var j = 0; j < aflen; j++) {
                    var afi = afitms[j];
                    me.updaterArrayAdd(elups, { xel: xel, tag: afi.tag, src: afi.src, trigger: true }, false);
                }
            }

            if (genlnoup === true && et.isGridLineNo && gd) {
                me.updaterArrayAdd(elups, { xel: xel, tag: 'value', src: 'set', value: xel.getLineNo(blockIndex) }, false);
            }
            else {
                var bd = et.DataBind;
                if (bd && bd.DataColumn && bd.DataColumn.DefaultValue)
                    me.updaterArrayAdd(elups, { xel: xel, tag: 'value', src: 'default', value: bd.DataColumn.DefaultValue }, false);

                if (et.DataBind) {
                    var v = row[et.DataBind.nameLow];
                    if (Ext.isDefined(v)) {
                        me.updaterArrayAdd(elups, { xel: xel, tag: 'value', src: 'set', value: v }, false);
                    }
                }
            }

            if (et.GridDefine) {
                var w = et.GridDefine.WriteToTable,
                    rows = (w && row._sys_child_tables) ? row._sys_child_tables[me.combinTableName(w.DataSource, w.TableName)] : null;

                if (rows) {
                    me.updaterArrayAdd(elups, { xel: xel, tag: 'filter', src: 'set', rows: rows }, false);
                }
                else if (!me.arrayContains(elups, { tag: 'filter', src: 'value' })) {
                    elups.push({ xel: xel, tag: 'filter', src: 'set', rows: [] });
                }
            }

            var lenups = elups.length;
            for (var j = 0; j < lenups; j++)
                ups.push(elups[j]);
        }
    },

    genDeleteBlockUpdaters: function (xel, ups) {
        if (!ups)
            return;

        var me = this,
            et = xel.getEleType();

        if (!et)
            return;

        var ets = et.Blocks[0].Eles;
        for (var i = 0; i < ets.length; i++) {
            var cet = ets[i];
            var affs = cet.affectTo ? cet.affectTo.value : null;
            if (!affs)
                continue;

            for (var j = 0; j < affs.length; j++) {
                var aff = affs[j];
                if (aff.path && aff.path[0] != '.')
                    continue;

                var cels = xel.getElesFromPath(aff.path, 1);
                for (var k = 0; k < cels.length; k++) {
                    var cel = cels[k];
                    me.updaterArrayAdd(ups, { xel: cel, tag: aff.tag, src: 'value' })
                }
            }
        }
    },

    genLineNoUpdaters: function (xel, blockIndex, ups, counts) {
        if (!ups)
            return;

        var et = xel.getEleType();
        var gd = et.GridDefine;
        if (!gd || !gd.LineNo)
            return;

        var c = counts ? counts : xel.Blocks.length - blockIndex;
        for (var i = 0; i < c; i++) {
            linenoXEL = xel.Blocks[blockIndex + i].Eles[gd.LineNo.Offset];
            ups.push({ xel: linenoXEL, tag: 'value', src: 'set', value: linenoXEL.getLineNo(blockIndex + i) });
        }
    },

    parseDataType: function (stype) {
        return this.DataTypeMap[(stype || '').toLowerCase()] || YZSoft.XForm.DataType.String;
    },

    parseFieldInfo: function (db) {
        var rv = {};

        var dc = db.DataColumn;
        if (dc) {
            rv.IsVar = false;
            rv.ColumnName = dc.ColumnName;
            rv.TableName = dc.ParentTable.TableName;
            rv.DataSource = dc.ParentTable.DataSource;
        }
        else {
            rv.IsVar = true;
            var n = Ext.String.trim(db.name || '');
            var idx = n.indexOf(':');
            rv.DataSource = idx == -1 ? '' : Ext.String.trim(n.substring(0, idx));
            n = idx == -1 ? n : Ext.String.trim(n.sunstring(idx + 1));
            idx = n.indexOf('.');
            rv.TableName = idx == -1 ? '' : Ext.String.trim(n.substring(0, idx));
            rv.ColumnName = idx == -1 ? n : Ext.String.trim(n.substring(idx + 1));
        }

        return rv;
    },

    hookInputCheck: function () {
        var me = this;

        var len = me.EleTypes.length;
        for (var i = 0; i < len; i++) {
            var et = me.EleTypes[i];
            if (et && et.xel && et.xel.createInputChecker)
                et.inputChecker = et.xel.createInputChecker(et);
        }

        len = me.Eles.length;
        for (var i = 0; i < len; i++) {
            var xel = me.Eles[i];
            var et = xel.getEleType();
            var ichk = et.inputChecker;
            if (ichk && ichk.DisableIME)
                ichk.disableIME(xel, true);
        }
    },

    initElements: function () {
        var me = this;

        var len = me.Eles.length;
        for (var i = 0; i < len; i++) {
            var xel = me.Eles[i];
            if (xel.initEleType)
                xel.initEleType();
        }
    },

    postInitElements: function () {
        var me = this;

        var len = me.Eles.length;
        for (var i = 0; i < len; i++) {
            var xel = me.Eles[i];
            xel.onReady();
        }
    },

    init: function () {
        var me = this;
        Ext.onReady(function () {
            me.onDocumentComplete()
        });
    },

    onDocumentComplete: function () {
        var me = this,
            ms = RS.$('All_UnitMS');

        if (me.DocumentCompleted)
            return;

        me.Debug = { JS: {} };
        me.DocumentCompleted = true;

        var js = me.Debug.JS;
        var timebegin = (new Date()).getTime();
        me.initEnv();

        js.Time1 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.registerMemVar('Global.StepName', '')
        me.registerMemVar('Global.ReferStep', '')
        js.Time2 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        var allEles = document.body.getElementsByTagName('*');
        js.Time3 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.catchEleTypes(allEles);
        js.Time4 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();

        me.bufferFormData();
        js.Time5 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();

        me.buildXFormDOM(me.RootBlock, me.Eles);
        js.Time6 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.copyEleTypeDOMFromXFormDOM();
        js.Time7 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.compile();
        js.Time8 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.buildSetValueOrder();
        js.Time9 = eval((new Date()).getTime() - timebegin);
        imebgein = (new Date()).getTime();

        //数据加载后
        me.linkDataBindToColumn();
        js.Time10 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.initElements();
        me.applyDataControlInfo();
        js.Time11 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.hookInputCheck();
        js.Time12 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.beforeSaveGridDefine();
        //UpdateStaticSelectOptions();
        js.Time13 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.saveGridDefine();

        me.postInitElements();

        me.sortFormTable();
        js.Time14 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();

        me.initFill();
        js.Time15 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();

        me.saveDefaultValue();
        js.Time16 = eval((new Date()).getTime() - timebegin);
        timebegin = (new Date()).getTime();
        me.fireEvent('ready');
        js.Time17 = eval((new Date()).getTime() - timebegin);

        me.activeProcessButtons();

        me.showSpoorMarks();

        if (typeof (OnAfterLoad) != 'undefined') {
            OnAfterLoad();
        }

        var dinfos = [];
        me.LoadDataTime = me.LoadDataTime || {};

        var lds = 0;
        dinfos.push('LoadData:');
        for (var p in me.Debug.LoadData) {
            var t = parseInt(me.Debug.LoadData[p]);
            dinfos.push(p + ':' + t + ms);
            lds += t;
        }

        var tts = 0;
        dinfos.push('JS:');
        for (var p in js) {
            var t = parseInt(js[p]);
            dinfos.push(p + ':' + t + ms);
            tts += t;
        }

        dinfos.push('Summary:');
        dinfos.push('Total:' + tts + ms);
        dinfos.push('Load Data:' + lds + ms);
        dinfos.push('JS:' + (tts - lds) + ms);

        //YZSoft.Error.ShowResponseError('Message','Form Load Time:',dinfos.join('<br/>'));
        //window.status = 'Total:' + tts + '毫秒；' + 'Load Data:' + lds + '毫秒；'+ 'JS:' + (tts-lds) + ms;
    },

    sortFormTable: function () {
        var me = this,
            tbs = [];

        while (me.FormTables.length != 0) {
            for (var i = 0; i < me.FormTables.length; i++) {
                var tb = me.FormTables[i];
                if (!tb.ParentTable || me.arrayContains(tbs, tb.ParentTable)) {
                    tbs.push(tb);
                    me.FormTables.splice(i, 1);
                    i--;
                    continue;
                }
            }
        }

        me.FormTables = tbs;
    },

    saveDefaultValue: function () {
        var me = this,
            len = me.Eles.length;

        for (var i = 0; i < len; i++) {
            var xel = me.Eles[i];
            if (!xel.dom) //xel已删除
                continue;

            if (xel.saveDefaultValue)
                xel.saveDefaultValue();
        }
    },

    getSeek: function (n) {
        var s = this.Seeks = this.Seeks || {};
        s[n] = s[n] || 0;
        s[n]++;
        return s[n];
    },

    getParentRow: function (domel) {
        while (domel) {
            if (domel.tagName == 'TR')
                break;
            domel = domel.parentNode;
        }
        return domel;
    },

    getParentTable: function (domel) {
        while (domel) {
            if (domel.tagName == 'TABLE')
                break;
            domel = domel.parentNode;
        }
        return domel;
    },

    getParentBlock: function (domel) {
        var me = this;

        while (domel) {
            var row = me.getParentRow(domel);
            if (!row)
                break;

            var table = me.getParentTable(row),
                xtable = me.tryGetChechedEle(table);

            if (xtable) {
                var et = xtable.getEleType();

                if (et && et.GridDefine) {
                    var ridx = row.rowIndex,
                        bidx = xtable.getBlockIndexFromRowIndex(ridx);

                    if (bidx != -1)
                        return xtable.Blocks[bidx];
                }
            }

            domel = table;
        }

        return me.RootBlock;
    },

    getParentBlockET: function (domel) {
        return this.getParentBlock(domel).toETBlock();
    },

    calcExpress: function (domel, express) {
        var me = this,
            block = me.getParentBlock(domel);

        return block.calcExpress(express);
    },

    activeProcessButtons: function () {
        var cs = document.getElementsByName('_sys_processbtns_container');
        for (var i = 0; i < cs.length; i++) {
            var c = cs[i];

            var els = c.getElementsByTagName('INPUT');
            for (var j = 0; j < els.length; j++) {
                var el = els[j];
                if (el.type == 'button' && el.getAttribute('EnableAfterLoad') == 'true')
                    el.disabled = false;
            }
        }
    },

    //aa1aa开始
    postPrepareFormData: function (rv) {
        var me = this,
            rv = rv.FormData = {},
            errs = [];

        for (var i = 0; i < me.RootBlock.Eles.length; i++) {
            var xel = me.RootBlock.Eles[i],
                et = xel.getEleType();

            if (et.DataBind && et.DataBind.DataColumn) {
                var fi = me.parseFieldInfo(et.DataBind);
                //fi.TableName = fi.TableName || 'Global';
                if (String.Equ(fi.TableName, 'Global'))
                    continue;

                var tb = rv[fi.TableName] = rv[fi.TableName] || {},
                    value = tb[fi.ColumnName] = xel.getValue();

                if (et.inputChecker) {
                    var chk = et.inputChecker.check(value, true);
                    if (!chk.success) {
                        errs.push({
                            xel: xel,
                            value: value,
                            msg: chk.err || Ext.String.format(RS.$('Form_Error_DataNotMatchType'), value, et.DataBind.DataColumn.CType)
                        });
                    }
                }
            }

            me.saveChildBlocksIfExist(rv, xel, et, errs);
        }

        return errs;
    },

    saveChildBlocksIfExist: function (rv, xel, et, errs) {
        et = et || xel.getEleType();

        var me = this,
            gd = et.GridDefine;

        if (gd && gd.WriteToTable) {
            rv[gd.WriteToTable.TableName] = rv[gd.WriteToTable.TableName] || [];

            for (var j = 0; j < xel.Blocks.length; j++) {
                var ridx = (rv[gd.WriteToTable.TableName] || []).length;
                var b = xel.Blocks[j];
                for (var k = 0; k < b.Eles.length; k++) {
                    var cxel = b.Eles[k];
                    var cet = cxel.getEleType();

                    if (cet.DataBind && cet.DataBind.DataColumn) {
                        var fi = me.parseFieldInfo(cet.DataBind);
                        //fi.TableName = fi.TableName || gd.WriteToTable.TableName;
                        if (String.Equ(fi.TableName, 'Global'))
                            continue;

                        var tb = rv[fi.TableName] = rv[fi.TableName] || [];
                        var r = tb[ridx];
                        if (!r) {
                            r = {};
                            tb.push(r);

                            r.RelationRowGuid = b.getBlockID();
                            r.RowPrimaryKeys = Ext.Object.toQueryString(b.Key || {});

                            var pb = b.ParentElement.ParentBlock;
                            if (pb.ParentElement) {
                                r.RelationParentRowGuid = pb.getBlockID();
                            }
                        }
                        var value = r[fi.ColumnName] = cxel.getValue();

                        if (cet.inputChecker) {
                            var chk = cet.inputChecker.check(value, true);
                            if (!chk.success) {
                                errs.push({
                                    xel: cxel,
                                    value: value,
                                    msg: Ext.String.format(RS.$('Form_Error_DataNotMatchType'), value, cet.DataBind.DataColumn.CType)
                                });
                            }
                        }
                    }

                    me.saveChildBlocksIfExist(rv, cxel, null, errs);
                }
            }
        }
    },
    //aa1aa结束

    getKey: function () {
        return this.Params.Key;
    },

    getSerialNum: function () {
        return this.Params.SN;
    },

    convertValue: function (v, vr) {
        var dt = YZSoft.XForm.DataType;
        var dc = vr.DataColumn || { Type: vr.elType.defaultDataType || (YZSoft.Utility.isNumber(v) ? dt.Decimal : dt.String) };
        switch (dc.Type) {
            case dt.Decimal:
            case dt.Double:
            case dt.Single:
                try { v = parseFloat(v || 0) } catch (e) { v = 0.0 };
                break;
            case dt.Int16:
            case dt.Int32:
            case dt.Int64:
            case dt.SByte:
            case dt.UInt16:
            case dt.UInt32:
            case dt.UInt64:
            case dt.Byte:
                try { v = parseInt(v || 0) } catch (e) { v = 0 };
                break;
            case dt.Boolean:
                try { v = parseInt(v || 0) } catch (e) { v = 0 };
                break;
            case dt.DateTime:
            case dt.String:
            case dt.Binary:
                v = v || ''
                break;
        }
        return v;
    },

    isFieldWritable: function (del) {
        var xel = this.tryGetChechedEle(del);
        if (!xel)
            return true;

        var et = xel.getEleType();
        if (!et)
            return true;

        return et.canWrite();
    },

    getFieldInfo: function (xel) {
        if (!xel)
            return null;

        var et = xel.getEleType(),
            table = et.DataBind.DataColumn.ParentTable,
            info;

        if (!table.IsRepeatable)
            info = { CKeyName: table.CKeyName, CKeyValue: table.CKeyValue };
        else
            info = { CKeyName: xel.ParentBlock.CKeyName, CKeyValue: xel.ParentBlock.CKeyValue };

        info.Column = et.DataBind.DataColumn;
        return info;
    },

    onDataAvailable: function (xel) {
        var me = this;

        if (!xel)
            return;

        var rows = xel.mapvalues;
        if (!Ext.isArray(rows)) {
            rows = [];
            rows.push(xel.mapvalues);
        }

        var up = { xel: xel, tag: 'map', src: 'set', rows: rows };
        var ups = [up];

        me.expandUpdaters(ups);
        ups = me.orderUpdaters(ups);
        Ext.Array.remove(ups, up);
        ups.splice(0, 0, up);

        me.doUpdater(ups);
    },

    onInputChanged: function (el) {
        if (!el)
            return;

        var xel = el.isElement ? el : this.tryGetChechedEle(el);
        if (!xel)
            return;

        var ups = xel.genValueChangeUpdater();
        this.expandUpdaters(ups);

        ups = this.orderUpdaters(ups);
        this.doUpdater(ups);
    },

    showUpdaters: function (ups) {
        var s = [];
        Ext.each(ups, function (up) {
            s.push({ id: up.xel.dom.id, bind: up.xel.elType.sDataBind || '', el: up.xel.$className, tag: up.tag, src: up.src });
        });

        var strs = [];
        Ext.each(s, function (item) {
            strs.push(Ext.encode(item));
        });

        YZSoft.alert(strs.join('<br/>'));
    },

    showOrderInfo: function () {
        var me = this,
            orders = [];

        for (var i = 0; i < me.EleTypes.length; i++) {
            var et = me.EleTypes[i];
            var eto = et.Orders;
            for (var p in eto) {
                Ext.each(eto[p], function (o) {
                    orders.push({ e: et.sTagNameLow, p: p, bind: et.sDataBind, index: o });
                });
            }
        }
        alert(Ext.encode(orders));
    },

    tryGetChechedEle: function (domel, create) {
        var me = this;

        if (!domel || !domel.getAttribute)
            return null;

        var index = YZSoft.forms.field.Element.getAttributeNumber(domel, 'xform_xele_index');

        if (index != -1)
            return this.Eles[index];

        if (create === true) {
            var xclass = YZSoft.forms.field.Element.getXClass(domel);
            if (xclass)
                return Ext.create(xclass, me, domel);

            return new YZSoft.forms.field.Element(me, domel);
        }

        return null;
    },

    setEleValue: function (id, value) {
        var me = this,
            xel = me.tryGetChechedEle(document.getElementById(id), true);

        if (xel)
            xel.setValue(value);
    },

    getComments: function () {
        return null;
    },

    onmessage: function (e, data) {
        data = data || (((Ext.isString(e.data) && e.data[0] == '{') ? Ext.decode(e.data) : e.data));

        if (!data || data.channel != 'BPM:1010')
            return;

        var me = this,
            params = data.params;

        if (params.method == 'call') {
            var method = params.callmethod,
                params = params.params;

            //握手
            e.source.postMessage(Ext.encode({
                channel: 'BPM:2020',
                params: {
                    result: 'hello-ok!' //代表系统会响应此消息，请等待
                }
            }), '*');

            try {
                var callFunc = me[method];

                if (!callFunc) {
                    e.source.postMessage(Ext.encode({
                        channel: 'BPM:2020',
                        params: {
                            result: 'notImplement'  //表单未实现此方法
                        }
                    }), '*');
                }
                else {
                    callFunc.call(me, params, function (data) {
                        e.source.postMessage(Ext.encode({
                            channel: 'BPM:2020',
                            params: {
                                result: 'success',
                                data: data
                            }
                        }), '*');
                    }, function (errorMessage) {
                        e.source.postMessage(Ext.encode({
                            channel: 'BPM:2020',
                            params: {
                                result: 'failure',
                                errorMessage: errorMessage || false
                            }
                        }), '*');
                    });
                }
            }
            catch (err) {
                var errorMessage = Ext.isString(err) ? err : err.msg || err.message;

                Ext.log({
                    msg: errorMessage,
                    level: 'error',
                    dump: err.stack,
                    stack: false
                });

                e.source.postMessage(Ext.encode({
                    channel: 'BPM:2020',
                    params: {
                        result: 'failure',
                        errorMessage: errorMessage
                    }
                }), '*');
            }
        }
        else if (params.method == 'fire') {
            params.method = 'call';
            params.callmethod = params.event;
            me.onmessage(e, data);
        }
        else {
            e.source.postMessage(Ext.encode({
                channel: 'BPM:2020',
                params: {
                    result: 'notImplement'
                }
            }), '*');
        }
    },

    /*
    params:{
    action: link.DisplayString,
    validationGroup: link.ValidationGroup,
    data: data
    }
    */
    //OnBeforePost
    post: function (params, success, fail) {
        var me = this,
            action = params.action,
            validationGroup = params.validationGroup,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforePost', action, validationGroup, params) === false ||
            me.fireEvent('beforeSubmit', 'Post', action, validationGroup, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //验证控件验证
        if (!me.validator.submitValidate(validationGroup)) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('Post', action, validationGroup, data, params.data, params) === false ||
            me.fireEvent('Submit', 'Post', action, validationGroup, data, params.data, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterPost: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterPost', params);
        me.fireEvent('afterSubmit', 'Post', params);
        success.call(me);
    },

    /*
    params:{
    action: link.DisplayString,
    validationGroup: link.ValidationGroup,
    data: data
    }
    */
    process: function (params, success, fail) {
        var me = this,
            action = params.action,
            validationGroup = params.validationGroup,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeProcess', action, validationGroup, params) === false ||
            me.fireEvent('beforeSubmit', 'Process', action, validationGroup, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //验证控件验证
        if (!me.validator.submitValidate(validationGroup)) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('Process', action, validationGroup, data, params.data, params) === false ||
            me.fireEvent('Submit', 'Process', action, validationGroup, data, params.data, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterProcess: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterProcess', params);
        me.fireEvent('afterSubmit', 'Process', params);
        success.call(me);
    },

    /*
    params:{
    action: link.DisplayString,
    validationGroup: link.ValidationGroup,
    data: data
    }
    */
    directSend: function (params, success, fail) {
        var me = this,
            validationGroup = params.validationGroup,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeDirectSend', validationGroup) === false ||
            me.fireEvent('beforeSubmit', 'DirectSend', '', validationGroup, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //验证控件验证
        if (!me.validator.submitValidate(validationGroup)) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('DirectSend', validationGroup, data, params.data) === false ||
            me.fireEvent('Submit', 'DirectSend', '', validationGroup, data, params.data, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterDirectSend: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterDirectSend', params);
        success.call(me);
    },

    informSubmit: function (params, success, fail) {
        var me = this,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeInformSubmit') === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('InformSubmit', data, params.data) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterInformSubmit: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterInformSubmit', params);
        success.call(me);
    },

    indicateSubmit: function (params, success, fail) {
        var me = this,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeIndicateSubmit') === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('IndicateSubmit', data, params.data) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterIndicateSubmit: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterIndicateSubmit', params);
        success.call(me);
    },

    /*
    params:{
    validationGroup:,
    data: data
    }
    */
    saveFormApplication: function (params, success, fail) {
        var me = this,
            validationGroup = params.validationGroup,
            result,
            data;

        data = {
            Header: {
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeSaveFormApplication', validationGroup, params.data, params) === false ||
            me.fireEvent('beforeSubmit', 'SaveFormApplication', validationGroup, params.data, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //验证控件验证
        if (!me.validator.submitValidate(validationGroup)) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('SaveFormApplication', validationGroup, data, params.data, params) === false ||
            me.fireEvent('Submit', 'SaveFormApplication', '', validationGroup, data, params.data, params) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterSaveFormApplication: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterSaveFormApplication', params);
        me.fireEvent('afterSubmit', 'SaveFormApplication', params);
        success.call(me);
    },

    saveAsDraft: function (params, success, fail) {
        var me = this,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeSaveAsDraft') === false ||
            me.fireEvent('beforeSaveDraft', 'SaveAsDraft') === false ||
            me.fireEvent('beforeSave', 'SaveAsDraft') === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('SaveAsDraft', data, params.data) === false ||
            me.fireEvent('SaveDraft', 'SaveAsDraft', data, params.data) === false ||
            me.fireEvent('Save', 'SaveAsDraft', data, params.data) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterSaveAsDraft: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterSaveAsDraft', params);
        me.fireEvent('afterSaveDraft', 'SaveAsDraft', params);
        me.fireEvent('afterSave', 'SaveAsDraft', params);
        success.call(me);
    },

    saveDraft: function (params, success, fail) {
        var me = this,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeSaveDraft', 'SaveDraft') === false ||
            me.fireEvent('beforeSave', 'SaveAsDraft') === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('SaveDraft', 'SaveDraft', data, params.data) === false ||
            me.fireEvent('Save', 'SaveDraft', data, params.data) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterSaveDraft: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterSaveDraft', 'SaveDraft', params);
        me.fireEvent('afterSave', 'SaveDraft', params);
        success.call(me);
    },

    saveAsFormTemplate: function (params, success, fail) {
        var me = this,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeSaveAsFormTemplate') === false ||
            me.fireEvent('beforeSaveDraft', 'SaveAsFormTemplate') === false ||
            me.fireEvent('beforeSave', 'SaveAsFormTemplate') === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('SaveAsFormTemplate', data, params.data) === false ||
            me.fireEvent('SaveDraft', 'SaveAsFormTemplate', data, params.data) === false ||
            me.fireEvent('Save', 'SaveAsFormTemplate', data, params.data) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterSaveAsFormTemplate: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterSaveAsFormTemplate', params);
        me.fireEvent('afterSaveDraft', 'SaveAsFormTemplate', params);
        me.fireEvent('afterSave', 'SaveAsFormTemplate', params);
        success.call(me);
    },

    saveAsTestingTemplate: function (params, success, fail) {
        var me = this,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeSaveAsTestingTemplate') === false ||
            me.fireEvent('beforeSaveDraft', 'SaveAsTestingTemplate') === false ||
            me.fireEvent('beforeSave', 'SaveAsTestingTemplate') === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('SaveAsTestingTemplate', data, params.data) === false ||
            me.fireEvent('SaveDraft', 'SaveAsTestingTemplate', data, params.data) === false ||
            me.fireEvent('Save', 'SaveAsTestingTemplate', data, params.data) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterSaveAsTestingTemplate: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterSaveAsTestingTemplate', params);
        me.fireEvent('afterSaveDraft', 'SaveAsTestingTemplate', params);
        me.fireEvent('afterSave', 'SaveAsTestingTemplate', params);
        success.call(me);
    },

    save: function (params, success, fail) {
        var me = this,
            validationGroup = params.validationGroup,
            result,
            data;

        data = {
            Header: {
                Comment: me.getComments()
            }
        };

        //验证前事件
        result = !(
            me.fireEvent('beforeSave') === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        //验证控件验证
        if (params.validation) {
            if (!me.validator.submitValidate(validationGroup)) {
                fail.call(me);
                return;
            }
        }

        //获得数据
        var errs = me.postPrepareFormData(data);

        //基础数据格式验证
        if (errs.length != 0) {
            var err = errs[0];
            me.validator.reportError(err.xel.dom, err.msg);
            fail.call(me);
            return;
        }

        //验证后事件
        result = !(
            me.fireEvent('Save', 'Save', data, params.data) === false
        );

        if (result === false) {
            fail.call(me);
            return;
        }

        success.call(me, data);
    },

    afterSave: function (params, success, fail) {
        var me = this;
        me.fireEvent('afterSave', 'Save', params);
        success.call(me);
    },

    positionChange: function (params, success, fail) {
        var me = this;
        me.fireEvent('positionChange', params.newPosition);
        success.call(me);
    }
}, function () {
    agent = new this({});

    agent.validator = YZSoft.forms.src.Validator;
    agent.validator.init(agent);

    Ext.require([
        'YZSoft.forms.field.TextBox',
        'YZSoft.forms.src.InputChecker',
        'YZSoft.forms.field.DateTimePicker',
        'YZSoft.forms.field.ImageAttachment',
        'YZSoft.src.ux.WindowManager',
        'YZSoft.forms.field.Attachments',
        'YZSoft.src.ux.File',
        'YZSoft.forms.field.GridBase',
        'YZSoft.forms.field.Grid',
        'YZSoft.forms.field.BrowserButtonBase',
        'YZSoft.forms.field.DataBrowserButton',
        'YZSoft.forms.field.Button'
    ]);
});

agent.init();
XFormOnDataAvailable = agent.onDataAvailable;

XFormOnChange = function (el) {
    agent.fireEvent('inputChange', el);
};

//实测IE10不支持
//Ext.getWin().on({
//    message: function (e) {
//        agent.onmessage(e.event);
//    }
//});

if (window.addEventListener)
    window.addEventListener('message', function (e) { agent.onmessage(e) }, false);
else if (window.attachEvent)
    window.attachEvent('onmessage', function (e) { agent.onmessage(e) });