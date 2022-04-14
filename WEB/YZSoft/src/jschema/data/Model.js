
Ext.define('YZSoft.src.jschema.data.Model', {
    extend: 'Ext.data.Model',
    fields: [
    ],
    typeDisplayNames: {
        string: function (item, scope) {
            if (item.format == 'date')
                return "Date";
            else if(item.format == 'date-time')
                return "DateTime";
            else
                return "String";
        },
        number: 'Number',
        integer: 'Integer',
        boolean: 'Boolean',
        object: function (item, scope) {
            var me = scope;

            //if (item.yzext && item.yzext.isDataSet)
            //    return 'DataSet';

            return 'Object';

        }, 
        array: function (item, scope) {
            var me = scope,
                items = Ext.Array.from(item.items),
                childTypes = [],
                type;

            //if (item.yzext && item.yzext.isDataTable)
            //    return 'DataTable';

            Ext.each(items, function (item) {
                childTypes.push(me.getTypeDisplayName(item));
            });

            if (Ext.isArray(item.items))
                type = 'Tuple';
            else
                type = 'Array';

            return Ext.String.format('{0}<{1}>', type, childTypes.join(','));
        },
        null: 'None'
    },

    constructor: function (data, session) {
        var me = this;

        data.tag = Ext.clone(data);
        if (data.type)
            me[data.type + 'Convert'](data);
        else
            me.nullConvert(data);

        me.callParent(arguments);
    },

    isArray: function () {
        var me = this,
            items = Ext.Array.from(me.data.tag.items);

        return me.$(me.data.type) == 'array' && items.length == 1 && me.$(items[0].type) == 'object';
    },

    isString: function () {
        var me = this,
            items = Ext.Array.from(me.data.tag.items);

        return me.$(me.data.type) == 'string';
    },

    isStringArray: function () {
        var me = this,
            items = Ext.Array.from(me.data.tag.items);

        return me.$(me.data.type) == 'array' && items.length == 1 && me.$(items[0].type) == 'string';
    },

    isAnyArray: function () {
        var me = this,
            items = Ext.Array.from(me.data.tag.items);

        return me.$(me.data.type) == 'array' && items.length == 1 && !me.$(items[0].type);
    },

    is: function (name) {
        return this.data.yzext && this.data.yzext['is' + Ext.String.capitalize(name)];
    },

    isChildOf: function (name) {
        if (this.parentNode == null || this.parentNode.isRoot())
            return false;

        if (this.parentNode.is(name))
            return true;

        return this.parentNode.isChildOf(name);
    },

    isDecodeField: function () {
        return this.data.yzext && this.data.yzext.decode && this.data.yzext.decode.enabled;
    },

    isChildOfDecodeField: function () {
        if (this.parentNode == null || this.parentNode.isRoot())
            return false;

        if (this.parentNode.isDecodeField())
            return true;

        return this.parentNode.isChildOfDecodeField();
    },

    isEncodeField: function () {
        return this.data.yzext && this.data.yzext.encode && this.data.yzext.encode.enabled;
    },

    isChildOfEncodeField: function () {
        if (this.parentNode == null || this.parentNode.isRoot())
            return false;

        if (this.parentNode.isEncodeField())
            return true;

        return this.parentNode.isChildOfEncodeField();
    },

    $: function (type) {
        if (Ext.isArray(type))
            return type[0];
        else
            return type;
    },

    getTypeDisplayName: function (item) {
        var me = this,
            displayName = me.typeDisplayNames[me.$(item.type)];

        if (!displayName)
            return 'Any';

        if (Ext.isString(displayName))
            return displayName;
        else
            return displayName(item, me);
    },

    stringConvert: function (data) {
        var me = this;

        Ext.apply(data, {
            text: Ext.String.format('{0}<span class="yz-jsonschema-type-sp">:</span><span class="yz-jsonschema-type">{1}</span>', data.propertyName, me.getTypeDisplayName(data)),
            leaf: true
        });
    },
    numberConvert: function (data) {
        var me = this;

        Ext.apply(data, {
            text: Ext.String.format('{0}<span class="yz-jsonschema-type-sp">:</span><span class="yz-jsonschema-type">{1}</span>', data.propertyName, me.getTypeDisplayName(data)),
            leaf: true
        });
    },
    integerConvert: function (data) {
        var me = this;

        Ext.apply(data, {
            text: Ext.String.format('{0}<span class="yz-jsonschema-type-sp">:</span><span class="yz-jsonschema-type">{1}</span>', data.propertyName, me.getTypeDisplayName(data)),
            leaf: true
        });
    },
    objectConvert: function (data) {
        var me = this;

        Ext.apply(data, {
            text: Ext.String.format('{0}<span class="yz-jsonschema-type-sp">:</span><span class="yz-jsonschema-type">{1}</span>', data.propertyName, me.getTypeDisplayName(data)),
            leaf: false,
            expanded: true
        });
    },
    arrayConvert: function (data) {
        var me = this,
            items = Ext.Array.from(data.items);

        Ext.apply(data, {
            text: Ext.String.format('{0}<span class="yz-jsonschema-type-sp">:</span><span class="yz-jsonschema-type">{1}</span>', data.propertyName, Ext.String.htmlEncode(me.getTypeDisplayName(data)))
        });

        if (items.length == 1 && me.$(items[0].type) == 'object') {
            Ext.apply(data, {
                leaf: false,
                expanded: true
            });
        }
        else {
            Ext.apply(data, {
                leaf: true
            });
        }
    },
    booleanConvert: function (data) {
        var me = this;

        Ext.apply(data, {
            text: Ext.String.format('{0}<span class="yz-jsonschema-type-sp">:</span><span class="yz-jsonschema-type">{1}</span>', data.propertyName, me.getTypeDisplayName(data)),
            leaf: true
        });
    },
    nullConvert: function (data) {
        var me = this;

        Ext.apply(data, {
            text: Ext.String.format('{0}<span class="yz-jsonschema-type-sp">:</span><span class="yz-jsonschema-type">{1}</span>', data.propertyName, me.getTypeDisplayName(data)),
            leaf: true
        });
    },

    getJsonSchama: function () {
        return this.data.tag;
    },

    getTypeDescriptsPath: function () {
        var rv = [];

        (function c(record) {
            if (record.isRoot())
                return;

            rv.push({
                name: record.data.propertyName,
                schema: record.getJsonSchama()
            });

            c(record.parentNode);
        })(this);

        return rv.reverse();
    },

    getMemberPath: function () {
        var rv = [];

        (function c(record) {
            if (record.isRoot())
                return;

            rv.push(record.data.propertyName);

            c(record.parentNode);
        })(this);

        return rv.reverse();
    },

    indexOfProperty: function (propertyName) {
        var me = this;

        for (var i = 0; i < me.childNodes.length; i++) {
            if (me.childNodes[i].data.propertyName == propertyName)
                return i;
        }

        return -1;
    },

    getChildByName: function (propertyName) {
        var me = this,
            index = me.indexOfProperty(propertyName);

        return index == -1 ? null : me.childNodes[index];
    },

    getChildByPath: function (path) {
        var me = this,
            path = Ext.isString(path) ? path.split('.') : path,
            rv = this;

        Ext.each(path, function (propertyName) {
            rv = rv && rv.getChildByName(propertyName);
        });

        return rv;
    },

    save: function () {
        var me = this,
            type = me.$(me.data.type),
            rv;

        switch (type) {
            case 'string':
                rv = {
                    type: 'string',
                    format: me.data.format
                };
                break;
            case 'number':
                rv =  {
                    type: 'number'
                };
                break;
            case 'integer':
                rv =  {
                    type: 'integer'
                };
                break;
            case 'boolean':
                rv =  {
                    type: 'boolean'
                };
                break;
            case 'object':
                rv = {
                    type: 'object',
                    properties: {
                    }
                };

                Ext.each(me.childNodes, function (crec) {
                    rv.properties[crec.data.propertyName] = crec.save();
                });
                break;
            case 'array':
                if (me.isArray()) {
                    var items = Ext.Array.from(me.data.tag.items),
                        itemType = me.$(items[0].type);

                    if (itemType == 'object') {
                        rv = {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {}
                            }
                        };

                        Ext.each(me.childNodes, function (crec) {
                            rv.items.properties[crec.data.propertyName] = crec.save();
                        });
                    }
                    else {
                        rv = {
                            type: 'array',
                            items: items[0]
                        };
                    }
                }
                else {
                    rv = me.data.tag;
                }
                break;
            default:
                rv =  {
                    type: type || 'string'
                };
                break;
        }

        if (me.data.yzext)
            rv.yzext = Ext.clone(me.data.yzext);

        return rv;
    }
});