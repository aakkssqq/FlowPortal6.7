/*
*/
Ext.define('YZSoft.bpm.src.dialogs.CreateRecordDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('Process_TableFilter'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    maximizable: true,
    bodyPadding: '10 20 5 20',
    buttonAlign:'right',
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

        me.edtCreateCond = Ext.create('Ext.form.field.ComboBox', {
            store: {
                fields: ['value', 'text'],
                data: [
                    { value: 'FirstTimeEnterStep', text: RS.$('All_Enum_CreateRecordType_FirstTimeEnterStep') },
                    { value: 'EveryEnterStep', text: RS.$('All_Enum_CreateRecordType_EveryEnterStep') },
                    { value: 'RecordNotExist', text: RS.$('All_Enum_CreateRecordType_RecordNotExist') }
                ]
            },
            fieldLabel: RS.$('All_CreateRecord_WhenToCreate'),
            displayField: 'text',
            valueField: 'value',
            editable: false
        });

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            border: true,
            flex: 1,
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: RS.$('All_DataField'), dataIndex: 'ColumnName', width: 118, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('All_FillWith'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
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
            items: [me.edtCreateCond, {
                xtype: 'label',
                text: RS.$('All_CreateRecord_Caption'),
                style: 'display:block',
                margin: '12 0 6 0'
            }, me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);
    },

    fill: function (value) {
        var me = this,
            params = [];

        me.edtCreateCond.setValue(value.CreateRecordType);

        me.grid.addTable({
            tables: [me.tableIdentity],
            fn: function (item) {
                if (item.isTable) {
                    return false;
                }
                else {
                    var column = Ext.Array.findBy(value.Columns, function (column) {
                        if (String.Equ(column.ColumnName, item.ColumnName))
                            return true;
                    });

                    if (column) {
                        Ext.apply(item, {
                            DefaultValue: column.DefaultValue
                        });
                    }
                    else {
                        Ext.apply(item, {
                            DefaultValue: null
                        });
                    }
                }
            },
            clear: true
        });
    },

    save: function () {
        var me = this,
            columns = [];

        me.grid.getStore().each(function (rec) {
            var columnName = rec.data.ColumnName,
                defaultValue = rec.data.DefaultValue;

            if (defaultValue !== null) {
                columns.push({
                    ColumnName: columnName,
                    DefaultValue: defaultValue
                });
            }
        });

        return {
            CreateRecordType: me.edtCreateCond.getValue(),
            DataSourceName: me.tableIdentity.DataSourceName,
            TableName: me.tableIdentity.TableName,
            Columns: columns
        }
    }
});