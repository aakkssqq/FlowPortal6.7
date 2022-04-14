Ext.define('YZSoft.src.model.AssignPermPerm', {
    extend:'Ext.data.Model',
    idProperty: 'PermName',
    fields: [
        { name: 'PermName' },
        { name: 'PermType' }, //Module,Record
        { name: 'PermDisplayName' },
        { name: 'Allow', defaultValue: false },
        { name: 'AllowDisabled', defaultValue: false },
        { name: 'Deny', defaultValue: false },
        { name: 'DenyDisabled', defaultValue: false }
    ]
});