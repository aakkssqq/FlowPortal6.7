
Ext.define('YZSoft.esb.sprites.WordGenerator.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#48c9b0'
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
                    fileId: {
                        type: 'string'
                    },
                    fileName: {
                        type: 'string'
                    },
                    filePath: {
                        type: 'string'
                    }
                }
            }
        }
    }
});
