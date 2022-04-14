Ext.define('YZSoft.bpm.src.model.ProcessInfo', {
    extend: 'Ext.data.Model',
    idProperty: 'ProcessName',
    fields: [
        { name: 'ProcessName' },
        { name: 'value', mapping: 'ProcessName' },
        { name: 'ProcessVersion' },
        { name: 'Description' },
        { name: 'MobileInitiation' }
    ]
});
