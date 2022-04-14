
Ext.define('YZSoft.src.ast.JSM.JSM2JsonConvert', {
    singleton: true,
    requires: [
        'YZSoft.src.ast.Walk',
        'YZSoft.src.ast.ParamsParser'
    ],

    convert: function (ast,withNode) {
        var me = this,
            withNode = withNode !== false,
            resultNode = me.lookupResultObjectNode(ast);

        return Ext.apply({
            isRoot: true
        }, me.convertExpression(resultNode, withNode));
    },

    lookupResultObjectNode: function (node) {
        var find;

        YZSoft.src.ast.Walk.simple(node, {
            VariableDeclaration: function (node) {
                if (!find &&
                    node.Declarations[0] &&
                    node.Declarations[0].Id && node.Declarations[0].Id.Name == '$result' &&
                    node.Declarations[0].Init && node.Declarations[0].Init.Type == 'ObjectExpression') {
                    find = node.Declarations[0].Init;
                }
            }
        });

        return find;
    },

    lookupMapFuncReturnObjectNode: function (node) {
        var find;

        YZSoft.src.ast.Walk.simple(node, {
            ReturnStatement: function (node) {
                if (!find &&
                    node.Argument.Type == 'ObjectExpression') {
                    find = node.Argument;
                }
            }
        });

        return find;
    },

    convertExpression: function (node, withNode) {
        var me = this;

        if (!node)
            return null;

        switch (node.Type) {
            case 'ObjectExpression':
                return me.convertObjectExpression(node, withNode);
            case 'CallExpression':
                if (node.Callee.Name == 'map' &&
                    node.Arguments.length >= 2 &&
                    node.Arguments[1].Type == 'FunctionExpression' &&
                    node.Arguments[1].Parameters.length >= 1)
                    return me.convertMapExpression(node, withNode);
                else
                    return me.convertPropertyExpression(node, withNode);
            case 'ArrayExpression':
                if (node.Elements.length == 1 &&
                    node.Elements[0].Type == 'ObjectExpression')
                    return me.convertSimpleArrayExpression(node, withNode);
                else
                    return me.convertPropertyExpression(node, withNode);
            default:
                return me.convertPropertyExpression(node, withNode);
        }
    },

    convertObjectExpression: function (node, withNode) {
        var me = this,
            rv;
        
        rv = {
            isObejct: true,
            node: withNode ? node:undefined,
            children: {}
        };

        Ext.each(node.Properties, function (property) {
            switch (property.Kind) {
                case 'Data':
                    rv.children[property.Key.Name || property.Key.Value] = Ext.apply({
                        propertyNode: withNode ? property:undefined
                    }, me.convertExpression(property.Value, withNode)); //属性名带''时在Value中，如：'prop(1)'
                    break;
                case 'Get':
                case 'Set':
                    break;
            }
        });

        return rv;
    },

    convertSimpleArrayExpression: function (node, withNode) {
        var me = this;

        return {
            isObejct: true,
            isArray: true,
            node: withNode ? node.Elements[0] : undefined,
            arrayNode: withNode ? node : undefined,
            children: me.convertObjectExpression(node.Elements[0], withNode).children
        };
    },

    convertPropertyExpression: function (node, withNode) {
        return {
            isProperty: true,
            node: withNode ? node:undefined,
            params: YZSoft.src.ast.ParamsParser.parse(node)
        };
    },

    convertMapExpression: function (node, withNode) {
        var me = this,
            returnNode = me.lookupMapFuncReturnObjectNode(node.Arguments[1].Body),
            returnObject;

        if (returnNode)
            returnObject = me.convertExpression(returnNode, withNode);

        return {
            isMap: true,
            node: withNode ? returnNode:undefined,
            callMapNode: withNode ? node:undefined,
            src: me.convertExpression(node.Arguments[0], withNode).params[0],
            objectVar: node.Arguments[1].Parameters[0].Name,
            children: returnObject && returnObject.children
        };
    }
});