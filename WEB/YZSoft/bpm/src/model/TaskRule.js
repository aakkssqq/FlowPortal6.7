Ext.define('YZSoft.bpm.src.model.TaskRule', {
    extend: 'Ext.data.Model',
    idProperty: 'RuleID',
    fields: [
        { name: 'RuleID' },
        { name: 'RuleTypeName' },
        { name: 'ProcessDefineType' },
        { name: 'ProcessItems' },
        { name: 'Delegators' },
        { name: 'Condition' },
        { name: 'Enabled' }
    ]
});
