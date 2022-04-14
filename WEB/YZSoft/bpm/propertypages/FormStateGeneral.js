/*
config:
tables:
[
    {
        "DataSourceName": "Default",
        "TableName": "A",
        "IsRepeatableTable": false
    },
    {
        "DataSourceName": "BPMSAN",
        "TableName": "AAA",
        "IsRepeatableTable": true
    }
],
value
{
"Name": "状态1",
"ShowSaveButton": true,
"ValidationGroup": "1111",
"ControlDataSet": {
"Tables": [
    {
    "DataSourceName": "Default",
    "TableName": "A",
    "AllowAddRecord": false,
    "Columns": [
        {
        "ColumnName": "TaskID",
        "DefaultValue": 11,
        "SaveValue": 22,
        "AllowRead": true,
        "AllowWrite": false,
        "ShowSpoor": false
        },
        {
        "ColumnName": "A1",
        "DefaultValue": {
            "CodeText": "FormDataSet[\"A.TaskID\"]"
        },
        "SaveValue": null,
        "AllowRead": false,
        "AllowWrite": false,
        "ShowSpoor": false
        },
        {
        "ColumnName": "S1",
        "DefaultValue": "222",
        "SaveValue": null,
        "AllowRead": true,
        "AllowWrite": true,
        "ShowSpoor": false
        }
    ],
    "Filter": {
        "Params": [
        {
            "ParamName": "TaskID",
            "Value": 11
        },
        {
            "ParamName": "A1",
            "Value": "22"
        },
        {
            "ParamName": "S1",
            "Value": {
            "CodeText": "DateTime.Today"
            }
        }
        ]
    }
    }
]
}

*/
Ext.define('YZSoft.bpm.propertypages.FormStateGeneral', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    title: RS.$('All_DataControl'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.editorConfig = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.setTables(me.tables);
                    this.setValueType(context.record.data.DataType);
                },
                selected: function (value) {
                    me.grid.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.grid.cellEditing.startEdit(this.context.record, this.context.column);

                }
            }
        };

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            region: 'center',
            border: true,
            flex: 1,
            tablePanelConfig: {
                isRepeatableTableConfig: {
                    disabled: true
                },
                createRecordConfig: {
                    hidden: true
                }
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('All_DataField'), dataIndex: 'ColumnName', width: 128 },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 100, formatter: 'dataType' },
                    { text: RS.$('All_InitValue'), dataIndex: 'DefaultValue', flex: 3, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig },
                    { text: RS.$('Process_PostFillWith'), dataIndex: 'SaveValue', flex: 2, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig },
                    { xtype: 'checkcolumn', text: RS.$('All_Column_Read'), tooltip: RS.$('All_ColumnTip_Read'), dataIndex: 'AllowRead', width: 40 },
                    { xtype: 'checkcolumn', text: RS.$('All_Column_Write'), tooltip: RS.$('All_ColumnTip_Write'), dataIndex: 'AllowWrite', width: 40 },
                    { xtype: 'checkcolumn', text: RS.$('All_Column_Spoor'), tooltip: RS.$('All_ColumnTip_Spoor'), dataIndex: 'ShowSpoor', width: 50 }
                ]
            }
        });

        cfg = {
            items: [{
                xtype: 'container',
                margin:'0 0 3 0',
                layout: {
                    type: 'hbox',
                    align:'middle'
                },
                items: [{
                    xtype: 'label',
                    text: RS.$('FormService_FormState_DataControl_Title'),
                }, {
                    xtype: 'tbfill'
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'segmentedbutton',
                        margin: '0 0 0 30',
                        allowToggle: false,
                        defaults: {
                            xtype: 'button',
                            padding: '2 10',
                            minWidth: 80,
                            disabled: true
                        }
                    },
                    items: [{
                        items: [{
                            text: RS.$('Process_AllRead'),
                            reference: 'btnCheckRead',
                            handler: function () {
                                me.grid.batchSetProperty('AllowRead', true);
                            }
                        }, {
                            text: RS.$('Process_AllDenyRead'),
                            reference: 'btnUnCheckRead',
                            handler: function () {
                                me.grid.batchSetProperty('AllowRead', false);
                            }
                        }]
                    }, {
                        items: [{
                            text: RS.$('Process_AllWrite'),
                            reference: 'btnCheckWrite',
                            handler: function () {
                                me.grid.batchSetProperty('AllowWrite', true);
                            }
                        }, {
                            text: RS.$('Process_AllDenyWrite'),
                            reference: 'btnUnCheckWrite',
                            handler: function () {
                                me.grid.batchSetProperty('AllowWrite', false);
                            }
                        }]
                    }, {
                        items: [{
                            text: RS.$('Process_AllSpoor'),
                            reference: 'btnCheckSpoor',
                            handler: function () {
                                me.grid.batchSetProperty('ShowSpoor', true);
                            }
                        }, {
                            text: RS.$('Process_AllDenySpoor'),
                            reference: 'btnUnCheckSpoor',
                            handler: function () {
                                me.grid.batchSetProperty('ShowSpoor', false);
                            }
                        }]
                    }]
                }]
            }, me.grid, {
                xtype: 'fieldset',
                title: RS.$('FormService_FormState_SaveAndValidation'),
                layout: 'hbox',
                padding: '0 16 15 26',
                margin: 0,
                items: [{
                    xtype: 'checkbox',
                    boxLabel: RS.$('FormService_FormState_Option_Save'),
                    reference: 'chkShowSaveButton'
                }, {
                    xtype: 'tbfill'
                }, {
                    xtype: 'textfield',
                    fieldLabel: RS.$('All_ValidationGroup'),
                    labelAlign: 'right',
                    reference: 'edtValidationGroup',
                    labelWidth: 100,
                    width: 280
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.grid.on({
            tablecheckchanged: function () {
                me.updateStatus();
            }
        });

        if (config.value)
            me.fill(config.value);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        me.grid.addTable({
            tables: me.tables,
            fn: function (item) {
                if (item.isTable) {
                    var table = me.grid.findTable(data.ControlDataSet, item);
                    if (table)
                        Ext.copyTo(item, table, 'AllowAddRecord,Filter');
                    else {
                        Ext.apply(item, {
                            AllowAddRecord: item.IsRepeatableTable,
                            Filter: { Params: [] }
                        })
                    }
                }
                else {
                    var column = me.grid.findColumn(data.ControlDataSet, item);
                    if (column)
                        Ext.copyTo(item, column, 'DefaultValue,SaveValue,AllowRead,AllowWrite,ShowSpoor');
                    else {
                        Ext.apply(item, {
                            DefaultValue: null,
                            SaveValue: null,
                            AllowRead: true,
                            AllowWrite: true,
                            ShowSpoor: false
                        });
                    }
                }
            },
            clear:true
        });

        refs.chkShowSaveButton.setValue(data.ShowSaveButton);
        refs.edtValidationGroup.setValue(data.ValidationGroup);
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var value = {
            ShowSaveButton: refs.chkShowSaveButton.getValue(),
            ValidationGroup: Ext.String.trim(refs.edtValidationGroup.getValue()),
            ControlDataSet: {
                Tables: me.grid.save([
                    'DataSourceName',
                    'TableName',
                    'IsRepeatableTable',
                    'AllowAddRecord',
                    'Filter'
                    ], [
                    'ColumnName',
                    'DefaultValue',
                    'SaveValue',
                    'AllowRead',
                    'AllowWrite',
                    'ShowSpoor'
                ], function (table) {
                    return (((table.IsRepeatableTable && table.AllowAddRecord) || (!table.IsRepeatableTable && !table.AllowAddRecord)) && table.Filter.Params.length == 0);
                }, function (column) {
                    return (column.DefaultValue === null && column.SaveValue === null && column.AllowRead && column.AllowWrite && !column.ShowSpoor);
                }, true)
            }
        };

        return value;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            tableSelection = me.grid.getTableSelection();

        refs.btnCheckRead.setDisabled(tableSelection.length == 0);
        refs.btnUnCheckRead.setDisabled(tableSelection.length == 0);
        refs.btnCheckWrite.setDisabled(tableSelection.length == 0);
        refs.btnUnCheckWrite.setDisabled(tableSelection.length == 0);
        refs.btnCheckSpoor.setDisabled(tableSelection.length == 0);
        refs.btnUnCheckSpoor.setDisabled(tableSelection.length == 0);
    }
});