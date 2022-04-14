
Ext.define('YZSoft.esb.sprites.Transform.propertypages.Map', {
    extend: 'YZSoft.src.jmap.MapAbstract',

    constructor: function (config) {
        var me = this,
            designer = config.designer,
            sprite = config.sprite,
            properties = sprite.properties;

        me.srcTreeConfig = {
            title: RS.$('ESB_TreeTitle_Listener')
        };

        me.tagTreeConfig = {
            title: RS.$('ESB_TreeTitle_Response')
        };

        Ext.applyIf(config, {
            jsmCode: properties.outputCode
        });

        me.callParent(arguments);
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
        }, me.srcTreeConfig));

        tree.on({
            schemachanged: function () {
                listenerSprite.properties.outputSchema = tree.saveSchema();
            }
        });

        return tree;
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
            variables: false,
            localVariables: false,
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