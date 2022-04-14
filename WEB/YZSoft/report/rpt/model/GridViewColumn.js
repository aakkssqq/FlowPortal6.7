Ext.define('YZSoft.report.rpt.model.GridViewColumn', {
    extend: 'Ext.data.Model',
    idProperty: 'ColumnName',
    fields: [
        { name: 'ColumnName' },
        { name: 'ColumnIndex' },
        { name: 'DataType' },
        { name: 'DisplayName' },
        { name: 'Width' },
        { name: 'Group' },
        { name: 'Align' }
    ]
});
