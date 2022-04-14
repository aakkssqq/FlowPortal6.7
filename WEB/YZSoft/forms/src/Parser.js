var Parser = (function (scope) {
    var ItemType_None = 0;
    var ItemType_Value = 1;
    var ItemType_Operator = 2;
    var ItemType_Function = 3;

    var PRI_OPENBRACKET = -1;
    var PRI_LOWEST = 0;
    var PRI_BELOWADD = 1;
    var PRI_ADD = 2;
    var PRI_MULT = 3;
    var PRI_EXP = 4;
    var PRI_UNARY = 5;
    var PRI_FCT = 6;

    function AddOp(a, b) {
        //alert(18101.74 * 100)
        var r1, r2, m;
        try { r1 = a.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = b.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2))
        return (Math.round(a * m) + Math.round(b * m)) / m;
    }
    function SubOp(a, b) {
        //alert(11.7 - 11);
        var r1, r2, m, n;
        try { r1 = a.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = b.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return ((Math.round(a * m) - Math.round(b * m)) / m).toFixed(n);
    }
    function MultOp(a, b) {
        //alert(64.2 * 23);
        var m = 0, s1 = a.toString(), s2 = b.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }
    function DivOp(a, b) {
        if (b == 0)
            return NaN;

        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = a.toString().split(".")[1].length } catch (e) { }
        try { t2 = b.toString().split(".")[1].length } catch (e) { }
        with (Math) {
            r1 = Number(a.toString().replace(".", ""))
            r2 = Number(b.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }
    function MinusOp(a) {
        return -a;
    }
    function ModOp(a, b) {
        return a % b;
    }
    function GreaterThanOp(a, b) {
        return a > b;
    }
    function LesserThanOp(a, b) {
        return a < b;
    }
    function GreaterEquOp(a, b) {
        return a >= b;
    }
    function LesserEquOp(a, b) {
        return a <= b;
    }
    function NotEquOp(a, b) {
        return a != b;
    }
    function AndOp(a, b) {
        return a && b;
    }
    function OrOp(a, b) {
        return a || b;
    }
    function NotOp(a) {
        return !a;
    }
    function EquOp(a, b) {
        return a == b;
    }
    function ifFn(c, a, b) {
        return c ? a : b;
    }
    function javascriptFn(fnname, a, b) {
        var args = Ext.toArray(arguments, 1);
        var f;
        try {
            f = eval(fnname);
        }
        catch (e) {
            YZSoft.Error.raise(RS.$('Form_Express_FuncNoDefine'), fnname);
        }
        return f.apply(undefined, args);
    }
    function minFn(vs) {
        if (vs.length == 0)
            vs.push(0);
        return Math.min.apply(undefined, vs);
    }
    function maxFn(vs) {
        if (vs.length == 0)
            vs.push(0);
        return Math.max.apply(undefined, vs);
    }
    function sumFn(vs) {
        //alert(87.70 + 54.50 + 131.60)
        var rv = 0;
        for (var i = 0; i < vs.length; i++)
            rv = AddOp(rv, Number(vs[i]));

        return rv;
    }
    function avgFn(vs) {
        var rv = 0;
        for (var i = 0; i < vs.length; i++)
            rv = AddOp(rv, Number(vs[i]));

        return vs.length ? DivOp(rv, vs.length) : 0;
    }
    function Parser() {
        this.ops = [
		    { fn: AddOp, pri: PRI_ADD, symbol: '+', unary: false },
		    { fn: SubOp, pri: PRI_ADD, symbol: '-', unary: false },
		    { fn: MultOp, pri: PRI_MULT, symbol: '*', unary: false },
		    { fn: DivOp, pri: PRI_MULT, symbol: '/', unary: false },
		    { fn: Math.pow, pri: PRI_EXP, symbol: '^', unary: false },
		    { fn: MinusOp, pri: PRI_UNARY, symbol: '-', unary: true },
		    { fn: ModOp, pri: PRI_MULT, symbol: '%', unary: false },
		    { fn: GreaterEquOp, pri: PRI_BELOWADD, symbol: '>=', unary: false },
		    { fn: LesserEquOp, pri: PRI_BELOWADD, symbol: '<=', unary: false },
		    { fn: GreaterThanOp, pri: PRI_BELOWADD, symbol: '>', unary: false },
		    { fn: LesserThanOp, pri: PRI_BELOWADD, symbol: '<', unary: false },
		    { fn: NotEquOp, pri: PRI_BELOWADD, symbol: '!=', unary: false },
		    { fn: AndOp, pri: PRI_LOWEST, symbol: '&&', unary: false },
		    { fn: OrOp, pri: PRI_LOWEST, symbol: '||', unary: false },
		    { fn: NotOp, pri: PRI_MULT, symbol: '!', unary: true },
		    { fn: EquOp, pri: PRI_BELOWADD, symbol: '==', unary: false }
		];

        this.functions = {
            "sin": { fn: Math.sin, nbArgs: 1, symbol: 'sin', rpt: false },
            "asin": { fn: Math.asin, nbArgs: 1, symbol: 'asin', rpt: false },
            "cos": { fn: Math.cos, nbArgs: 1, symbol: 'cos', rpt: false },
            "acos": { fn: Math.acos, nbArgs: 1, symbol: 'acos', rpt: false },
            "tan": { fn: Math.tan, nbArgs: 1, symbol: 'tan', rpt: false },
            "atan": { fn: Math.atan, nbArgs: 1, symbol: 'atan', rpt: false },
            "atan2": { fn: Math.atan2, nbArgs: 1, symbol: 'atan2', rpt: false },
            "sqrt": { fn: Math.sqrt, nbArgs: 1, symbol: 'sqrt', rpt: false },
            "abs": { fn: Math.abs, nbArgs: 1, symbol: 'abs', rpt: false },
            "ceil": { fn: Math.ceil, nbArgs: 1, symbol: 'ceil', rpt: false },
            "floor": { fn: Math.floor, nbArgs: 1, symbol: 'floor', rpt: false },
            "log": { fn: Math.log, nbArgs: 1, symbol: 'log', rpt: false },
            "pow": { fn: Math.pow, nbArgs: 2, symbol: 'pow', rpt: false },
            "round": { fn: Math.round, nbArgs: 1, symbol: 'round', rpt: false },
            "exp": { fn: Math.exp, nbArgs: 1, symbol: 'exp', rpt: false },
            "if": { fn: ifFn, nbArgs: 3, symbol: 'if', rpt: false },
            "javascript": { fn: javascriptFn, nbArgs: -1, symbol: 'javascript', rpt: false, fireEle: true },
            "min": { fn: minFn, nbArgs: 1, symbol: 'min', rpt: true },
            "max": { fn: maxFn, nbArgs: 1, symbol: 'max', rpt: true },
            "sum": { fn: sumFn, nbArgs: 1, symbol: 'sum', rpt: true },
            "avg": { fn: avgFn, nbArgs: 1, symbol: 'avg', rpt: true }
        };

        this.consts = {
            "E": Math.E,
            "PI": Math.PI
        };
    }

    Parser.parse = function (expr) {
        return new Parser().parse(expr);
    };

    Parser.evaluate = function (expr, variables) {
        return Parser.parse(expr).evaluate(variables);
    };

    Parser.prototype = {
        parse: function (exp) {
            exp = this.removeSpace(exp);
            if (!exp)
                return null;

            var sl = exp.length;
            var sc = 0;
            var wd = '';
            this.curItemTypeStack = [];
            this.itemStack = [];
            this.opStack = [];
            this.vars = [];
            this.exp = exp;

            this.pushCurItemType();

            for (var i = 0; i < sl; i++) {
                var c = exp.charAt(i);

                if (sc === 0) { if (c == '\'' || c == '\"') { sc = c; wd += c; continue; } }
                else { if (c == sc) { sc = 0; } else { wd += c; continue; } }

                var op = this.areNextCharsOpString(exp, i);
                if (op) {
                    i += op.symbol.length - 1;
                    this.onOp(i, wd, op);
                    wd = '';
                }
                else {
                    if (c == ',') {
                        this.onArgSeparator(i, wd);
                        wd = '';
                    }
                    else if (c == '(') {
                        this.onOpenBracket(i, wd);
                        wd = '';
                    }
                    else if (c == ')') {
                        this.onCloseBracket(i, wd);
                        wd = '';
                    }
                    else
                        wd += c;
                }
            }
            this.onExpEnd(sl - 1, wd);

            return this;
        },

        evaluate: function (values, xel, dom) {
            var its = this.itemStack;

            if (its.length == 1 && !its[0].args)
                return its[0].isVar ? values[its[0].val] : its[0].val;

            var idx;
            for (var i = 0; i < its.length; i++) {
                var it = its[i];

                if (idx && idx.itm == it) {
                    if (idx.i < idx.len) {
                        i = idx.start - 1;
                        continue;
                    }
                    else
                        idx = null;
                }

                if (it.beginrpt) {
                    idx = { start: i + 1, len: 0, i: 0, itm: it.beginrpt };
                    for (var j = 0; j < it.vars.length; j++) {
                        var vr = it.vars[j];
                        if (vr in values) {
                            var v = values[it.vars[j]];
                            v = Ext.isArray(v) ? v : [v];
                            idx.len = Math.max(idx.len, v.length);
                        }
                    }
                    continue;
                }

                if ((idx || { len: 1 }).len != 0) {
                    var vs = [];
                    for (var j = 0; j < it.args.length; j++) {
                        var arg = it.args[j];
                        var v = arg.isVar ? values[arg.val] : arg.val;
                        if (idx) {
                            v = Ext.isArray(v) ? v : [v];
                            v = v.length >= idx.len ? v[idx.i] : v[0];
                        }
                        if (it.eval.rpt) {
                            v = Ext.isDefined(v) ? v : [];
                            v = Ext.isArray(v) ? v : [v];
                        }
                        vs.push(v);
                    }

                    if (it.eval.fireEle) {
                        vs.push(xel);
                        vs.push(dom);
                    }
                    var rv = it.eval.fn.apply(undefined, vs);

                    var parg = it.ParentArg;
                    if (idx && parg.item == idx.itm) {
                        parg.val = idx.i == 0 ? [] : parg.val;
                        parg.val.push(rv);
                        idx.i++;
                    }
                    else
                        parg.val = rv;
                }
            }

            return its[its.length - 1].ParentArg.val;
        },

        variables: function () {
            return this.vars;
        },

        removeSpace: function (exp) {
            if (!exp)
                return '';

            var l = exp.length;
            var v = [];
            var f = false;
            for (var i = 0; i < l; i++) {
                var c = exp.charAt(i);
                if (c == '\'' || c == '\"')
                    f = !f;

                if ((c != ' ' && c != '\r' && c != '\n') || f)
                    v.push(c);
            }

            return v.join('');
        },

        areNextCharsOpString: function (exp, pos) {
            if (!Parser.FirstCharStr) {
                var fcs = [];
                for (var i = 0; i < this.ops.length; i++)
                    fcs.push(this.ops[i].symbol.charAt(0));
                Parser.FirstCharStr = fcs.join('');
            }

            var c = exp.charAt(pos);
            if (Parser.FirstCharStr.indexOf(c) == -1)
                return false;

            for (var i = 0; i < this.ops.length; i++) {
                var op = this.ops[i];
                var s = op.symbol;
                var l = op.symbolLength = op.symbolLength || s.length;
                var f = op.firstChar = op.firstChar || s.charAt(0);
                if (c != f)
                    continue;

                var m = true;
                for (var j = 1; j < l; j++) {
                    if (s.charAt(j) != exp.charAt(pos + j)) {
                        m = false;
                        break;
                    }
                }

                if (m) return op;
            }

            return false;
        },

        onOp: function (pos, wd, op) {
            if (!this.parseWord(pos, wd))
                return;

            this.setArgValueFlag(true);
            this.setCurItemType(ItemType_Operator);

            var pitp = this.getPrevItemType();
            var unary = (pitp == ItemType_None || pitp == ItemType_Operator);

            if (op.unary != unary) {
                var s = op.symbol;
                for (var i = 0; i < this.ops.length; i++) {
                    var op1 = this.ops[i];
                    if (op1.symbol == s && op1.unary == unary) {
                        op = op1;
                        break;
                    }
                }
                if (op.unary != unary)
                    YZSoft.Error.raise(RS.$('Form_Express_SynErr001'), this.exp, op.symbol);
            }

            if (pos + op.symbol.length > this.exp.length)
                YZSoft.Error.raise(RS.$('Form_Express_SynErr001'), this.exp, op.symbol);

            var ops = this.opStack;
            if (ops.length > 0) {
                var ppri = ops[ops.length - 1].pri;
                var cpri;
                if (ppri != PRI_OPENBRACKET)
                    cpri = op.pri;

                if (cpri == ppri && ops[ops.length - 1].itemType == ItemType_Operator && ops[ops.length - 1].eval.unary)
                    cpri = ppri + 1; // skip the while

                while (cpri <= ppri) {
                    var opsitm = ops.pop();
                    this.addAndValidateToExprStack(opsitm);

                    if (this.opStack.length == 0)
                        break;

                    ppri = ops[ops.length - 1].pri;
                    if (ppri == PRI_OPENBRACKET)
                        break;
                }
            }

            var opi = {
                nbArgs: unary ? 1 : 2,
                pri: op.pri,
                endWithABlock: false,
                eval: op,
                itemType: ItemType_Operator
            };
            ops.push(opi);
        },

        onArgSeparator: function () {
        },

        onOpenBracket: function (pos, wd) {
            if (!this.parseWord(pos, wd))
                return;

            this.setArgValueFlag(false);

            var opi = {
                pri: PRI_OPENBRACKET,
                endWithABlock: false,
                itemType: ItemType_None
            };
            this.opStack.push(opi);

            if (this.getCurItemType() == ItemType_Function)
                this.itemStack.push({ isUsed: true, isABlock: true });

            this.pushCurItemType();
        },

        onCloseBracket: function (pos, wd) {
            this.onCloseArgSeparator(pos, wd, true);
        },

        onArgSeparator: function (pos, wd) {
            this.onCloseArgSeparator(pos, wd, false);
        },

        onCloseArgSeparator: function (pos, wd, close) {
            if (!this.parseWord(pos, wd))
                return;

            if (this.getCurItemType() == ItemType_Operator)
                YZSoft.Error.raise(RS.$('Form_Express_SynErr002'), this.exp);

            this.curItemTypeStack.pop();

            var nc = this.getNextChar(pos);
            if (!close) { //arg
                this.pushCurItemType();
                if (nc == ')')
                    YZSoft.Error.raise(RS.$('Form_Express_SynErr003'), this.exp);
            }

            var cpri, popeditems = 0;
            var ops = this.opStack;
            do {
                if (ops.length == 0) {
                    if (close)
                        YZSoft.Error.raise(RS.$('Form_Express_SynErr004'), this.exp);
                    else
                        YZSoft.Error.raise(RS.$('Form_Express_SynErr003'), this.exp);
                }

                cpri = ops[ops.length - 1].pri;
                if (cpri != PRI_OPENBRACKET) {
                    popeditems++;
                    var opi = ops.pop();
                    this.addAndValidateToExprStack(opi);
                }
            } while (cpri != PRI_OPENBRACKET);

            var isInc = this.incArgCountIfArgValue(ops);
            if (close) {
                ops.pop();
                if (this.getCurItemType() != ItemType_Function)
                    this.setCurItemType(ItemType_Value);
            }

            if (popeditems == 0) {
                if (!close && !isInc)
                    YZSoft.Error.raise(RS.$('Form_Express_SynErr003'), this.exp);
            }

            this.setArgValueFlag((close && (nc == ')' || nc == ',')) ? isInc : false);
        },

        onExpEnd: function (pos, wd) {
            this.parseWord(pos, wd);

            var ops = this.opStack;
            var its = this.itemStack;
            var nbOps = ops.length;
            var invT = nbOps - 1;

            for (var i = ops.length - 1; i >= 0; i--) {
                var opi = ops[i];
                if (opi.pri == PRI_OPENBRACKET)
                    YZSoft.Error.raise(RS.$('Form_Express_SynErr005'), this.exp);

                this.addAndValidateToExprStack(opi);
            }

            var l = its.length;
            for (var i = l - 1; i >= 0; i--) {
                var itm = its[i];
                if (itm.isABlock || (itm.isEvaluated && i != l - 1)) {
                    its.splice(i, 1);
                }
            }

            var l = its.length;
            for (var i = 0; i < l; i++) {
                var itm = its[i];
                if (itm.eval && itm.eval.rpt) {
                    var j;
                    var vs = [];
                    for (j = i - 1; j >= 0; j--) {
                        var itm1 = its[j];
                        if (!this.isParent(itm, itm1))
                            break;
                        var args = itm1.args;
                        if (itm1.eval.rpt)
                            YZSoft.Error.raise(RS.$('Form_Express_SynErr006'), this.exp, itm1.eval.symbol);

                        for (var k = 0; k < args.length; k++) {
                            var arg = args[k];
                            if (arg.isVar)
                                vs.push(arg.val);
                        }
                    }

                    its.splice(j + 1, 0, { beginrpt: itm, vars: vs });
                    l++;
                    i++;
                }
            }


            var lit = its[its.length - 1];
            lit.ParentArg = lit.val || {};
        },

        getNextChar: function (pos) {
            return this.exp.charAt(pos + 1) || '';
        },

        isParent: function (itm, itm1) {
            while (itm1 && itm1.ParentArg) {
                itm1 = itm1.ParentArg.item;
                if (itm1 == itm)
                    return true;
            }

            return false;
        },

        setArgValueFlag: function (b) {
            if (this.opStack.length > 0) {
                var t = this.opStack.length - 1;
                if (this.opStack[t].pri == PRI_OPENBRACKET)
                    t--;

                if (t >= 0)
                    this.opStack[t].argValue = b;
            }
        },

        pushCurItemType: function () {
            this.curItemTypeStack.push({ current: ItemType_None, previous: ItemType_None });
        },

        setCurItemType: function (type) {
            var its = this.curItemTypeStack;
            var last = its[its.length - 1];
            last.previous = last.current;
            last.current = type;
        },

        getPrevItemType: function () {
            var its = this.curItemTypeStack;
            return its[its.length - 1].previous;
        },

        getCurItemType: function () {
            var its = this.curItemTypeStack;
            return its[its.length - 1].current;
        },

        addAndValidateToExprStack: function (opi) {
            if (opi.itemType == ItemType_Function) {
                if (opi.eval.nbArgs != -1 && opi.eval.nbArgs != opi.nbArgs)
                    YZSoft.Error.raise(RS.$('Form_Express_SynErr007'), this.exp, opi.eval.symbol, opi.eval.nbArgs);
            }

            var info = {
                eval: opi.eval,
                nbArgs: opi.nbArgs,
                args: [],
                endWithABlock: opi.endWithABlock
            };
            this.itemStack.push(info);

            try { this.evaluateValidate(); }
            catch (e) { YZSoft.Error.raise(RS.$('Form_Express_SynErr008'), e.message); }
        },

        evaluateValidate: function () {
            this.allConstants = true;
            this.nbPops = 0;

            var its = this.itemStack;
            if (its.length == 0)
                return 0;

            var val = this.evaluateValidateItem(its.length - 1);
            its[its.length - 1].isUsed = true;

            for (var t = 0; t < its.length; t++)
                its[t].isUsed = false;

            return val;
        },

        evaluateValidateItem: function (idx) {
            var its = this.itemStack;
            var itm = its[idx];

            if (itm.isUsed)
                YZSoft.Error.raise('Internal Error:001');

            if (itm.isEvaluated) {
                itm.isUsed = true;
                return itm.val;
            }

            this.popPtr = idx - 1;

            for (var i = itm.nbArgs - 1; i >= 0; i--) {
                var arg = itm.args[i] = itm.args[i] || { item: itm };
                var popv = this.popValidate(arg);
                arg.isVar = popv.isVar || false;
                arg.val = Ext.isDefined(popv.val) ? popv.val : null;
            }

            var val = { val: 0 };
            if (itm.endWithABlock) {
                if (!its[this.popPtr].isABlock)
                    YZSoft.Error.raise('Internal Error:002'); // unused item! too many arguments
                else
                    this.popPtr--;
            }
            return val;
        },

        popValidate: function (parentArg) {
            this.nbPops++;
            if (this.nbPops < 0)
                YZSoft.Error.raise('Internal Error:003'); // not enough argument

            var val = {};
            var itm = this.itemStack[this.popPtr];

            if (itm.isABlock)
                YZSoft.Error.raise('Internal Error:004'); // no more argument: missing arguments

            if (itm.isUsed)
                YZSoft.Error.raise('Internal Error:005'); // already used? something's wrong

            itm.ParentArg = parentArg;
            if (itm.isEvaluated) {
                val.isVar = itm.isVar;
                val.val = itm.val;
                itm.isUsed = true;
                this.popPtr--;
            }
            else {
                val = this.evaluateValidateItem(this.popPtr);
                this.isUsed = true;
            }

            return val;
        },

        parseWord: function (p, w) {
            var rv = true;
            if (!w)
                return true;

            var citp = this.getCurItemType();
            if (citp != ItemType_Operator && citp != ItemType_None)
                YZSoft.Error.raise(RS.$('Form_Express_SynErr009'), this.exp);

            if (this.exp.charAt(p) == '(') {
                var f = this.functions[w];
                if (f) {
                    this.setArgValueFlag(true);
                    this.setCurItemType(ItemType_Function);

                    this.opStack.push({
                        pri: PRI_FCT,
                        endWithABlock: true,
                        nbArgs: 0,
                        eval: f,
                        argValue: false,
                        itemType: ItemType_Function
                    });
                }
                else
                    YZSoft.Error.raise(RS.$('Form_Express_SynErr010'), this.exp, w);
            }
            else if (YZSoft.Utility.isNumber(w)) {
                this.setCurItemType(ItemType_Value);
                this.itemStack.push({ isEvaluated: true, val: parseFloat(w) });
                this.setArgValueFlag(true);
            }
            else if (YZSoft.Utility.isString(w)) {
                this.setCurItemType(ItemType_Value);
                w = w.substring(1, w.length - 1);
                this.itemStack.push({ isEvaluated: true, val: w });
                this.setArgValueFlag(true);
            }
            else {
                var itm = { isEvaluated: true };
                if (w in this.consts) {
                    itm.val = this.consts[w];
                }
                else {
                    itm.isVar = true;
                    itm.val = w;
                    if (!(w in this.vars))
                        this.vars.push(w);
                }

                this.setCurItemType(ItemType_Value);
                this.itemStack.push(itm);
                this.setArgValueFlag(true);
            }

            this.lastWord = w;
            this.curWord = '';
            return rv;
        },

        incArgCountIfArgValue: function (ops) {
            if (ops.length > 0) {
                var idx = ops.length - 1;
                if (ops[idx].pri == PRI_OPENBRACKET)
                    idx--;

                if (idx >= 0) {
                    if (ops[idx].argValue) {
                        if (ops[idx].itemType == ItemType_Function)
                            ops[idx].nbArgs++;
                        return true;
                    }
                }
            }
            return false;
        }
    };

    scope.Parser = Parser;
    return Parser;
})(YZSoft.XForm);