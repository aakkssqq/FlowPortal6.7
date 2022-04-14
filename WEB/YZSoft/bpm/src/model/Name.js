Ext.define('YZSoft.bpm.src.model.Name', {
    extend: 'Ext.data.Model',
    idProperty: 'name',
    fields: [
        { name: 'name' },
        { name: 'value',mapping: 'name'}
    ]
});
