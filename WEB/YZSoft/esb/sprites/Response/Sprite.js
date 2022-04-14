
Ext.define('YZSoft.esb.sprites.Response.Sprite', {
    extend: 'YZSoft.esb.sprites.SpriteAbstract',
    isResponse: true,
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
    dragable: false,
    properties: {
        inputSchema: {
            Response: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    strReturnValue: {
                        type: 'string'
                    },
                    iReturnValue: {
                        type: 'integer'
                    },
                    fReturnValue: {
                        type: 'number'
                    }
                }
            }
        }
    },

    constructor: function (config) {
        var me = this,
            node = config.node;

        if (node && 'Schema' in node) {
            config.properties = {
                inputSchema: node.Schema
            };
        }

        me.callParent(arguments);
    },

    archiveNode: function () {
        var me = this;

        return {
            Schema: Ext.clone(me.properties.inputSchema)
        };
    },

    walkLeave: function (stack) {
        stack.popBlock();
    }
});
