Ext.define('YZSoft.src.model.Group', {
    extend: 'Ext.data.Model',
    idProperty: 'GroupID',
    fields: [
        { name: 'GroupID' },
        { name: 'ImageFileID' },{
            name: 'ImageUrl',
            depends: ['ImageFileID'],
            convert: function (v, rec) {
                var imageFileId = rec.data.ImageFileID;

                if (imageFileId) {
                    var params = {
                        Method: 'ImageStreamFromFileID',
                        fileid: imageFileId,
                        scale: 'Scale',
                        width: 161,
                        height: 139
                    };

                    return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString(params));
                }
                else
                    return YZSoft.$url('BPA/Styles/ui/group_icon.png');
            }
        }
    ]
});
