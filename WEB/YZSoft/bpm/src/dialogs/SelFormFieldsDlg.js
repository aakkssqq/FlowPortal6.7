/*
config
tables
datatype 过滤
*/

Ext.define('YZSoft.bpm.src.dialogs.SelFormFieldsDlg', {
    extend: 'Ext.window.Window', //111111
    title: RS.$('All_SelFormFields'),
    layout: 'fit',
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            value = config.value,
            cfg;

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            cls: 'yz-border',
            trackMouseOver: true,
            hideHeaders: true,
            tablePanelConfig: {
                checkboxCOnfig: {
                    hidden: true
                },
                isRepeatableTableConfig: {
                    hidden: true
                },
                allowAddRecordConfig: {
                    hidden: true
                },
                createRecordConfig: {
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
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    { text: RS.$('Process_ProcessData'), dataIndex: 'ColumnName', flex: 1 },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', flex: 1, formatter: 'dataType' },
                    { xtype: 'checkcolumn', text: '', dataIndex: 'exportFile', width: 60 }
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
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.grid],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.fill(config.tables,value);
    },

    fill: function (tables, columns) {
        var me = this,
            refs = me.getReferences();

        me.grid.addTable({
            tables: tables,
            fn: function (item) {
                if (item.isColumn) {
                    if (me.datatype && item.DataType.name != me.datatype)
                        return false;

                    item.exportFile = me.findColumn(columns, item) ? true : false;
                }
            },
            clear: true
        });
    },

    findColumn: function (columns, item) {
        return Ext.Array.findBy(columns, function (column) {
            if (String.Equ(item.TableName, column.tableName) &&
                String.Equ(item.ColumnName, column.columnName))
                return true;
        });
    },

    save: function () {
        var me = this,
            columns = [];

        me.grid.getStore().each(function (rec) {
            var tableName = rec.data.TableName,
                columnName = rec.data.ColumnName,
                exportFile = rec.data.exportFile;

            if (rec.data.isColumn && exportFile){
                columns.push({
                    tableName: tableName,
                    columnName: columnName
                });
            }
        });

        return columns;
    }
});
