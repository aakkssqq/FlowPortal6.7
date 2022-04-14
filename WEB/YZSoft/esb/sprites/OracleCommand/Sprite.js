
Ext.define('YZSoft.esb.sprites.OracleCommand.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#e8413e'
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
