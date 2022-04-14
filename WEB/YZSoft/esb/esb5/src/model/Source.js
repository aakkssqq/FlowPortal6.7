Ext.define('YZSoft.esb.esb5.src.model.Source', {
    extend: 'Ext.data.Model',
    idProperty: 'sourceId',
    fields: [
        { name: 'sourceId' },
        { name: 'sourceName' },
        { name: 'sourceType' },
        { name: 'connectInfo' },
        { name: 'sourceStr' },
        { name: 'caption' },
        { name: 'createTime' },
        { name: 'updateTime' },
        { name: 'connectId' },
        { name: 'isvalid' }
    ]
});