
Ext.define('YZSoft.src.grid.column.Color', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.yzcolorcolumn'],
    alternateClassName: 'YZSoft.grid.ColorColumn',
    tdCls: 'yz-grid-cell-colorcolumn',
    innerCls: 'yz-grid-cell-inner-colorcolumn',
    isColorColumn: true,
    producesHTML: false,

    initComponent: function () {
        this.callParent(arguments);
    },

    defaultRenderer: function (value) {
        return Ext.String.format('<div class="yz-colorcolumn-wrap" style="background-color:{0}"><div class="yz-colorcolumn-text">{0}</div></div>', value);
    },

    updater: function (cell, value) {
        cell.firstChild.innerHTML = this.defaultRenderer(value);
    }
});
