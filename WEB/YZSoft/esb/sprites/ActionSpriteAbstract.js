/*
*/
Ext.define('YZSoft.esb.sprites.ActionSpriteAbstract', {
    extend: 'YZSoft.esb.sprites.SpriteAbstract',
    isAction: true,

    constructor: function (config) {
        var me = this,
            node = config.node;

        if (node)
            config.properties = Ext.apply({}, Ext.clone(node.Properties), me.properties);

        me.callParent(arguments);
    },

    archiveNode: function () {
        var me = this;

        return {
            Properties: Ext.clone(me.properties)
        };
    }
});