
Ext.define('YZSoft.esb.sprites.U8OpenAPI.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass:'YZSoft.esb.sprites.U8OpenAPI.tree.OutputTree',
    config: {
    },

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_U8OpenAPI_OutputTree_Title')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_TreeTitle_Response')
        };

        Ext.apply(config, {
        });

        me.callParent(arguments);
    }
});