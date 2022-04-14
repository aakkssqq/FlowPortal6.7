
Ext.define('YZSoft.im.src.converts.LocalImageFile', {
    singleton: true,

    convert: function (uri) {
        return Ext.String.format('<img class="yz-social-item-img" uri="{0}" src="{1}" />', uri, uri);
    }
});
