Ext.define('YZSoft.bpa.src.toolbar.items.Headshort', {
    extend: 'Ext.Component',
    url: YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'),
    params: {
        Method: 'GetHeadshot',
        account: userInfo.Account,
        thumbnail: 'S'
    },
    renderTpl: [
        '<div class="bpa-headshort">',
            '<img class="img" style="width:100%;height:100%;" src="{src}" />',
        '</div>'
    ],

    initRenderData: function () {
        return Ext.apply(this.callParent(), {
            src: Ext.String.urlAppend(this.url, Ext.Object.toQueryString(this.params))
        });
    }
});