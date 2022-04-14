Ext.define('YZSoft.queue.model.Queue', {
    extend: 'Ext.data.Model',
    idProperty: 'MessageID',
    fields: [
        { name: 'MessageID', type: 'integer' },
        { name: 'Server', type: 'string' },
        { name: 'QueueName', type: 'string' },
        { name: 'HandlerType', type: 'string' },
        { name: 'HandlerMethod', type: 'string' },
        {
            name: 'Params', convert: function (v) {
                return Ext.decode(v);
            }
        },
        { name: 'CreateAt', type: 'date' },
        { name: 'ProcessSchedule', type: 'date' },
        { name: 'FailCount', type: 'integer' },
        { name: 'ErrorMessage', type: 'string' },
        { name: 'LastFailAt', type: 'date' }
    ]
});
