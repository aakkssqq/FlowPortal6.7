
Ext.define('YZSoft.forms.field.ExcelDataExportButton', {
    extend: 'YZSoft.forms.field.Button',
    requires: [
        'YZSoft.src.ux.File'
    ],

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            exportTableId: me.getAttribute('ExportTableId'),
            templateExcel: me.getAttribute('TemplateExcel')
        });

        return config;
    },

    onClick: function (e) {
        var me = this,
            et = me.getEleType();

        if (!et.exportTableId)
            return;

        if (!et.templateExcel)
            me.exportByDefault(et.exportTableId);
        else
            me.exportByTemplate(et.exportTableId,et.templateExcel);
    },

    exportByDefault: function (tableid) {
        var me = this,
            d = { rows: [] },
            t = document.getElementById(tableid),
            rc = t.rows.length;

        for (var i = 0; i < rc; i++) {
            var row = t.rows[i];
            cc = t.rows[i].cells.length;
            r = {};

            d.rows.push(r);
            for (var j = 0, k = 0; j < cc; j++) {
                var td = row.cells[j];
                r[k] = Ext.String.trim(me.getCellText(td, i) || '');
                k += td.colSpan || 1;
            }
        }

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft/excel/Json2Excel.ashx'), { data: Ext.encode(d) });
    },

    getCellText: function (td, rowidx) {
        var me = this,
            rv = '',
            len = td.childNodes.length;

        for (var i = 0; i < len; i++)
            rv += me.getControlText(td.childNodes[i]);

        rv = rv || td.innerText || td.textContent || '';
        return rv;
    },

    getControlText: function (ctrl) {
        var me = this,
            rv = '',
            tag = ctrl.tagName;

        switch (tag) {
            case 'INPUT':
                switch (ctrl.type) {
                    case 'button':
                        break;
                    case 'radio':
                        if (ctrl.checked && ctrl.nextSibling)
                            rv = ctrl.nextSibling.innerText || ctrl.nextSibling.textContent;
                        break;
                    case 'checkbox':
                        if (ctrl.checked && ctrl.nextSibling)
                            rv = ctrl.nextSibling.innerText || ctrl.nextSibling.textContent;
                        break;
                    default:
                        rv = ctrl.value;
                }
                break;
            case 'SELECT':
                var selIndex = ctrl.selectedIndex;
                if (selIndex == -1)
                    rv = ''
                else {
                    var selItem = ctrl.options[selIndex];
                    rv = selItem.text || selItem.value || '';
                }
                return rv || ' ';
            default:
                rv = ctrl.value;
        }

        rv = rv || '';
        if (!rv) {
            var len = ctrl.childNodes.length;
            for (var i = 0; i < len; i++) {
                var value = me.getControlText(ctrl.childNodes[i]);
                if (value) {
                    if (rv) rv += ';';
                    rv += value;
                }
            }
        }

        return rv;
    }
});