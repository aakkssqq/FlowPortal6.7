
Ext.define('YZSoft.designer.YZSoft.report.search.field.ArchiveAbstract', {
    extend: 'YZSoft.designer.ArchiveAbstract',

    archive: function (field, part) {
        return {
            binddsid: part.dsNode.get('text'),
            xdatabind: field.xdatabind,
            fieldLabel: field.getFieldLabel(),
            emptyText: field.getEmptyText(),
            defaultValue: field.defaultValue
        };
    }
});