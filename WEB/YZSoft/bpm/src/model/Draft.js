Ext.define('YZSoft.bpm.src.model.Draft', {
    extend: 'Ext.data.Model',
    idProperty: 'DraftID',
    fields: [
        { name: 'DraftID' },
        { name: 'ProcessName' },
        { name: 'CreateDate' },
        { name: 'ModifyDate' },
        { name: 'Account' },
        { name: 'OwnerAccount' },
        { name: 'Owner' },
        { name: 'Comments' },
        { name: 'Description' }
    ]
});