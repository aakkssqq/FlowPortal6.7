
Ext.define('YZSoft.src.store.DataTypeStore', {
    extend: 'Ext.data.Store',
    requires: [
        'YZSoft.src.model.DataType'
    ],
    model: 'YZSoft.src.model.DataType',
    data: [
        { name: 'Decimal', value: {name:'Decimal',fullName:'System.Decimal'} },
        { name: 'Double', value: { name: 'Double', fullName: 'System.Double'} },
        { name: 'Single', value: { name: 'Single', fullName: 'System.Single'} },
        { name: 'Int16', value: { name: 'Int16', fullName: 'System.Int16'} },
        { name: 'Int32', value: { name: 'Int32', fullName: 'System.Int32'} },
        { name: 'Int64', value: { name: 'Int64', fullName: 'System.Int64'} },
        { name: 'UInt16', value: { name: 'UInt16', fullName: 'System.UInt16'} },
        { name: 'UInt32', value: { name: 'UInt32', fullName: 'System.UInt32'} },
        { name: 'UInt64', value: { name: 'UInt64', fullName: 'System.UInt64'} },
        { name: 'SByte', value: { name: 'SByte', fullName: 'System.SByte'} },
        { name: 'Byte', value: { name: 'Byte', fullName: 'System.Byte'} },
        { name: 'Char', value: { name: 'Char', fullName: 'System.Char'} },
        { name: 'Boolean', value: { name: 'Boolean', fullName: 'System.Boolean'} },
        { name: 'DateTime', value: { name: 'DateTime', fullName: 'System.DateTime'} },
        { name: 'String', value: { name: 'String', fullName: 'System.String'} }
    ]
});