/*
*/
Ext.define('YZSoft.src.Object', {
    singleton: true,
    propertyEncodeReg: new RegExp('(=|;)', 'g'),

    toPropertyString: function (object, spliter) {
        spliter = spliter || ';';

        var me = this,
            params = [];

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                params.push(me.encodePropertyValue(i) + '=' + me.encodePropertyValue(String(object[i])));
            }
        }

        return params.join(spliter);
    },

    fromPropertyString: function (propString, spliter) {
        spliter = spliter || ';';

        var me = this,
            object = {},
            parts = propString.split(spliter);

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = me.decodePropertyValue(components[0]);
                value = (components[1] !== undefined) ? me.decodePropertyValue(components[1]) : '';

                if (name)
                    object[name] = value;
            }
        }

        return object;
    },

    encodePropertyValue: function (value) {
        return value;
    },

    decodePropertyValue: function (value) {
        return value;
    }
}, function () {
    YZObject = this
});