
Ext.define('YZSoft.esb.sprites.DingTalk.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.DingTalk.tree.InputTree',

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_DingTalk_InputTree_Title')
        };

        me.callParent(arguments);
    }
});