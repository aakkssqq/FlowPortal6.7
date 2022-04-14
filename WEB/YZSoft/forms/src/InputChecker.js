Ext.define('YZSoft.forms.src.InputChecker', {
    extend: 'Ext.Evented',
    inheritableStatics: {
        checkers: {
            Number: { name: 'Number', type: 'reg', reg: new RegExp('^[+-]{0,1}[0-9]*[.]{0,1}[0-9]*$'), errmsg: '' },
            DecimalDefault: { name: 'DecimalDefault', type: 'reg', reg: new RegExp('^[+-]{0,1}[0-9]*[.]{0,1}[0-9]{0,}$'), errmsg: '' },
            Digit: { name: 'Digit', type: 'reg', reg: new RegExp('^[+-]{0,1}[0-9]*$'), errmsg: '' },
            Plus: { name: 'Plus', type: 'reg', reg: new RegExp('^[+]{0,1}[0-9.]*$'), errmsg: '' },
            Boolean: { name: 'Boolean', type: 'reg', reg: new RegExp('^[01]{0,1}$'), errmsg: '' },
            Len: { name: 'Len', type: 'len', errmsg: '' }
        }
    },

    constructor: function (elType, selector) {
        var me = this,
            dt = YZSoft.XForm.DataType,
            chks = me.self.checkers,
            len;

        me.selector = selector;
        me.Checkers = [];

        var dc = (elType.DataBind ? elType.DataBind.DataColumn : null) || {};
        switch (dc.Type) {
            case dt.Decimal:
            case dt.Double:
            case dt.Single:
                me.DisableIME = true;
                me.Checkers.push(chks.Number);
                me.Checkers.push(chks.DecimalDefault);
                me.DecimalColumn = 2;
                break;
            case dt.Int16:
            case dt.Int32:
            case dt.Int64:
            case dt.SByte:
                me.DisableIME = true;
                me.Checkers.push(chks.Number);
                me.Checkers.push(chks.Digit);
                break;
            case dt.UInt16:
            case dt.UInt32:
            case dt.UInt64:
            case dt.Byte:
                me.DisableIME = true;
                me.Checkers.push(chks.Number);
                me.Checkers.push(chks.Digit);
                me.Checkers.push(chks.Plus);
                break;
            case dt.Boolean:
                me.DisableIME = true;
                me.Checkers.push(chks.Boolean);
                break;
            case dt.DateTime:
                me.DisableIME = true;
                break;
            case dt.String:
                len = Math.min(elType.Len == -1 ? 99999999 : elType.Len, dc.Length == -1 ? 99999999 : dc.Length);
                len = len == 99999999 ? -1 : len;
                if (len != -1)
                    me.Checkers.push(Ext.apply({
                        len: len
                    }, chks.Len));
                break;
            case dt.Binary:
                break;
            default:
                break;
        }

        var f = me.Format = me.parseFormat(elType.DspFormat);
        if (f) {
            me.HasFormat = f.Perfix || f.DecimalColumn != -1 || me.UseThousandSeparator;

            if (f.DigitColumn != -1) {
                me.Checkers.push({ type: 'reg', submitCheck: false, reg: new RegExp('^[+-]{0,1}[0-9]{0,' + f.DigitColumn + '}[.]{0,1}[0-9]*$'), errmsg: '' });
            }
            if (f.DecimalColumn != -1) {
                me.DecimalColumn = f.DecimalColumn;
                me.Checkers = YZSoft.XForm.Agent.arrayFilter(chks, { name: 'DecimalDefault' }, false);
                me.Checkers.push({ type: 'reg', submitCheck: false, reg: new RegExp('^[+-]{0,1}[0-9]*[.]{0,1}[0-9]{0,' + me.Format.DecimalColumn + '}$'), errmsg: '' });
            }
        }
    },

    parseFormat: function (str) {
        if (!str)
            return null;

        var u = YZSoft.HttpUtility,
            dc = u.attrDecode,
            rv = {},
            segs = str.split(';') || [];

        Ext.each(segs, function (seg) {
            var kv = u.parseKeyValue(seg, ':', true);
            switch (kv.key) {
                case 'type':
                    var type = (dc(kv.value) || '').toLowerCase();
                    rv.InputType = type == 'currency' ? 'currency' : (type == 'number' ? 'number' : 'string');
                    rv.UseThousandSeparator = type == 'currency';
                    break;
                case 'pfx':
                    rv.Perfix = dc(kv.value);
                    break;
                case '':
                    var f = dc(kv.value) || '';
                    var kv = f.split('.') || [];
                    var sbf = kv[0];
                    var saf = kv[1];

                    rv.DigitColumn = Number(sbf || -1);
                    rv.DigitColumn = isNaN(rv.DigitColumn) ? -1 : rv.DigitColumn;

                    rv.DecimalColumn = Number(saf || -1);
                    rv.DecimalColumn = isNaN(rv.DecimalColumn) ? -1 : rv.DecimalColumn;
                    break;
            }
        });

        if (rv.InputType == 'string') {
            rv.Perfix = null;
            rv.DigitColumn = -1;
            rv.DecimalColumn = -1;
        }
        else if (rv.InputType == 'number') {
            rv.Perfix = null;
        }
        return rv;
    },

    parseInput: function (xel, e) {
        var me = this;

        var ch = String.fromCharCode(e.getCharCode());
        if (e.ctrlKey && ch != ' ') //ie中可以输入CTRL+SPACE
            return true;

        var k = e.getKey();
        if (Ext.isGecko && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1)))
            return true;

        if (!Ext.isGecko && e.isSpecialKey() && !ch)
            return true;

        var s = xel.getSelPos(me.getInputElement(xel)),
            v = xel.getValue(),
            nstr = v.substring(0, s.s) + ch + v.substring(s.e);

        return me.check(nstr).success;
    },

    getInputElement: function (xel) {
        return this.selector ? xel.down(this.selector, true) : xel.dom;
    },

    check: function (str, submitcheck) {
        for (var i = 0; i < this.Checkers.length; i++) {
            var chk = this.Checkers[i];

            if (submitcheck && chk.submitCheck === false)
                continue;

            switch (chk.type) {
                case 'reg':
                    if (!chk.reg.test(str))
                        return { success: false, err: chk.errmsg };
                    break;
                case 'len':
                    if ((str || '').toString().length > chk.len)
                        return { success: false, err: Ext.String.format(RS.$('All_MaxLen_Error'), chk.len, Ext.String.ellipsis(str, 50)) };
                    break;
            }
        }

        return { success: true };
    },

    disableIME: function (xel, disabled) {
        var dom = this.getInputElement(xel);
        dom.style.imeMode = disabled ? 'disabled' : '';
    },

    getFormattedValue: function (v) {
        if (isNaN(v) || Ext.isEmpty(v) || !this.HasFormat)
            return v;

        v = parseFloat(v);
        var neg = null;

        v = (neg = v < 0) ? v * -1 : v;
        v = this.DecimalColumn != -1 ? v.toFixed(this.DecimalColumn) : v;

        if (this.Format.UseThousandSeparator) {
            var v = String(v);
            var ps = v.split('.');
            ps[1] = ps[1] ? ps[1] : null;
            var whole = ps[0];
            var r = /(\d+)(\d{3})/;
            while (r.test(whole))
                whole = whole.replace(r, '$1,$2');

            v = whole + (ps[1] ? '.' + ps[1] : '');
        }

        return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(this.Format.Perfix) ? '' : this.Format.Perfix + ''), v);
    },

    removeFormat: function (v) {
        if (Ext.isEmpty(v) || !this.HasFormat)
            return v;

        v = v.replace(this.Format.Perfix + '', '');
        v = this.Format.UseThousandSeparator ? v.replace(/,/g, '') : v;
        return v;
    }
});
