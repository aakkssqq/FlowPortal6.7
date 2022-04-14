
Ext.define('YZSoft.esb.sprites.KingdeeEAS.Sprite', {
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

    archiveNode: function (final) {
        var me = this,
            data = me.callParent();

        if (final) {
            if (data.Properties.connectionName && data.Properties.offsetUrl) {
                YZSoft.Ajax.request({
                    async: false,
                    url: YZSoft.$url('YZSoft.Services.REST/DesignTime/KingdeeEAS.ashx'),
                    params: {
                        method: 'GetHashCode',
                        connectionName: data.Properties.connectionName,
                        offsetUrl: data.Properties.offsetUrl
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
    }
});
