Ext.define('YZSoft.report.rpt.model.ResultColumn', {
    extend: 'Ext.data.Model',
    idProperty: 'ColumnName',
    fields: [
        { name: 'ColumnName' },
        { name: 'DataType' },
        { name: 'DisplayName' },
        { name: 'LinkType' },
        { name: 'LinkTo' },
        { name: 'ParametersFill' }
    ]
});
