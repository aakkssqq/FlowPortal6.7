
Ext.define('YZSoft.esb.sprites.DSListener.Sprite', {
    extend: 'YZSoft.esb.sprites.SpriteAbstract',
    isListener: true,
    isDSListener: true,
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
        outputSchema: {
            Paging: {
                type: 'object',
                yzext: {
                    isPaging: true
                },
                properties: {
                    start: {
                        type: 'integer'
                    },
                    limit: {
                        type: 'integer'
                    },
                    sort: {
                        type: 'string'
                    }
                }
            },
            Parameters: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    param1: {
                        type: 'string'
                    },
                    param2: {
                        type: 'string'
                    },
                    param3: {
                        type: 'string'
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
                outputSchema: node.Schema
            };
        }

        me.callParent(arguments);
    },

    archiveNode: function () {
        var me = this;

        return {
            Schema: Ext.clone(me.properties.outputSchema)
        };
    },

    walkEnter: function (stack) {
        var me = this,
            properties = me.properties;

        stack.pushBlock();

        stack.push('LoginUser', {
            type: 'object',
            properties: {
                Account: {
                    type: 'string'
                },
                CostCenter: {
                    type: 'string'
                },
                DisplayName: {
                    type: 'string'
                },
                HRID: {
                    type: 'string'
                }
            }
        }, true);
    }
});
