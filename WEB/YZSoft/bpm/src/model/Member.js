Ext.define('YZSoft.bpm.src.model.Member', {
    extend: 'Ext.data.Model',
    idProperty: 'FullName',
    fields: [
        { name: 'FullName' },
        { name: 'UserAccount' },
        { name: 'UserDisplayName' },
        { name: 'LeaderTitle' },
        { name: 'Department' },
        { name: 'FGOUEnabled' },
        { name: 'FGYWEnabled' },
        { name: 'Level' }
    ]
});