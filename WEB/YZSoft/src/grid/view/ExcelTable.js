
Ext.define('YZSoft.src.grid.view.ExcelTable', {
    extend: 'Ext.view.Table',
    xtype: ['yzexceltable'],
    stripeRows: false,
    enableTextSelection: true, //qml99199允许选择grid中的文字
    onFocusEnter: Ext.emptyFn, //重载掉，会出错
    tpl: [
        '{%',
            'view = values.view;',
            'if (!(columns = values.columns)) {',
                'columns = values.columns = view.ownerCt.getVisibleColumnManager().getColumns();',
            '}',
            'values.fullWidth = 0;',

            'for (i = 0, len = columns.length; i < len; i++) {',
                'column = columns[i];',
                'values.fullWidth += (column.cellWidth = column.lastBox ? column.lastBox.width : column.width || column.minWidth);',
            '}',

            'tableCls=values.tableCls=[];',
        '%}',
        '<table class="' + Ext.baseCSSPrefix + 'grid-item-container yz-grid-item-container-reporttable" style="width:{fullWidth}px;" cellPadding="0" cellSpacing="0">',
            '{[view.renderTHead(values, out, parent)]}',
            '{%',
                'view.renderRows(values.rows, values.columns, values.viewStartIndex, out);',
            '%}',
            '{[view.renderTFoot(values, out, parent)]}',
        '</table>',
        {
            definitions: 'var view, tableCls, columns, i, len, column;',
            priority: 0
        }
    ],

    outerRowTpl: [
        '{%',
            'this.nextTpl.applyOut(values, out, parent)',
        '%}', {
            priority: 9999
        }
    ],

    rowTpl: [
        '{%',
            'var dataRowCls = values.recordIndex === -1 ? "" : " ' + Ext.baseCSSPrefix + 'grid-row";',
        '%}',
        '<tr id="{rowId}" ',
            'data-boundView="{view.id}" ',
            'data-recordId="{record.internalId}" ',
            'data-recordIndex="{recordIndex}" ',
            'class="{[values.itemClasses.join(" ")]} {[values.rowClasses.join(" ")]} {[dataRowCls]}" {rowAttr:attributes} {ariaRowAttr} style="{itemStyle};width:0">',
            '<tpl for="columns">' +
                '{%',
                    'parent.view.renderCell(values, parent.record, parent.recordIndex, parent.rowIndex, xindex - 1, out, parent)',
                 '%}',
            '</tpl>',
        '</tr>', {
            priority: 0
        }
    ],

    cellTpl: [
        '<td class="{tdCls} {groupCls}" {tdAttr} {[Ext.aria ? "id=\\"" + Ext.id() + "\\"" : ""]} style="width:{column.cellWidth}px;<tpl if="tdStyle">{tdStyle}</tpl>" tabindex="-1" {ariaCellAttr} {groupAttr} data-columnid="{[values.column.getItemId()]}">',
            '<div {unselectableAttr} class="' + Ext.baseCSSPrefix + 'grid-cell-inner {innerCls}" ',
                'style="text-align:{align};<tpl if="style">{style}</tpl>" {ariaCellInnerAttr}>{value}</div>',
        '</td>', {
            priority: 0
        }
    ],

    bodySelector: 'table.' + Ext.baseCSSPrefix + 'grid-item-container',
    itemSelector: 'tr.' + Ext.baseCSSPrefix + 'grid-item',
    rowSelector: 'tr.' + Ext.baseCSSPrefix + 'grid-row',
    cellSelector: 'td.' + Ext.baseCSSPrefix + 'grid-cell',
    overItemCls:'',
    nodeContainerSelector: 'table.' + Ext.baseCSSPrefix + 'grid-item-container',

    getRowClass: function (record, rowIndex, rowParams, store) {
        var cls = [];

        if (rowIndex == 0)
            cls.push('x-grid-item-first');

        if (rowIndex == store.getCount() - 1)
            cls.push('x-grid-item-last');

        return cls.join(' ');
    },

    getSpanRange: function (column, recordIndex) {
        var me = this,
            pnl = me.ownerCt,
            store = me.getStore(),
            prev = pnl.columnManager.getPreviousSibling(column),
            range;

        if (prev)
            range = me.getRowSpan(prev, recordIndex);

        return range || [0, store.getCount() - 1];
    },

    getRowSpan: function (column, recordIndex) {
        if (!column.group)
            return null;

        var me = this,
            pnl = me.ownerCt,
            store = me.getStore(),
            rec = store.getAt(recordIndex),
            range = me.getSpanRange(column, recordIndex),
            startRecordIndex = range[0],
            endRecordIndex = range[1],
            i, s, e;

        s = recordIndex;
        for (i = recordIndex; i >= startRecordIndex; i--) {
            if (!me.groupEqu(store.getAt(i), rec, column))
                break;
            s = i;
        }

        e = recordIndex;
        for (i = recordIndex; i <= endRecordIndex; i++) {
            if (!me.groupEqu(store.getAt(i), rec, column))
                break;
            e = i;
        }

        return [s, e];
    },

    groupEqu: function (rec1, rec2, column) {
        var me = this,
            groupDataIndex = Ext.isString(column.group) ? column.group : column.dataIndex,
            value1 = rec1.data[groupDataIndex],
            value2 = rec2.data[groupDataIndex],
            compareFunc = (column.groupCompare && column.groupCompare.call) ? column.groupCompare : me.groupDefaultCompare;

        return compareFunc.call(me, value1, value2, groupDataIndex);
    },

    groupDefaultCompare: function (value1, value2) {
        return value1 == value2;
    },

    renderCell: function (column, record, recordIndex, rowIndex, columnIndex, out) {
        var me = this,
            store = me.getStore(),
            range = me.getRowSpan(column, recordIndex),
            cellValues = me.cellValues;

        cellValues.groupAttr = '';
        cellValues.groupCls = "";
        column.isFirstVisible = me.ownerCt.columnManager.getHeaderIndex(column) == 0; //bug fix

        if (range) {
            if (recordIndex == range[0]) {
                cellValues.groupAttr = 'rowspan="' + (range[1] - range[0] + 1).toString() + '"';

                if (range[1] == store.getCount() - 1)
                    cellValues.groupCls = "yz-grid-cell-ylast";
            }
            else
                return;
        }

        me.callParent(arguments);
    }
});