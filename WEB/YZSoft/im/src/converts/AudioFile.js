
Ext.define('YZSoft.im.src.converts.AudioFile', {
    singleton: true,

    convert: function (id) {
        return Ext.String.format('<div class="yz-social-item-audio" fileid="{0}"></div>', id);
    },

    convertLM: function (id) {
        return RS.$('All__MessageConvert_Audio');
    }
});
