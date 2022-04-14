Ext.define('YZSoft.im.src.model.Channel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'resType', type: 'string' },
        { name: 'resId', type: 'string' },
        { name: 'newmessage', type: 'int' },
        { name: 'total', type: 'int' },
        { name: 'lastMsgId', type: 'int' },
        { name: 'uid', type: 'string' },
        { name: 'date', type: 'date' },
        { name: 'message', type: 'string' },
        { name: 'replyto', type: 'int' },
        { name: 'duration', type: 'int' },
        { name: 'resName', type: 'string' },
        { name: 'ext' }
    ]
});