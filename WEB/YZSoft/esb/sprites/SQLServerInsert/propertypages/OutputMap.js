
Ext.define('YZSoft.esb.sprites.SQLServerInsert.propertypages.OutputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityOutputMap',
    srcTreeXClass: 'YZSoft.esb.sprites.SQLServerInsert.tree.OutputTree',

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;


        me.srcTreeConfig = {
            title: RS.$('ESB_DB_OutputTree_Title')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_TreeTitle_Response')
        };

        me.callParent(arguments);
    }
});