
Ext.define('YZSoft.esb.sprites.MySQLProcedure.Sprite', {
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
    },

    archiveNode: function (final) {
        var me = this,
            data = me.callParent(),
            connectionName = data.Properties.connectionName,
            procedure = data.Properties.procedure;

        if (final && connectionName && procedure) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/DesignTime/MySQL.ashx'),
                params: {
                    method: 'GetProcedureParams',
                    connectionName: connectionName,
                    procedure: procedure
                },
                success: function (action) {
                    Ext.apply(data.Properties, {
                        parametes: action.result
                    });
                },
                failure: function (action) {
                    Ext.raise({
                        msg: action.result.errorMessage
                    });
                }
            });
        }

        return data;
    }
});
