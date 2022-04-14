
Ext.define('YZSoft.esb.sprites.Transform.Sprite', {
    extend: 'YZSoft.esb.sprites.SpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#52be80'
            }
        }
    },
    sprites: {
        icon: {
            width: 32,
            height: 32
        }
    },
    properties: {
    },
    constProperties: {
    },

    constructor: function (config) {
        var me = this,
            node = config.node;

        if (node) {
            config.properties = {
                outputCode: node.outputCode
            };
        }

        me.callParent(arguments);
    },

    archiveNode: function () {
        var me = this;

        return {
            outputCode: me.properties.outputCode
        };
    }
});
