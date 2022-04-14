
Ext.define('YZSoft.esb.sprites.WebService.Sprite', {
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
        locationType: 'SameAsWsdl'
    },

    archiveNode: function (final) {
        var me = this,
            data = me.callParent();

        if (final) {
            if (data.Properties.connectionName/* && data.Properties.offsetUrl*/) {
                YZSoft.Ajax.request({
                    async: false,
                    url: YZSoft.$url('YZSoft.Services.REST/DesignTime/WebService.ashx'),
                    params: {
                        method: 'GetHashCode',
                        connectionName: data.Properties.connectionName,
                        wsdlOffsetUrl: data.Properties.wsdlOffsetUrl
                    },
                    success: function (action) {
                        Ext.apply(data.Properties, {
                            version: action.result
                        });
                    }
                });
            }
        }

        return data;
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
                    method: 'GetWebServiceConnectionExtAttrsSchema',
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
