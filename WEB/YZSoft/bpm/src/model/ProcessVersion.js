Ext.define('YZSoft.bpm.src.model.ProcessVersion', {
    extend: 'Ext.data.Model',
    idProperty: 'ProcessVersion',
    fields: [
        { name: 'ProcessName' },
        { name: 'Active' },
        { name: 'ProcessVersion' },
        { name: 'Description' }
    ]
});
