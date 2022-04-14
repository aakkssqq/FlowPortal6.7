
Ext.define('YZSoft.designer.YZSoft.report.search.field.ComboBox_Archive', {
    extend: 'YZSoft.designer.YZSoft.report.search.field.ArchiveAbstract',

    archive: function (field, part) {
        var me = this,
            data = me.callParent(arguments);

        return Ext.apply(data, {
            use: field.getUse(),
            ds: field.getDs(),
            dsDisplayField: field.getDsDisplayField(),
            dsValueField: field.getDsValueField(),
            options: field.getOptions()
        });
    }
});