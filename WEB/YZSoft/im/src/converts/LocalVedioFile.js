
Ext.define('YZSoft.im.src.converts.LocalVedioFile', {
    singleton: true,

    convert: function (uri) {
        return Ext.String.format('<img class="yz-social-item-video" src="{0}"></img>', uri);
    }
});
