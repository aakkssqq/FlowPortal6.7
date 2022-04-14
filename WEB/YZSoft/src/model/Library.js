Ext.define('YZSoft.src.model.Library', {
    extend: 'Ext.data.Model',
    idProperty: 'LibID',
    fields: [
        { name: 'LibID' },
        { name: 'ImageFileID' }, {
            name: 'ImageUrl',
            depends: ['ImageFileID'],
            convert: function (v, rec) {
                var imageFileId = rec.data.ImageFileID;

                if (imageFileId) {
                    var params = {
                        Method: 'ImageStreamFromFileID',
                        fileid: imageFileId,
                        scale: 'Scale',
                        width: 120,
                        height: 120
                    };

                    return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString(params));
                }
                else
                    return YZSoft.$url('BPA/Styles/ui/lib_icon.png');
            }
        }
    ],

    getRsid: function () {
        return 'Library://' + this.getId();
    }
});
