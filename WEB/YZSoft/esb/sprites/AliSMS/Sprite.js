
Ext.define('YZSoft.esb.sprites.AliSMS.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#5499c7'
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
        outputSchema: {
            Response: {
                type: 'object',
                yzext: {
                    isPayload: true
                },
                properties: {
                    RequestId: {
                        type: 'string'
                    },
                    BizId: {
                        type: 'string'
                    }
                }
            }
        }
    }
});
