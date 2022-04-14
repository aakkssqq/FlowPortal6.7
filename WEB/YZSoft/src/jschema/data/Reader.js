
Ext.define('YZSoft.src.jschema.data.Reader', {
    extend: 'Ext.data.reader.Json',

    buildExtractors: function (force) {
        var me = this;

        me.callParent(arguments);
        me.getRoot = me.getRootFn;
    },

    $: function (type) {
        if (Ext.isArray(type))
            return type[0];
        else
            return type;
    },

    getModelData: function (raw) {
        var me = this;

        raw.type = me.$(raw.type);
        return this.getPreserveRawData() ? Ext.apply({}, raw) : raw;
    },

    getRootFn: function (raw) {
        var me = this,
            type = me.$(raw.type),
            rv = [];

        if (raw == null)
            return null;

        me.resolveReference(raw);

        if (type === 'object') {
            Ext.Object.each(raw.properties, function (propertyName, value) {
                rv.push(Ext.apply({}, {
                    propertyName: propertyName,
                }, value));
            });
        }
        else if (type === 'array') {
            var items = Ext.Array.from(raw.items);

            if (items.length == 1 && me.$(items[0].type) == 'object') {
                Ext.Object.each(items[0].properties, function (propertyName, value) {
                    rv.push(Ext.apply({}, {
                        propertyName: propertyName,
                    }, value));
                });
            }
        }

        return rv;
    },

    resolveReference: function (raw) {
        if (!raw || !raw.yzext || !raw.yzext.reference)
            return;

        var me = this,
            ref = raw.yzext.reference,
            fnName = Ext.String.format('resolve{0}Reference', Ext.String.capitalize(ref.type)),
            fn = me[fnName];

        fn && fn.call(me, raw, ref);
        return raw;
    },

    resolveDetailTableReference: function (raw, ref) {
        var me = this,
            datasourceName = ref.datasourceName,
            tableName = ref.tableName,
            properties;

        YZSoft.Ajax.request({
            method: 'POST',
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
            params: {
                method: 'GetTableSchemas'
            },
            jsonData: [{
                datasourceName: datasourceName,
                tableName: tableName
            }],
            success: function (action) {
                raw.items = {
                    type: 'object',
                    properties:{}
                };

                properties = raw.items.properties;

                Ext.each(action.result.Tables[0].Columns, function (column) {
                    properties[column.ColumnName] = me.csharpType2JsonSchema(column.DataType)
                });
            }
        });
    },

    resolveMasterTableReference: function (raw, ref) {
        var me = this,
            datasourceName = ref.datasourceName,
            tableName = ref.tableName,
            properties;

        YZSoft.Ajax.request({
            method: 'POST',
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
            params: {
                method: 'GetTableSchemas'
            },
            jsonData: [{
                datasourceName: datasourceName,
                tableName: tableName
            }],
            success: function (action) {
                raw.properties = {
                };

                properties = raw.properties;

                Ext.each(action.result.Tables[0].Columns, function (column) {
                    properties[column.ColumnName] = me.csharpType2JsonSchema(column.DataType)
                });
            }
        });
    },

    csharpType2JsonSchema: function (dataType) {
        var me = this,
            dataType = Ext.isObject(dataType) ? dataType.name : dataType;

        switch (dataType) {
            case 'Decimal':
            case 'Double':
            case 'Single':
                return {
                    type: 'number'
                };
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                return {
                    type: 'integer'
                };
            case 'Boolean':
                return {
                    type: 'boolean'
                };
            case 'DateTime':
                return {
                    type: 'string',
                    format: 'date-time'
                };
            case 'String':
                return {
                    type: 'string'
                };
            case 'Binary':
                return {
                    type: 'string'
                };
            default:
                return {
                    type: 'string'
                };
        }
    }
});
