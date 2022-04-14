Ext.define('YZSoft.bpm.src.model.UserResourcePermision', {
    extend:'Ext.data.Model',
    //idProperty: 'PermName',
    fields: [
        { name: 'RSID' },
        { name: 'PermName' },
        { name: 'PermDisplayName' },
        { name: 'PermType' },
        { name: 'LeadershipTokenEnabled' }
    ]
});