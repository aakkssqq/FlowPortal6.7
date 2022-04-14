/*
config
editPlugin
tablePanelConfig
events:
tablesChanged
*/

Ext.define('YZSoft.bpm.src.grid.DataSetMapGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.bpm.src.model.DataColumnSchema'
    ],
    cls: ['yz-datasetschema-grid', 'yz-datasetschema-grid-xsd'],
    trackMouseOver: false,
    disableSelection: true,
    border: false,

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', Ext.apply({
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.DataColumnSchema'
        }, config.store));
        delete config.store;

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', Ext.apply({
            clicksToEdit: 1
        }, config.editPlugin));

        cfg = {
            store: me.store,
            plugins: [me.cellEditing],
            viewConfig: {
                stripeRows: false,
                markDirty: false,
                getRowClass: function (record) {
                    return 'yz-datasetschemarow-' + (record.data.isTable ? 'table' : 'column');
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
                    { text: RS.$('All_DataField'), dataIndex: 'ColumnName', width: 180, tdCls: 'yz-datasetschema-cell-name', renderer: me.renderName },
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, tdCls: 'yz-datasetschema-cell-datatype', renderer: me.renderDataType },
                    { xtype: 'checkcolumn', text: RS.$('All_IsExport'), dataIndex: 'AllowExport', width: 80, listeners: { scope: me, checkchange: 'onCheckChange'} },
                    { text: RS.$('All_Rename'), dataIndex: 'MapTo', flex: 1, tdCls: 'yz-datasetschema-cell-rename', renderer: YZSoft.Render.renderString, editor: {} }
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderName: function (value, metaData, rec) {
        return rec.data.isTable ? rec.data.TableName : rec.data.ColumnName;
    },

    renderDataType: function (value, metaData, rec) {
        return rec.data.isTable ? 'Table' : Ext.util.Format.dataType(value);
    },

    addTable: function (option) {
        var me = this,
            tables = option.tables ? (Ext.isArray(option.tables) ? option.tables : [option.tables]) : [],
            addTables = [];

        Ext.each(tables, function (table) {
            if (!me.isTableExist(table)) {
                addTables.push(table);
            }
        });

        if (addTables.length != 0) {
            YZSoft.Ajax.request({
                method: 'POST',
                url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
                params: {
                    method: 'GetTableSchemas',
                    serverName: option.serverName
                },
                jsonData: addTables,
                success: function (action) {
                    option.datasetSechema = action.result;
                    me.addDataSetInternal(option);
                }
            });
        }
    },

    addTableWithSchema: function (option) {
        var me = this,
            tables = option.tables ? (Ext.isArray(option.tables) ? option.tables : [option.tables]) : [],
            addTables = [];

        Ext.each(tables, function (table) {
            if (!me.isTableExist(table)) {
                addTables.push(table);
            }
        });

        option.datasetSechema = { Tables: tables };
        me.addDataSetInternal(option);
    },

    addDataSetInternal: function (option) {
        var me = this,
            treedata = me.dataschema = option.datasetSechema,
            storedata = me.datasetSchema2Store(treedata);

        if (option.callback)
            option.callback.call(option.scope, option.datasetSechema)

        if (option.fn) {
            var tmpstore = [];
            Ext.each(storedata, function (rec) {
                if (option.fn.call(option.scope, rec) !== false)
                    tmpstore.push(rec);
            });
            storedata = tmpstore;
        }

        if (option.clear)
            me.store.removeAll();

        me.store.add(storedata);
        me.fireEvent('tablesChanged', me.getTableIdentitys(), me);
    },

    onCheckChange: function (column, rowIndex, checked, eOpts) {
        var me = this,
            store = me.store,
            rec = store.getAt(rowIndex);

        if (rec.data.isColumn && checked) {
            for (var i = rowIndex - 1; i >= 0; i--) {
                var rec1 = store.getAt(i);
                if (rec1.data.isTable) {
                    rec1.set('AllowExport', true);
                    return;
                }
            }
        }

        if (rec.data.isTable) {
            for (var i = rowIndex + 1; i < store.getCount(); i++) {
                var rec1 = store.getAt(i);
                if (rec1.data.isTable)
                    return;
                else
                    rec1.set('AllowExport', checked);
            }
        }
    },

    isTableExist: function (table) {
        var me = this,
            existTables = me.getTableIdentitys();

        var rec = Ext.Array.findBy(existTables, function (item) {
            if (String.Equ(item.TableName, table.TableName))
                return true;
        });

        return rec ? true : false;
    },

    findColumn: function (dataset, search) {
        var rv = null;

        if (!dataset)
            return null;

        Ext.each(dataset.Tables, function (table) {
            if (String.Equ(table.TableName, search.TableName)) {
                return Ext.each(table.Columns, function (column) {
                    if (String.Equ(column.ColumnName, search.ColumnName)) {
                        rv = column;
                        return false;
                    }
                });
            }
        });

        return rv;
    },

    findTable: function (dataset, search) {
        var rv = null;

        if (!dataset)
            return null;

        Ext.each(dataset.Tables, function (table) {
            if (String.Equ(table.TableName, search.TableName)) {
                rv = table;
                return false;
            }
        });

        return rv;
    },

    datasetSchema2Store: function (data) {
        var rv = [];
        Ext.each(data.Tables, function (table) {
            rv.push({
                isTable: true,
                DataSourceName: table.DataSourceName,
                TableName: table.TableName,
                IsRepeatableTable: table.IsRepeatableTable
            });

            Ext.each(table.Columns, function (column) {
                rv.push(Ext.apply({
                    isColumn: true,
                    TableName: table.TableName
                }, column));
            });
        });

        return rv;
    },

    clear: function () {
        this.store.removeAll();
    },

    removeSelectedTable: function () {
        var me = this,
            recs = me.getTableSelection().concat(me.getColumnSelection());

        me.store.remove(recs);
        me.fireEvent('tablesChanged', me.getTableIdentitys(), me);
    },

    getTableIdentitys: function () {
        var me = this,
            rv = [];

        me.getStore().each(function (rec) {
            if (rec.data.isTable) {
                rv.push({
                    DataSourceName: rec.data.DataSourceName,
                    TableName: rec.data.TableName,
                    IsRepeatableTable: rec.data.IsRepeatableTable
                });
            }
        });

        return rv;
    },

    save: function (tableFields, columnFields, tableIsDefaultFn, columnIsDefaultFn, removeEmptyTable) {
        var me = this,
            tables = [],
            table,
            column,
            selected = false;

        me.store.each(function (rec) {
            if (rec.data.isTable) {
                table = Ext.copyTo({}, rec.data, tableFields);
                table.Columns = [];
                table.rec = rec;
                tables.push(table);
            }
            else {
                column = Ext.copyTo({}, rec.data, columnFields);
                if (!columnIsDefaultFn || !columnIsDefaultFn.call(rec, rec.data))
                    table.Columns.push(column)
            }
        });

        var rv = [];
        Ext.each(tables, function (table) {
            if (!removeEmptyTable || table.Columns.length != 0 || !tableIsDefaultFn || !tableIsDefaultFn.call(table.rec, table.rec.data))
                rv.push(table);

            delete table.rec;
        });

        return rv;
    }
});