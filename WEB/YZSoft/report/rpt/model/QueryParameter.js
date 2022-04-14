Ext.define('YZSoft.report.rpt.model.QueryParameter', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'Name' },
        { name: 'DisplayName' },
        { name: 'DataType' },
        { name: 'DefaultValue' },
        { name: 'Description' },
        { name: 'ParameterUIBindType' }
    ]
});
