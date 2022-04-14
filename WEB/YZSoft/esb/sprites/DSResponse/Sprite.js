
Ext.define('YZSoft.esb.sprites.DSResponse.Sprite', {
    extend: 'YZSoft.esb.sprites.SpriteAbstract',
    isResponse: true,
    isDSResponse: true,
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
                    total: {
                        type: 'integer'
                    },
                    rows: {
                        type: 'array',
                        yzext: {
                            isRows: true
                        },
                        items: {
                            type: 'object',
                            properties: {
                                column1: {
                                    type: 'string'
                                },
                                column2: {
                                    type: 'string'
                                },
                                column3: {
                                    type: 'string'
                                }
                            }
                        }
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
