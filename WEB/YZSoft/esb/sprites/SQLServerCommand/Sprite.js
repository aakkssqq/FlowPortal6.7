
Ext.define('YZSoft.esb.sprites.SQLServerCommand.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#a3c67a'
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
            Result: {
                type: 'object',
                yzext: {
                    isResponse: true
                },
                properties: {
                    rowsAffected: {
                        type: 'integer'
                    }
                }
            }
        }
    }
});
