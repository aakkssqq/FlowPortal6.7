/*
config:
data
{
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
"ControlDataSet": {
}
*/
Ext.define('YZSoft.bpm.propertypages.DataControl', {
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
                    this.setTables(me.grid.getTableIdentitys());
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
            border: true,
            flex: 1,
            tablePanelConfig: {
                isRepeatableTableConfig: {
                    disabled: false
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
                    { xtype: 'checkcolumn', text: RS.$('All_Column_Read'), tooltip: RS.$('All_ColumnTip_Read'), dataIndex: 'AllowRead', width: 40, listeners: { scope: me, checkchange: 'onCheckChange'} },
                    { xtype: 'checkcolumn', text: RS.$('All_Column_Write'), tooltip: RS.$('All_ColumnTip_Write'), dataIndex: 'AllowWrite', width: 40, listeners: { scope: me, checkchange: 'onCheckChange'} },
                    { xtype: 'checkcolumn', text: RS.$('All_Column_Spoor'), tooltip: RS.$('All_ColumnTip_Spoor'), dataIndex: 'ShowSpoor', width: 50, listeners: { scope: me, checkchange: 'onCheckChange'} }
                ]
            }
        });

        cfg = {
            items: [{
                xtype: 'label',
                text: RS.$('Process_DataInit_Title'),
                style: 'display:block',
                margin: '0 0 6 0'
            }, me.grid, {
                xtype: 'panel',
                layout: 'hbox',
                bodyStyle: 'background-color:transparent',
                margin: '6 0 0 0',
                border: false,
                defaults: {
                    xtype: 'segmentedbutton',
                    allowToggle: false,
                    defaults: {
                        xtype: 'button',
                        padding: '5 10',
                        minWidth: 80,
                        disabled: true
                    }
                },
                items: [{
                    items: [{
                        text: RS.$('All_AddTable'),
                        reference: 'btnAdd',
                        disabled: false,
                        handler: function () {
                            Ext.create('YZSoft.bpm.src.dialogs.SelTableDlg', {
                                autoShow: true,
                                fn: function (value) {
                                    me.grid.addTable({
                                        tables: value,
                                        fn: function (item) {
                                            if (item.isColumn) {
                                                Ext.apply(item, {
                                                    DefaultValue: null,
                                                    SaveValue: null,
                                                    AllowRead: true,
                                                    AllowWrite: true,
                                                    ShowSpoor: false
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }, {
                        text: RS.$('All_RemoveTable'),
                        reference: 'btnRemove',
                        handler: function () {
                            me.grid.removeSelectedTable();
                            me.updateStatus();
                        }
                    }]
                }, {
                    xtype: 'tbfill'
                }, {
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
                    xtype: 'tbfill'
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
                    xtype: 'tbfill'
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
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.grid, ['tablesChanged']);

        me.grid.on({
            tablecheckchanged: function () {
                me.updateStatus();
            }
        });

        if (config.data)
            me.fill(config.data);
    },

    onCheckChange: function (column, rowIndex, checked, eOpts) {
        var me = this,
            rec = me.grid.getStore().getAt(rowIndex);

        if (column.dataIndex == 'AllowRead' && !checked) {
            rec.set('AllowWrite', false);
            rec.set('ShowSpoor', false);
        }

        if (column.dataIndex == 'AllowWrite' && checked) {
            rec.set('AllowRead', true);
        }

        if (column.dataIndex == 'ShowSpoor' && checked) {
            rec.set('AllowRead', true);
        }
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        me.grid.addTable({
            tables: data.tables,
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

                    if (item.IsRepeatableTable) {
                        var initcreatetables = me.grid.findTables(data.InitCreateRecordSet, item);
                        item.InitCreateRecordSet = initcreatetables;
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
            clear: true
        });
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = {
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
        };

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            tableSelection = me.grid.getTableSelection();

        refs.btnRemove.setDisabled(tableSelection.length == 0);
        refs.btnCheckRead.setDisabled(tableSelection.length == 0);
        refs.btnUnCheckRead.setDisabled(tableSelection.length == 0);
        refs.btnCheckWrite.setDisabled(tableSelection.length == 0);
        refs.btnUnCheckWrite.setDisabled(tableSelection.length == 0);
        refs.btnCheckSpoor.setDisabled(tableSelection.length == 0);
        refs.btnUnCheckSpoor.setDisabled(tableSelection.length == 0);
    }
});