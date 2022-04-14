
Ext.define('YZSoft.esb.sprites.DSListener.propertypages.Output', {
    extend: 'Ext.container.Container',
    layout: 'fit',

    initComponent: function () {
        var me = this,
            sprite = me.sprite,
            schema = sprite.properties.outputSchema;

        me.tree = Ext.create('YZSoft.esb.sprites.DSListener.tree.OutputTree', {
            schema: schema,
            viewConfig: {
                padding: '20 0'
            },
            listeners: {
                schemachanged: function () {
                    sprite.properties.outputSchema = me.tree.saveSchema();
                }
            }
        });

        me.items = [me.tree];
        me.callParent();
    }
});