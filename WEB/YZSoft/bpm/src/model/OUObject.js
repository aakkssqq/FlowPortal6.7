Ext.define('YZSoft.bpm.src.model.OUObject', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'Type' },
        { name: 'Name' },
        { name: 'FullName' },
        { name: 'Disabled' },
        { name: 'IsLeader' },
        { name: 'DisplayName' },
        { name: 'LeaderTitle' },
        { name: 'Level' },
        { name: 'Description' },
        { name: 'HRID' },
        { name: 'CostCenter' },
        { name: 'OfficePhone' },
        { name: 'HomePhone' },
        { name: 'Mobile' },
        { name: 'EMail' },
        { name: 'Supervisors' }
    ]
});
