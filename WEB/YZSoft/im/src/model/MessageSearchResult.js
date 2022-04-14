Ext.define('YZSoft.im.src.model.MessageSearchResult', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'string' },
        { name: 'resName', type: 'string' },
        { name: 'resType', type: 'string' },
        { name: 'resId', type: 'string' },
        { name: 'total', type: 'int' },
        { name: 'lastMsgId', type: 'int' },
        { name: 'uid', type: 'string' },
        { name: 'date', type: 'date' },
        { name: 'message', type: 'string' },
        { name: 'replyto', type: 'int' },
        { name: 'duration', type: 'int' },
        { name: 'ext' },
        {
            name: 'headsort',
            depends: ['uid'],
            convert: function (v, rec) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: rec.data.uid,
                    thumbnail: 'S'
                }));
            }
        }
    ]
});