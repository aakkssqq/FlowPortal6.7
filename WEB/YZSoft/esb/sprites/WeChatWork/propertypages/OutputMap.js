
Ext.define('YZSoft.esb.sprites.WeChatWork.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass:'YZSoft.esb.sprites.WeChatWork.tree.OutputTree',

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;


        me.srcTreeConfig = {
            title: RS.$('ESB_WeChatWork_OutputTree_Title')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_TreeTitle_Response')
        };

        me.callParent(arguments);
    }
});