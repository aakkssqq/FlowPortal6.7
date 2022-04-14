
Ext.define('YZSoft.im.src.converts.LocalAudioFile.', {
    singleton: true,

    convert: function (uri) {
        return Ext.String.format('<div class="yz-social-item-audio" uri="{0}"></div>', uri);
    }
});
