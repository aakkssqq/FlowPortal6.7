Ext.define('YZSoft.bpm.src.model.DataSourceProvider', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'Name' },
        { name: 'SampleOfConnectionString' },
        { name: 'DataSourceCapability' }
    ]
});
