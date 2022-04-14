/*
config:
tables
data
{
ServerName
CallProcess
CallDataMap
}
*/
Ext.define('YZSoft.bpm.propertypages.DBAdapterMap', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('Process_Title_DBAdapter'),
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
                editable: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('Process_DBAdapter_Map_ColumnName'), dataIndex: 'ColumnName', width: 118 },
                    { text: RS.$('All_DataType'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('All_FillWith'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig },
                    { text: RS.$('All_FilterWith'), dataIndex: 'FilterValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
                ]
            }
        });

        cfg = {
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                margin: '0 0 3 0',
                defaults: {
                },
                items: [{
                    xtype: 'label',
                    text: RS.$('Process_DBAdapter_MapTitle'),
                    padding: '4 0 0 1'
                }, {
                    xtype: 'tbfill'
                }, {
                    xtype: 'button',
                    padding: '3 20',
                    margin: '0 0 0 3',
                    text: RS.$('Process_DBAdapter_AddUpdateTable'),
                    reference: 'btnAdd',
                    disabled: false,
                    handler: function () {
                        Ext.create('YZSoft.bpm.src.dialogs.SelTableDlg', {
                            autoShow: true,
                            fn: function (value) {
                                me.grid.addTable({
                                    tables: value
                                });
                            }
                        });
                    }
                }, {
                    xtype: 'button',
                    padding: '3 20',
                    margin: '0 0 0 3',
                    text: RS.$('Process_RemoveSelectedTables'),
                    disabled: true,
                    reference: 'btnRemove',
                    handler: function () {
                        me.grid.removeSelectedTable();
                        me.updateStatus();
                    }
                }]
            }, me.grid, {
                xtype: 'fieldset',
                title: RS.$('Process_DBAdapter_DataUpdateType'),
                margin: '8 0 0 0',
                items: [{
                    xtype: 'container',
                    padding: '6 6 10 6',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'radio',
                        name: 'UpdateType',
                        margin: '0 100 0 0',
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    },
                    items: [
                        { boxLabel: RS.$('Process_DBAdapter_DataUpdateType_Update'), inputValue: 'Update' },
                        { boxLabel: RS.$('All_Insert'), inputValue: 'Insert' },
                        { boxLabel: RS.$('All_Delete'), inputValue: 'Delete' }
                    ]
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

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences(),
            tables = [];

        me.getForm().setValues(Ext.copyTo({}, data, 'UpdateType'));

        Ext.each(data.ExportDataSet.Tables, function (table) {
            tables.push(Ext.copyTo({}, table, 'DataSourceName,TableName'));
        });

        me.grid.addTable({
            tables: tables,
            fn: function (item) {
                if (item.isTable) {
                }
                else {
                    var column = me.grid.findColumn(data.ExportDataSet, item);
                    if (column)
                        Ext.copyTo(item, column, 'DefaultValue,FilterValue');
                    else {
                        Ext.apply(item, {
                            DefaultValue: null,
                            FilterValue: null
                        });
                    }
                }
            },
            clear:true
        });
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv,
            tables;

        rv = me.getValuesSubmit();

        switch (rv.UpdateType) {
            case 'Insert':
                tables = me.grid.save([
                    'DataSourceName',
                    'TableName'
                    ], [
                    'ColumnName',
                    'DefaultValue'
                ], function (table) {
                    return true;
                }, function (column) {
                    return (column.DefaultValue === null);
                }, false);
                break;
            case 'Update':
                tables = me.grid.save([
                    'DataSourceName',
                    'TableName'
                    ], [
                    'ColumnName',
                    'DefaultValue',
                    'FilterValue'
                ], function (table) {
                    return true;
                }, function (column) {
                    return (column.DefaultValue === null && column.FilterValue === null);
                }, false);
                break;
            case 'Delete':
                tables = me.grid.save([
                    'DataSourceName',
                    'TableName'
                    ], [
                    'ColumnName',
                    'FilterValue'
                ], function (table) {
                    return true;
                }, function (column) {
                    return (column.FilterValue === null);
                }, false);
                break;
        }

        rv.ExportDataSet = {
            Tables: tables
        };

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            tableSelection = me.grid.getTableSelection(),
            data = me.getValuesSubmit();

        refs.btnRemove.setDisabled(tableSelection.length == 0);
        me.grid.columns[3].setVisible(data.UpdateType != 'Delete');
        me.grid.columns[4].setVisible(data.UpdateType != 'Insert');
    }
});