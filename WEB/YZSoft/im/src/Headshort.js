Ext.define('YZSoft.im.src.Headshort', {
    extend: 'Ext.Component',
    url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
    params: {
        Method: 'GetHeadshot',
        account: userInfo.Account,
        thumbnail: 'M'
    },
    renderTpl: [
        '<div class="yz-im-headshort" style="background-image:url({src});">',
        '</div>'
    ],

    initRenderData: function () {
        return Ext.apply(this.callParent(), {
            src: Ext.String.urlAppend(this.url, Ext.Object.toQueryString(this.params))
        });
    }
});