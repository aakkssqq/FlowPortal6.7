
Ext.define('YZSoft.esb.sprites.DingTalk.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass:'YZSoft.esb.sprites.DingTalk.tree.OutputTree',

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;


        me.srcTreeConfig = {
            title: RS.$('ESB_DingTalk_OutputTree_Title')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_TreeTitle_Response')
        };

        me.callParent(arguments);
    }
});