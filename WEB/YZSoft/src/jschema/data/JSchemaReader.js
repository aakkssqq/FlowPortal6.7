
Ext.define('YZSoft.src.jschema.data.JSchemaReader', {
    singleton: true,

    $: function (type) {
        if (Ext.isArray(type))
            return type[0];
        else
            return type;
    },

    walk: function (node, fn) {
        var me = this,
            path = [],
            type, items;

        (function c(node, fn) {
            type = me.$(node.type);

            fn(node, path.join('.'), type);

            if (type === 'object') {
                Ext.Object.each(node.properties, function (propertyName, value) {
                    path.push(propertyName);
                    c(value, fn);
                    path.pop();
                });
            }
            else if (type === 'array') {
                items = Ext.Array.from(node.items);

                if (items.length == 1 && me.$(items[0].type) == 'object') {
                    Ext.Object.each(items[0].properties, function (propertyName, value) {
                        path.push(propertyName);
                        c(value, fn);
                        path.pop();
                    });
                }
            }
        })(node, fn);
    }
});