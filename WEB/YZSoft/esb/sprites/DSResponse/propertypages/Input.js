
Ext.define('YZSoft.esb.sprites.DSResponse.propertypages.Input', {
    extend: 'Ext.container.Container',
    layout: 'fit',

    initComponent: function () {
        var me = this,
            sprite = me.sprite,
            schema = sprite.properties.inputSchema;

        me.tree = Ext.create('YZSoft.esb.sprites.DSResponse.tree.InputTree', {
            schema: schema,
            viewConfig: {
                padding: '20 0'
            },
            listeners: {
                schemachanged: function () {
                    sprite.properties.inputSchema = me.tree.saveSchema();
                }
            }
        });

        me.items = [me.tree];
        me.callParent();
    }
});