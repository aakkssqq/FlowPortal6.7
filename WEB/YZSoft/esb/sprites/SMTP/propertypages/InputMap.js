
Ext.define('YZSoft.esb.sprites.SMTP.propertypages.InputMap', {
    extend: 'YZSoft.src.jmap.ESBActivityInputMap',
    tagTreeXClass:'YZSoft.esb.sprites.SMTP.tree.InputTree',

    constructor: function (config) {
        var me = this,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_SMTP_InputTree_Title')
        };

        me.callParent(arguments);
    }
});