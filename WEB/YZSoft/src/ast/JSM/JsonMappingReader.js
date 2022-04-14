
Ext.define('YZSoft.src.ast.JSM.JsonMappingReader', {
    singleton: true,

    walk: function (node, fn) {
        var me = this,
            path = [],
            ancestors = [],
            vars = [];

        (function c(node, fn) {
            fn(path, node, vars, ancestors);

            if (node.objectVar) {
                vars.push({
                    src: node.src,
                    objectVar: node.objectVar
                });
            }
            ancestors.push(node);

            Ext.Object.each(node.children, function (propertyName, value) {
                path.push(propertyName);

                c(value, fn);

                path.pop();
            });

            if (node.objectVar)
                vars.pop();

            ancestors.pop();

        })(node, fn);
    },

    walkto: function (node, tagPath, fn) {
        var me = this,
            ancestors = [],
            vars = [];

        Ext.each(tagPath, function (propertyName) {
            if (!node)
                return false;

            if (node.objectVar) {
                vars.push({
                    src: node.src,
                    objectVar: node.objectVar
                });
            }
            ancestors.push(node);

            node = node.children && node.children[propertyName];
        });

        if (node)
            fn(node, vars, ancestors);
    },

    getParentNode: function (node, path) {
        if (Ext.isString(path))
            path = path.split('.');

        path = path.slice(0, path.length-1);

        var me = this;

        Ext.each(path, function (propertyName) {
            node = node.children[propertyName];
        });

        return node;
    },

    getNode: function (node, path) {
        if (Ext.isString(path))
            path = path.split('.');

        if (path.length == 0)
            return node;

        var me = this,
            parentNode = me.getParentNode(node, path),
            propertyName = path[path.length - 1];

        return parentNode && parentNode.children[propertyName];
    },

    getPrevNode: function (node, path) {
        if (Ext.isString(path))
            path = path.split('.');

        if (path.length == 0)
            return;

        var me = this,
            parentNode = me.getParentNode(node, path),
            propertyName = path[path.length - 1],
            rv;

        if (parentNode) {
            Ext.Object.each(parentNode.children, function (childPropertyName, value) {
                if (childPropertyName == propertyName)
                    return false;

                rv = value;
            });
        }

        return rv;
    },

    getNextNode: function (node, path) {
        if (Ext.isString(path))
            path = path.split('.');

        if (path.length == 0)
            return;

        var me = this,
            parentNode = me.getParentNode(node, path),
            propertyName = path[path.length - 1],
            find,
            rv;

        if (parentNode) {
            Ext.Object.each(parentNode.children, function (childPropertyName, value) {
                if (find) {
                    rv = value;
                    return false;
                }

                if (childPropertyName == propertyName)
                    find = true;
            });
        }

        return rv;
    },

    findExistRootPath: function (node, path, separator) {
        separator = separator || '.';

        var me = this,
            path = Ext.isString(path) ? path.split(separator) : path,
            rv = [];

        Ext.each(path, function (propertyName) {
            if (node.children && node.children[propertyName]) {
                rv.push(propertyName);
                node = node.children[propertyName];
            }
            else
                return false;
        });

        return rv;
    },

    resolveParams: function (param, vars) {
        var var1;

        for (var i = vars.length - 1; i >= 0; i--) {
            var1 = vars[i];

            if (Ext.String.startsWith(param, var1.objectVar))
                param = (var1.src || '') + param.substring(var1.objectVar.length);
        }
        return param;
    }
});