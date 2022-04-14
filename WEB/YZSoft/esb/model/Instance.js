Ext.define('YZSoft.esb.model.Instance', {
    extend: 'Ext.data.Model',
    idProperty: 'TaskID',
    fields: [
        { name: 'TaskID', type: 'integer' },
        { name: 'FlowName', type: 'string' },
        { name: 'CreateBy', type: 'string' },
        { name: 'CreateAt', type: 'date' },
        { name: 'Status', type: 'string' },
        { name: 'FinishedAt', type: 'date' },
        { name: 'AsyncCall', type: 'boolean' },
        { name: 'ExtDate', type: 'date' }
    ]
});
