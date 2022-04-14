

Ext.define('YZSoft.designer.YZSoft.report.grid.Panel_Archive', {
    extend: 'YZSoft.designer.ArchiveAbstract',

    archive: function (grid, part) {
        var me = this,
            dsNode = part.dsNode,
            rv = me.callParent(arguments),
            columns = [];

        Ext.apply(rv, {
            dsid: dsNode ? dsNode.data.text : undefined,
            pagingBarDisplay: grid.getPagingBarDisplay(),
            export2Excel: grid.getExport2Excel(),
            exportTemplate: grid.getExportTemplate(),
            title: grid.getTitle(),
            titleAlign: grid.getTitleAlign()
        });

        Ext.each(grid.getColumns(), function (column) {
            columns.push(part.saveColumnInfo(column));
        });

        rv.columns = columns;

        return rv;
    }
});