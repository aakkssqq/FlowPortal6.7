Ext.define('YZSoft.bpm.src.model.FormInfo', {
    extend: 'Ext.data.Model',
    idProperty: 'FileName',
    fields: [
        { name: 'FileName' },
        { name: 'FullName' },
        { name: 'Length' },
        { name: 'CreationTime' },
        { name: 'LastWriteTime' },
        { name: 'Desc' }
    ]
});
