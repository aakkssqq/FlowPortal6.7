
Ext.define('YZSoft.src.store.DataTypeSimpleStore', {
    extend: 'Ext.data.Store',
    requires: [
        'YZSoft.src.model.DataType'
    ],
    model: 'YZSoft.src.model.DataType',
    data: [
        { name: 'String', value: { name: 'String', fullName: 'System.String'} },
        { name: 'DateTime', value: { name: 'DateTime', fullName: 'System.DateTime'} },
        { name: 'Boolean', value: { name: 'Boolean', fullName: 'System.Boolean'} },
        { name: 'Int32', value: { name: 'Int32', fullName: 'System.Int32'} },
        { name: 'Decimal', value: {name:'Decimal',fullName:'System.Decimal'} }
    ]
});