/*
config:
value
data format:
{
 "TableIdentitys": [
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
  "DataRelationship": {
    "FKs": [
      {
        "PKTableName": "A",
        "PKColumnName": "TaskID",
        "FKTableName": "AAA",
        "FKColumnName": "TaskID"
      }
    ]
  }
}
*/
Ext.define('YZSoft.bpm.src.dialogs.TableAndRelationshipDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('All_TableAndRelationship'),
    layout: 'fit',
    width: 550,
    height: 600,
    minWidth: 550,
    minHeight: 600,
    modal: true,
    maximizable:true,
    bodyPadding: '5 20',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            region: 'center',
            border: true,
            tablePanelConfig: {
                allowAddRecordConfig: {
                    hidden: true
                },
                advBtnConfig: {
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
                    { dataIndex: '', width: 32, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('All_DataTable'), dataIndex: 'ColumnName', width: 138 },
                    { text: RS.$('All_DataType'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('All_FKToPK'), dataIndex: 'Relation', flex: 1, editor: {
                        xclass: 'YZSoft.bpm.src.form.field.FormFieldField',
                        listeners: {
                            beforeedit: function (context) {
                                this.context = context;
                                this.tables = me.grid.getTableIdentitys();
                            },
                            selected: function (value) {
                                me.grid.cellEditing.cancelEdit();
                                this.context.record.set(this.context.column.dataIndex, value);
                                me.grid.cellEditing.startEdit(this.context.record, this.context.column);
                            }
                        }
                    }
                    }
                ]
            }
        });

        me.btnAddTable = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddDataTable'),
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
        });

        me.btnRemoveTable = Ext.create('Ext.button.Button', {
            text: RS.$('Process_RemoveSelectedTables'),
            disabled: true,
            handler: function () {
                me.grid.removeSelectedTable();
                me.updateStatus();
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
            buttons: [me.btnAddTable, me.btnRemoveTable, '->', me.btnCancel, me.btnOK],
            items: [me.grid]
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
        var me = this;

        me.grid.addTable({
            tables: data.TableIdentitys,
            fn: function (item) {
                if (!item.isTable) {
                    Ext.each(data.DataRelationship.FKs, function (fk) {
                        if (!item.isTable &&
                        String.Equ(item.TableName, fk.FKTableName) &&
                        String.Equ(item.ColumnName, fk.FKColumnName)) {
                            item.Relation = fk.PKTableName + '.' + fk.PKColumnName;
                        }
                    });
                }
            },
            clear: true
        });
    },

    save: function () {
        var me = this,
            fks = [];

        me.grid.getStore().each(function (rec) {
            if (!rec.data.isTable) {
                var relation = Ext.String.trim(rec.data.Relation || ''),
                    strs = relation.split('.'),
                    tableName = Ext.String.trim(strs[0] || ''),
                    columnName = Ext.String.trim(strs[1] || '');

                if (strs.length == 2 && tableName && columnName) {
                    fks.push({
                        PKTableName: tableName,
                        PKColumnName: columnName,
                        FKTableName: rec.data.TableName,
                        FKColumnName: rec.data.ColumnName
                    });
                }
            }
        });

        return {
            TableIdentitys: me.grid.getTableIdentitys(),
            DataRelationship: {
                FKs: fks
            }
        };
    },

    updateStatus: function () {
        var me = this,
            tableSelection = me.grid.getTableSelection();

        me.btnRemoveTable.setDisabled(tableSelection.length == 0);
    }
});