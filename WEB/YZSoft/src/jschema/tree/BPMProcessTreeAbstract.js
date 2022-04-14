
Ext.define('YZSoft.src.jschema.tree.BPMProcessTreeAbstract', {
    extend: 'YZSoft.src.jschema.tree.Abstract',
    schameTemplate: {
        Payload: {
            type: 'object',
            properties: {
            }
        }
    },
    config: {
        tables: null
    },

    updateTables: function (value) {
        var me = this,
            schema = Ext.copy(me.schameTemplate);

        schema.Payload.properties = me.getTablesJSchame(value);
        me.setSchema(schema);
    },

    getTablesJSchame: function (tables) {
        var me = this,
            schema = {};

        Ext.each(tables, function (table) {
            if (table.IsRepeatableTable)
                schema[table.TableName] = me.getDetailTableReferenceJSchame(table.DataSourceName, table.TableName);
            else
                schema[table.TableName] = me.getMasterTableReferenceJSchame(table.DataSourceName, table.TableName);
        });

        return schema;
    },

    getJSchema: function (tables) {
        var me = this,
            schema = Ext.copy(me.schameTemplate);

        schema.Payload.properties = me.getTablesJSchame(value);
        return schema;
    }
});