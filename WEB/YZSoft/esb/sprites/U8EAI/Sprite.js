
Ext.define('YZSoft.esb.sprites.U8EAI.Sprite', {
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
    }
});
