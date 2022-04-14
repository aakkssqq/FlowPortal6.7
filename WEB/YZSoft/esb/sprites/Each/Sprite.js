
Ext.define('YZSoft.esb.sprites.Each.Sprite', {
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
                each: node.each,
                itemVar: node.itemVar,
                indexVar: node.indexVar
            };
        }

        me.callParent(arguments);
    },

    archiveNode: function () {
        var me = this;

        return {
            each: me.properties.each,
            itemVar: me.properties.itemVar,
            indexVar: me.properties.indexVar
        };
    },

    walkEnter: function (stack) {
        var me = this,
            properties  = me.properties;

        stack.pushBlock();

        if (properties.itemVar && properties.each) {
            stack.push(properties.itemVar, {
                type: 'object',
                yzext: {
                    reference: {
                        type: 'each',
                        tagPath: properties.each
                    }
                }
            });
        }

        if (properties.indexVar) {
            stack.push(properties.indexVar, {
                type: 'integer'
            });
        }
    }
});
