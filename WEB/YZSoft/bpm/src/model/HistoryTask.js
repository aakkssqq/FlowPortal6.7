Ext.define('YZSoft.bpm.src.model.HistoryTask',{
    extend:'Ext.data.Model',
    idProperty: 'TaskID',
    fields: [
        { name: 'TaskID' },
        { name: 'SerialNum' },
        { name: 'ProcessName' },
        { name: 'ProcessVersion' },
        { name: 'OwnerAccount' },
        { name: 'OwnerDisplayName' },
        { name: 'AgentAccount' },
        { name: 'AgentDisplayName' },
        { name: 'CreateAt' },
        { name: 'State' },
        { name: 'Description' },
        { name: 'perm' }
    ]
});