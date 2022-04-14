/*
config
designMode, //new,edit
folder,
designMode = edit
flowName
*/

Ext.define('YZSoft.esb.flowchart.AbstractPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.esb.ux.ClassManager',
        'YZSoft.esb.designer.ux.Stack',
        'YZSoft.src.jschema.data.JSchemaReader',
        'YZSoft.src.jschema.data.Reader'
    ],

    constructor: function (config) {
        var me = this;

        me.flowProperties = me.ensureFlowProperties();

        me.callParent(arguments);
    },

    ensureFlowProperties: function (properties) {
        properties = properties || {};

        if (!properties.Variables) {
            properties.Variables = {
                type: 'object',
                yzext: {
                    isVariables: true
                },
                properties: {
                }
            };
        }

        return properties;
    },

    openFlow: function (folder, flowName) {
        var me = this;

        YZSoft.Ajax.request({
            url: me.serviceUrl,
            params: {
                method: 'GetObjectDefine',
                folder: folder,
                objectName: flowName
            },
            waitMsg: {
                msg: RS.$('All_Loading'),
                target: me
            },
            success: function (action) {
                var doc = action.result;

                if (me.destroyed)
                    return;

                me.loadDoc(doc);
            }
        });
    },

    loadDoc: function (doc, silence) {
        var me = this,
            dcnt = me.drawContainer,
            surface, sprites = [];

        me.flowProperties = me.ensureFlowProperties({
            Variables: Ext.clone(doc.Variables)
        });

        Ext.each(doc.Nodes, function (node) {
            sprites.push(me.node2Sprite(node));
        });

        dcnt.removeAll(true);

        surface = dcnt.getSurface('main'); //必需在removeAll之后调用
        surface.setItems(sprites);

        if (silence !== true)
            dcnt.renderFrame();

        me.lastFlow = me.save && me.save(false);
    },

    node2Sprite: function (node) {
        return {
            xclass: YZSoft.esb.ux.ClassManager.getSpriteXClass(node.Type),
            sprites: {
                text: {
                    text: node.Name
                }
            },
            node:node
        };
    },

    getListenerSprite: function () {
        var me = this,
            dcnt = me.drawContainer,
            surface = dcnt.getSurface('main'),
            sprites = surface.getItems();

        return sprites[0];
    },

    getResponseSprite: function () {
        var me = this,
            dcnt = me.drawContainer,
            surface = dcnt.getSurface('main'),
            sprites = surface.getItems();

        return sprites[sprites.length-1];
    },

    getSpriteByName: function (spriteName) {
        var me = this,
            dcnt = me.drawContainer,
            surface = dcnt.getSurface('main'),
            sprites = surface.getItems();

        return Ext.Array.findBy(sprites, function (sprite) {
            return sprite.sprites.text.attr.text == spriteName;
        });
    },

    getVariables: function () {
        return this.flowProperties.Variables;
    },

    setVariables: function (tree, variables) {
        var me = this,
            oldVariables = this.flowProperties.Variables;

        this.flowProperties.Variables = variables;

        if (Ext.encode(oldVariables) != Ext.encode(variables))
            me.fireEvent('variableschanged', tree, variables);
    },

    getLocalVariables: function (sprite, readOnly) {
        var me = this,
            dcnt = me.drawContainer,
            surface = dcnt.getSurface('main'),
            sprites = surface.getItems(),
            variables = me.getVariables(),
            listenerSprite = me.getListenerSprite(),
            listenerSchema = listenerSprite.properties.outputSchema,
            responseSprite = me.getResponseSprite(),
            responseSchema = responseSprite.properties.inputSchema,
            stack = Ext.create('YZSoft.esb.designer.ux.Stack'),
            schema, rv;

        Ext.each(sprites, function (cursprite) {
            if (!cursprite.isNode)
                return;

            cursprite.walkEnter(stack);

            if (cursprite === sprite)
                return false;

            cursprite.walkLeave(stack);
        });

        schema = {
            type: 'object',
            properties: {
                Variables: variables
            }
        };
        Ext.apply(schema.properties, listenerSchema);
        Ext.apply(schema.properties, responseSchema);

        rv = me.resolveReference(stack.getVariables(readOnly), schema);
        stack.destroy();
        rv.yzext = {
            isLocalVariables: true
        };
        return rv;
    },

    resolveReference: function (variables, schema) {
        var me = this,
            refs = [],
            ref;

        YZSoft.src.jschema.data.JSchemaReader.walk(variables, function (node, path, type) {
            if (node.yzext && node.yzext.reference && Ext.Array.contains(['each'],node.yzext.reference.type)) {
                refs.push({
                    node: node,
                    tagPath: node.yzext.reference.tagPath
                });
            }
        });

        YZSoft.src.jschema.data.JSchemaReader.walk(schema, function (node, path, type) {
            for (var i = 0; i < refs.length; i++) {
                ref = refs[i];
                if (path == ref.tagPath) {
                    refs.splice(i, 1);
                    i--;

                    me.resolveReferenceItem(ref.node, node, type)
                }
            }
        });

        return variables;
    },

    resolveReferenceItem: function (refNode, tagNode, tagNodeType) {
        var me = this,
            fnName = Ext.String.format('resolve{0}Reference', Ext.String.capitalize(refNode.yzext.reference.type)),
            fn = me[fnName];

        fn && fn.apply(me, arguments);
    },

    resolveEachReference: function (refNode, tagNode, tagNodeType) {
        var ref = refNode.reference,
            reader = Ext.create('YZSoft.src.jschema.data.Reader');

        if (tagNodeType == 'array') {
            reader.resolveReference(tagNode);
            refNode.properties = Ext.clone(Ext.Array.from(tagNode.items)[0].properties);
        }
    }
});