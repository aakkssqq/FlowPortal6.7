Ext.define('YZSoft.queue.model.QueueFailed', {
    extend: 'Ext.data.Model',
    idProperty: 'MessageID',
    fields: [
        { name: 'MessageID', type: 'integer' },
        { name: 'Server', type: 'string' },
        { name: 'QueueName', type: 'string' },
        { name: 'CreateAt', type: 'date' },
        { name: 'RemoveAt', type: 'date' },
        { name: 'FailCount', type: 'integer' },
        { name: 'ErrorMessage', type: 'string' },
        { name: 'LastFailAt', type: 'date' },
        { name: 'retrying', type: 'boolean', defaultValue: false },
        { name: 'retrySucceed', type: 'boolean', defaultValue: false }
    ]
});
