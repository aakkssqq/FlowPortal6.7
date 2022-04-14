
Ext.define('YZSoft.src.datasource.field.ColumnComboBox', {
    extend: 'Ext.form.field.ComboBox',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'value',
    editable: false,
    forceSelection: true,
    config: {
        ds: null,
        emptyDSText: null
    },
    loadConfig: null,

    initComponent: function () {
        var me = this,
            value = me.value,
            data = [];

        me.emptyTextSaved = me.emptyText;
        if (me.emptyDSText)
            me.emptyText = me.emptyDSText

        if (value){
            data.push({
                value: value,
                name: value
            });
        }
        me.store = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: data
        });

        me.callParent();
    },

    updateDs: function (newValue) {
        var me = this,
            ods = Ext.create('YZSoft.src.datasource.DataSource', newValue),
            data = [],
            dsNames;

        if (me.emptyDSText) {
            if (Ext.isEmpty(newValue))
                me.setEmptyText(me.emptyDSText);
            else
                me.setEmptyText(me.emptyTextSaved);
        }

        if (!ods)
            return;

        ods.getSchema(me.loadConfig, function (schemaColumns) {
            Ext.each(schemaColumns, function (column) {
                data.push({
                    value: column.ColumnName,
                    name: column.ColumnName
                });
            });

            me.store.setData(data);
        });
    }
});