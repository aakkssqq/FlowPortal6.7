
Ext.define('YZSoft.im.src.converts.LocalDocFile', {
    singleton: true,

    convert: function (obj) {
        var me = this;

        return Ext.String.format([
            '<div class="yz-social-item-doc queued" uploadid="{0}">',
                '<div class="filenamewrap" style="background-image:url({1})">',
                    '<div class="filename">{2}</div>',
                    '<div class="size">{3}</div>',
                '</div>',
                '<div class="progresswrap">',
                    '<div class="progress"></div>',
                '</div>',
                '<div class="sp"></div>',
                '<div class="d-flex flex-row statuswrap">',
                    '<div class="flex-fill status">{4}</div>',
                    '<div class="optbtn cancel">{5}</div>',
                    '<div class="optbtn download">{6}</div>',
                '</div>',
            '</div>'].join(''),
            obj.uploadid,
            YZSoft.src.ux.File.getIconByExt(obj.Ext, 32),
            YZSoft.HttpUtility.htmlEncode(obj.Name),
            obj.Size ? obj.Size.toFileSize() : '',
            RS.$('All_IM_Upload_Queued'),
            RS.$('All_Cancel'),
            RS.$('All_Download'));
    },

    convertLM: function (obj) {
        return Ext.String.format(RS.$('All__SystemRemind'));
    }
});
