﻿
Ext.define('YZSoft.esb.sprites.SQLServerProcedure.Sprite', {
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
    },

    archiveNode: function (final) {
        var me = this,
            data = me.callParent(),
            connectionName = data.Properties.connectionName,
            procedure = data.Properties.procedure;

        if (final && connectionName && procedure) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/DesignTime/SQLServer.ashx'),
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
