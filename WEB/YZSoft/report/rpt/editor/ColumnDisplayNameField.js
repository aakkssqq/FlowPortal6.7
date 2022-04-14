
Ext.define('YZSoft.report.rpt.editor.ColumnDisplayNameField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.report.rpt.model.ResultColumn'],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.report.rpt.model.ResultColumn',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            viewConfig: {
                markDirty: false
            },
            flex: 1,
            height: 238,
            plugins: [me.cellEditing],
            defaults: {
                renderer: YZSoft.Render.renderString
            },
            columns: [
                { xtype: 'rownumberer' },
                { text: RS.$('All_TableColumn'), dataIndex: 'ColumnName', width: 140 },
                { text: RS.$('All_Type'), dataIndex: 'DataType', width: 140, formatter: 'dataType' },
                { text: RS.$('All_DisplayName'), dataIndex: 'DisplayName', flex: 1, editor: { allowBlank: true} }
            ]
        });

        var cfg = {
            layout: 'fit',
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setColumns: function (columns) {
        var me = this,
            datas = [];

        Ext.each(columns, function (column) {
            var rec = me.store.getById(column.ColumnName),
                data = Ext.copyTo({}, column, 'ColumnName,DataType');

            datas.push(data);
            if (rec)
                Ext.copyTo(data, rec.data, 'DisplayName');
        });

        me.store.setData(datas);
    },

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.copyTo({}, rec.data, 'ColumnName,DisplayName');
            if (v.DisplayName)
                rv.push(v);
        });
        return rv;
    }
});