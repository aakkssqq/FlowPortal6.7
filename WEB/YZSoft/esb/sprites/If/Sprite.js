
Ext.define('YZSoft.esb.sprites.If.Sprite', {
    extend: 'YZSoft.esb.sprites.FlowControlSpriteAbstract',
    properties: {
    },
    constProperties: {
    },

    constructor: function (config) {
        var me = this,
            node = config.node;

        if (node) {
            config.properties = {
                express: node.express
            };
        }

        me.callParent(arguments);
    },

    archiveNode: function () {
        var me = this;

        return {
            express: me.properties.express
        };
    },

    walkEnter: function (stack) {
        var me = this,
            properties  = me.properties;

        stack.pushBlock();
    }
});
