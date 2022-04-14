
Ext.define('YZSoft.esb.sprites.Response.propertypages.Input', {
    extend: 'Ext.container.Container',
    layout: 'fit',

    initComponent: function () {
        var me = this,
            sprite = me.sprite,
            schema = sprite.properties.inputSchema;

        me.tree = Ext.create('YZSoft.esb.sprites.Response.tree.InputTree', {
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