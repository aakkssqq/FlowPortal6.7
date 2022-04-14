
Ext.define('YZSoft.esb.sprites.U8OpenAPI.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.U8OpenAPI.tree.InputTree',
    config: {
        tradeid: null
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_U8OpenAPI_InputTree_Title')
        };

        Ext.apply(config, {
            tradeid: properties.tradeid
        });

        me.callParent(arguments);
    },

    updateTradeid: function (newValue) {
        this.dirty = true;
    },

    dirtyRefresh: function () {
        this.srcTree.updateLocalVariables();
    }
});