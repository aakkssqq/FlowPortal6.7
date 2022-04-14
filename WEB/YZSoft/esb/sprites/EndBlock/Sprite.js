
Ext.define('YZSoft.esb.sprites.EndBlock.Sprite', {
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
            };
        }

        me.callParent(arguments);
    },

    archiveNode: function () {
        var me = this;

        return {
        };
    },

    walkLeave: function (stack) {
        stack.popBlock();
    }
});
