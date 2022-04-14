
Ext.define('YZSoft.esb.sprites.RESTful.Sprite', {
    extend: 'YZSoft.esb.sprites.ActionSpriteAbstract',
    inheritableStatics: {
        def: {
            defaults: {
                fillStyle: '#469df7'
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
        method: 'POST'
    },

    walkEnter: function (stack) {
        var me = this,
            properties = me.properties,
            connectionName = properties.connectionName;

        stack.pushBlock();

        if (connectionName) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/Connections/Service.ashx'),
                params: {
                    method: 'GetRestfulConnectionExtAttrsSchema',
                    connectionName: connectionName
                },
                success: function (action) {
                    if (!Ext.Object.isEmpty(action.result)) {
                        stack.push('ConnectionProperties', {
                            type: 'object',
                            properties: action.result
                        }, true);
                    }
                }
            });
        }
    },

    walkLeave: function (stack) {
        stack.popBlock();
    }
});
