
Ext.define('YZSoft.src.jmap.ESBActivityOutputMap', {
    extend: 'YZSoft.src.jmap.MapAbstract',
    designer: null,
    sprite: null,

    constructor: function (config) {
        var me = this,
            designer = config.designer,
            sprite = config.sprite,
            properties = sprite.properties;

        Ext.applyIf(config, {
            jsmCode: properties.outputCode,
            srcSchema: properties.outputSchema
        });

        me.callParent([config]);
    },

    initComponent: function () {
        var me = this,
            designer = me.designer,
            sprite = me.sprite,
            properties = sprite.properties;

        me.callParent();

        me.linkPanel.on({
            codechange: function (newCode) {
                properties.outputCode = newCode;
            }
        });

        me.on({
            srcschemachanged: function () {
                properties.outputSchema = me.srcTree.saveSchema();
            }
        });
    },

    createTagTree: function (config) {
        var me = this,
            designer = config.designer,
            sprite = config.sprite,
            responseSprite = designer.getResponseSprite(),
            treeClass = me.getInputTreeXClass(responseSprite),
            schema = responseSprite.properties.inputSchema,
            cfg = {},
            tree;

        tree = Ext.create(treeClass, Ext.apply({
            designer: designer,
            sprite: sprite,
            variables: true,
            localVariables: true,
            isTagTree: true,
            schema: schema
        }, me.tagTreeConfig));

        tree.on({
            schemachanged: function () {
                responseSprite.properties.inputSchema = tree.saveSchema();
            }
        });

        return tree;
    }
});