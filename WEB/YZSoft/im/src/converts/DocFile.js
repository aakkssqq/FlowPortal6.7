
Ext.define('YZSoft.im.src.converts.DocFile', {
    singleton: true,
    requires: [
        'YZSoft.src.ux.File'
    ],

    convert: function (body) {
        body = body || '';

        var me = this,
            idx = body.indexOf(','),
            fileid,fileInfo;

        fileid = idx == -1 ? body : body.substr(0, idx);

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                method: 'GetAttachmentInfo',
                fileid: fileid
            },
            success: function (action) {
                fileInfo = action.result;
            },
            failure: function () {
            }
        });

        if (!fileInfo)
            return RS.$('All_IM_File_NotExist');

        return Ext.String.format([
            '<div class="yz-social-item-doc" fileid="{0}">',
                '<div class="filenamewrap" style="background-image:url({1})">',
                    '<div class="filename">{2}</div>',
                    '<div class="size">{3}</div>',
                '</div>',
                '<div class="sp"></div>',
                '<div class="d-flex flex-row statuswrap">',
                    '<div class="flex-fill yz-column-center status"></div>',
                    '<div class="optbtn download">{4}</div>',
                '</div>',
            '</div>'].join(''),
            fileid,
            YZSoft.src.ux.File.getIconByExt(fileInfo.Ext, 32),
            YZSoft.HttpUtility.htmlEncode(fileInfo.Name),
            fileInfo.Size ? fileInfo.Size.toFileSize() : '',
            ''/*RS.$('All_Download')*/);
    },

    convertLM: function (id) {
        return RS.$('All__MessageConvert_File');
    }
});
