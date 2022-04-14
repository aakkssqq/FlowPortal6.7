/*
config
tables:
[{
"DataSourceName": "Default",
"TableName": "A",
"IsRepeatableTable": true,
},{
"DataSourceName": "Default",
"TableName": "B",
"IsRepeatableTable": true,
}]
tableIdentity:
{
"DataSourceName": "Default",
"TableName": "A",
"IsRepeatableTable": true,
}
value:
{
"Params": [
{
"ParamName": "TaskID",
"Value": 11
},
{
"ParamName": "A1",
"Value": "22"
}
]
}
*/
Ext.define('YZSoft.bpm.src.dialogs.TableFilterDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('Process_TableFilter'),
    layout: 'fit',
    width: 538,
    height: 565,
    minWidth: 538,
    minHeight: 565,
    modal: true,
    maximizable: true,
    bodyPadding: '5 20',
    button: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.editorConfig = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            tables: config.tables,
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.setValueType(context.record.data.DataType);
                },
                selected: function (value) {
                    me.grid.cellEditing.cancelEdit();
                    this.context.record.data.DefaultValue = value;
                    me.grid.cellEditing.startEdit(this.context.record, this.context.column);

                }
            }
        };

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            border: true,
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: RS.$('All_DataField'), dataIndex: 'ColumnName', width: 118, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('All_FilterWith'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
                ]
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnCancel, me.btnOK],
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);
    },

    fill: function (value) {
        var me = this,
            params = [];

        me.grid.addTable({
            tables: [me.tableIdentity],
            fn: function (item) {
                if (item.isTable) {
                    return false;
                }
                else {
                    var filter = Ext.Array.findBy(value.Params, function (filter) {
                        if (String.Equ(filter.ParamName, item.ColumnName))
                            return true;
                    });

                    if (filter) {
                        Ext.apply(item, {
                            DefaultValue: filter.Value
                        });
                    }
                    else {
                        Ext.apply(item, {
                            DefaultValue: null
                        });
                    }
                }
            },
            clear:true
        });
    },

    save: function () {
        var me = this,
            filters = [];

        me.grid.getStore().each(function (rec) {
            var columnName = rec.data.ColumnName,
                defaultValue = rec.data.DefaultValue;

            if (defaultValue !== null) {
                filters.push({
                    ParamName: columnName,
                    Value: defaultValue
                });
            }
        });

        return {
            Params: filters
        };
    }
});