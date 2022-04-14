
Ext.define('YZSoft.esb.sprites.U8OpenAPI.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#ffffff',
                strokeStyle: '#4085c5',
                lineWidth: 1
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
        method: 'GET',
        inputSchema: {
            QueryParams: {
                type: 'object',
                yzext: {
                    isQueryParams: true
                },
                properties: {
                }
            },
            Payload: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                }
            }
        },
        outputSchema: {
            Response: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                }
            }
        }
    },

    walkEnter: function (stack) {
        var me = this,
            properties = me.properties,
            tradeid = properties.tradeid;

        stack.pushBlock();

        if (tradeid) {
            stack.push('tradeid', {
                type: 'string'
            }, true);
        }
    },

    walkLeave: function (stack) {
        stack.popBlock();
    }
});
