
Ext.define('YZSoft.src.jmap.ESBActivityInputMap', {
    extend: 'YZSoft.src.jmap.MapAbstract',
    designer: null,
    sprite: null,

    constructor: function (config) {
        var me = this,
            designer = config.designer,
            sprite = config.sprite,
            properties = sprite.properties;

        Ext.apply(config, {
            jsmCode: properties.inputCode,
            tagSchema: properties.inputSchema
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
                properties.inputCode = newCode;
            }
        });

        me.on({
            tagschemachanged: function () {
                properties.inputSchema = me.tagTree.saveSchema();
            }
        });
    },

    createSrcTree: function (config) {
        var me = this,
            designer = config.designer,
            sprite = config.sprite,
            listenerSprite = designer.getListenerSprite(),
            treeClass = me.getOutputTreeXClass(listenerSprite),
            schema = listenerSprite.properties.outputSchema,
            cfg = {},
            tree;

        tree = Ext.create(treeClass, Ext.apply({
            designer: designer,
            sprite: sprite,
            variables: true,
            localVariables: true,
            isTagTree: false,
            schema: schema
        },me.srcTreeConfig));

        tree.on({
            schemachanged: function () {
                listenerSprite.properties.outputSchema = tree.saveSchema();
            }
        });

        return tree;
    }
});