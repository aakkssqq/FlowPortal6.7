Ext.define('YZSoft.src.datasource.model.DSParam', {
    extend: 'Ext.data.Model',
    idProperty: 'name',
    fields: [
        { name: 'name' },
        { name: 'displayName' },
        { name: 'dataType' },
        { name: 'defaultValue' },
        { name: 'desc' },
        { name: 'supportOp' },
        { name: 'internalParam' },
    ]
});
