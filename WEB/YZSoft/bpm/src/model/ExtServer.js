Ext.define('YZSoft.bpm.src.model.ExtServer', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'ServerType' },
        { name: 'Name' },
        { name: 'Host' }
    ]
});
