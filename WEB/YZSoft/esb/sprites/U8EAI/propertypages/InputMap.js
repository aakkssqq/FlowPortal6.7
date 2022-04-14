
Ext.define('YZSoft.esb.sprites.U8EAI.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.U8EAI.tree.InputTree',
    config: {
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_U8EAI_InputTree_Title')
        };

        Ext.apply(config, {
        });

        me.callParent(arguments);
    }
});