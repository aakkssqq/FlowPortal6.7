Ext.define('YZSoft.bpm.src.model.DirectXS', {
    extend: 'Ext.data.Model',
    idProperty: 'MemberFullName',
    fields: [
        { name: 'UserAccount' },
        { name: 'UserFullName' },
        { name: 'MemberFullName' },
        { name: 'FGYWEnabled' },
        { name: 'FGYWs' }
    ]
});