Ext.define('YZSoft.esb.esb5.src.model.Connect', {
    extend: 'Ext.data.Model',
    idProperty: 'connectId',
    fields: [
        { name: 'connectId' },
        { name: 'connectName' },
        { name: 'connectType' },
        { name: 'caption' },
        { name: 'connectStr'},
        { name: 'createTime'},
        { name: 'updateTime'},
        { name: 'isvalid' }
    ]
});