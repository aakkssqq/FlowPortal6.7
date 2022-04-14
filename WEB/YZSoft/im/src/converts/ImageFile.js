
Ext.define('YZSoft.im.src.converts.ImageFile', {
    singleton: true,
    requires: [
        'YZSoft.src.util.Image'
    ],

    convert: function (id) {
        var me = this,
            url, size;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                Method: 'GetImageSize',
                fileid: id
            },
            success: function (action) {
                size = action.result;
            }
        });

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            scale: 'Scale',
            format: 'png',
            width: 540,
            height: 600,
            fileid: id
        }));

        size = YZSoft.src.util.Image.getImageDisplaySize(size, {
            width: 180,
            height: 200
        });

        return Ext.String.format('<img class="yz-social-item-img" fileid="{0}" src="{1}" style="width:{2}px;height:{3}px"/>', id, url, size.width, size.height);
    },

    convertLM: function (id) {
        return RS.$('All__MessageConvert_Image');
    }
});
