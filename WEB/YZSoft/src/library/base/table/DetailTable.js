
Ext.define('YZSoft.src.library.base.table.DetailTable', {
    extend: 'Ext.view.Table',
    xtype: ['yzdetailtable'],

    renderCell: function (column, record, recordIndex, rowIndex, columnIndex, out) {
        var me = this;

        if (record.data.$$$isFolder) {
            var r = column.renderer;

            if (column.folderRenderer) {
                column.renderer = column.folderRenderer;
            }
            else if (column.folder === true) {
                column.renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                    value = r.apply(column.usingDefaultRenderer ? column : column.scope || me.ownerCt, arguments);
                    return me.renderFolder(value, metaData, record, rowIndex, colIndex, store, view);
                };
            }
            else {
                column.renderer = Ext.emptyFn;
            }

            me.callParent(arguments);
            column.renderer = r;
        }
        else {
            me.callParent(arguments);
        }
    },

    renderFolder: function (value, metaData, record, rowIndex, colIndex, store, view, renderer) {
        var column = view.getColumnManager().getColumns()[colIndex];
        return Ext.String.format('<span class="yz-flag-gridfolder">&#{0};</span>{1}', column.folderGlyph || 0xe632, value);
    }
});