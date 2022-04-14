
Ext.define('YZSoft.esb.sprites.MySQLCommand.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#af7ac5'
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
