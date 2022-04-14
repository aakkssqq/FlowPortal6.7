Ext.define('YZSoft.bpa.src.model.FolderObject', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'isFile' },
        { name: 'FileID' },
        {
            name: 'url',
            calculate: function (data) {
                if (data.isFile)
                    return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                        method: 'GetProcessThumbnail',
                        fileid: data.FileID,
                        _dc: +new Date()
                    }));
            }
        }
    ]
});