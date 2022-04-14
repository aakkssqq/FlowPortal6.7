/*
config
editPlugin
tablePanelConfig
events:
tablesChanged
*/

Ext.define('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.bpm.src.model.DataColumnSchema'
    ],
    cls: 'yz-datasetschema-grid',
    trackMouseOver: false,
    disableSelection: true,
    border: false,

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.store = Ext.create('Ext.data.JsonStore', Ext.apply({
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.DataColumnSchema'
        }, config.store));
        delete config.store;

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', Ext.apply({
            clicksToEdit: 1
        }, config.editPlugin));

        me.feature = Ext.create('YZSoft.src.grid.feature.Panel', {
            panels: [{
                showAsPanel: function (record) {
                    return record.data.isTable;
                },
                createPanel: function (record, renderTo) {
                    return Ext.create('YZSoft.bpm.src.grid.feature.TableRecordPanel', Ext.apply({
                        width: me.feature.view.body.getWidth(),
                        feature: me.feature,
                        record: record,
                        renderTo: renderTo,
                        bodyPadding: '1 6 1 0',
                        cls: 'yz-grid-panel',
                        border: false,
                        listeners: {
                            beforePopupDlg: function (opt) {
                                Ext.apply(opt, {
                                    tables: me.getTableIdentitys()
                                })
                            },
                            updateStatus: function (rec, refs, panel) {
                                refs.btnMoveUp.setDisabled(!me.canMoveUp(rec));
                                refs.btnMoveDown.setDisabled(!me.canMoveDown(rec));
                            },
                            moveUpClick: function (rec) {
                                me.moveUp(rec);
                                me.fireEvent('moveUpClick', rec);
                            },
                            moveDownClick: function (rec) {
                                me.moveDown(rec);
                                me.fireEvent('moveDownClick', rec);
                            }
                        }
                    }, config.tablePanelConfig));
                }
            }]
        });

        config.viewConfig = Ext.apply({
            stripeRows: false,
            markDirty: false,
            getRowClass: function (record) {
                return 'yz-datasetschemarow-' + (record.data.isTable ? 'table' : 'column');
            }
        }, config.viewConfig);

        var cfg = {
            store: me.store,
            plugins: [me.cellEditing],
            features: [me.feature]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    addTable: function (option) {
        var me = this,
            tables = option.tables ? (Ext.isArray(option.tables) ? option.tables : [option.tables]) : [],
            addTables = [];

        Ext.each(tables, function (table) {
            if (option.clear || !me.isTableExist(table)) {
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

    findTables: function (dataset, search) {
        var rv = [];

        if (!dataset)
            return rv;

        Ext.each(dataset.Tables, function (table) {
            if (String.Equ(table.TableName, search.TableName)) {
                rv.push(table);
            }
        });

        return rv;
    },

    findTable: function (dataset, search) {
        var me = this,
            rv = me.findTables(dataset, search);

        if (rv.length == 0)
            return null;
        else
            return rv[0];
    },

    findParentRecord: function (rec) {
        var me = this,
            store = me.getStore(),
            idx = store.indexOf(rec);

        for (var i = idx - 1; i >= 0; i--) {
            var recTmp = store.getAt(i);
            if (recTmp.data.isTable)
                return recTmp;
        }
    },

    findTableRecord: function (tableIdentity) {
        var me = this,
            store = me.getStore();

        var idx = store.findBy(function (rec) {
            return rec.data.isTable && String.Equ(rec.data.TableName, tableIdentity.TableName);
        });

        return idx == -1 ? null : store.getAt(idx);
    },

    findChildColumnRecord: function (recTable, columnName) {
        var me = this,
            store = me.getStore(),
            idx = store.indexOf(recTable);

        for (var i = idx + 1, c = store.getCount(); i < c; i++) {
            var rec = store.getAt(i);
            if (rec.data.isTable)
                break;

            if (String.Equ(rec.data.ColumnName, columnName))
                return rec;
        }
    },

    getPrevTableRecord: function (rec) {
        var me = this,
            store = me.getStore(),
            idx = store.indexOf(rec);

        for (var i = idx - 1; i >= 0; i--) {
            var prec = store.getAt(i);
            if (prec.data.isTable)
                return prec;
        }
    },

    getNextTableRecord: function (rec) {
        var me = this,
            store = me.getStore(),
            idx = store.indexOf(rec);

        return store.findRecord('isTable', true, idx + 1);
    },

    canMoveUp: function (rec) {
        var me = this,
            idx = me.store.indexOf(rec);

        if (rec.data.isTable) {
            return idx >= 1;
        }
        else {
            if (idx <= 0)
                return false;

            if (me.store.getAt(idx - 1).data.isTable)
                return false;

            return true;
        }
    },

    canMoveDown: function (rec) {
        var me = this,
            idx = me.store.indexOf(rec);

        if (rec.data.isTable) {
            return me.store.findRecord('isTable', true, idx + 1) ? true : false;
        }
        else {
            if (idx >= me.store.getCount() - 1)
                return false;

            if (me.store.getAt(idx + 1).data.isTable)
                return false;

            return true;
        }
    },

    moveUp: function (rec) {
        var me = this,
            recs = [],
            step;

        if (rec.data.isTable) {
            recs = me.getChildColumnRecords(rec);
            recs = Ext.Array.push([rec], recs);

            var prevTableRec = me.getPrevTableRecord(rec);
            if (!prevTableRec)
                return;

            step = me.getChildColumnRecords(prevTableRec).length + 1;
        }
        else {
            recs = [rec];
            step = 1;
        }

        me.callParent([recs, step]);
    },

    moveDown: function (rec) {
        var me = this,
            recs = [],
            step;

        if (rec.data.isTable) {
            recs = me.getChildColumnRecords(rec);
            recs = Ext.Array.push([rec], recs);

            var nextTableRec = me.getNextTableRecord(rec);
            if (!nextTableRec)
                return;

            step = me.getChildColumnRecords(nextTableRec).length + 1;
        }
        else {
            recs = [rec];
            step = 1;
        }

        me.callParent([recs, step]);
    },

    getChildColumnRecords: function (recTable) {
        var me = this,
            store = me.getStore(),
            idx = store.indexOf(recTable),
            rv = [];

        for (var i = idx + 1, c = store.getCount(); i < c; i++) {
            var rec = store.getAt(i);
            if (rec.data.isTable)
                break;

            rv.push(rec);
        }

        return rv;
    },

    insertAtEndOfTable: function (recTable, recs) {
        var me = this,
            store = me.getStore(),
            idx = store.indexOf(recTable),
            childrens = me.getChildColumnRecords(recTable);

        store.insert(idx + childrens.length + 1, recs);
    },

    reorder: function (datasetSchema, datasetControl) {
        var me = this,
            dataset = { Tables: [] };

        Ext.each(datasetControl.Tables, function (table) {
            var schemaTable = me.findTable(datasetSchema, table);
            if (schemaTable) {
                var resultTable = Ext.clone(schemaTable);
                dataset.Tables.push(resultTable);
                resultTable.Columns = me.reorderColumns(schemaTable.Columns, table.Columns);
            }
        });

        return dataset;
    },

    reorderColumns: function (srcColumns, columns) {
        var me = this,
            rv = [];

        Ext.each(columns, function (column) {
            var columnFind = Ext.Array.findBy(srcColumns, function (srcColumn) {
                if (String.Equ(column.ColumnName, srcColumn.ColumnName)) {
                    return true;
                }
            });

            if (columnFind)
                rv.push(columnFind);
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

    getTableSelection: function () {
        var me = this,
            recs = [];

        me.store.each(function (rec) {
            if (rec.data.isTable && rec.data.selected)
                recs.push(rec);
        });

        return recs;
    },

    getColumnSelection: function () {
        var me = this,
            recs = [],
            selected = false;

        me.store.each(function (rec) {
            if (rec.data.isTable) {
                selected = rec.data.selected;
            }
            else {
                if (selected)
                    recs.push(rec);
            }
        });

        return recs;
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

    batchSetProperty: function (propertyName, value) {
        var me = this,
            recs = me.getColumnSelection();

        Ext.each(recs, function (rec) {
            rec.set(propertyName, value);
        });
    },

    getTableIdentity: function (rec) {
        return {
            DataSourceName: rec.data.DataSourceName,
            TableName: rec.data.TableName,
            IsRepeatableTable: rec.data.IsRepeatableTable
        }
    },

    getTableIdentitys: function () {
        var me = this,
            rv = [];

        me.getStore().each(function (rec) {
            if (rec.data.isTable) {
                rv.push(me.getTableIdentity(rec));
            }
        });

        return rv;
    },

    getInitCreateRecordSet: function () {
        var me = this,
            rv;

        rv = {
            Tables: []
        };

        me.getStore().each(function (rec) {
            if (rec.data.isTable && rec.data.IsRepeatableTable) {
                Ext.Array.push(rv.Tables, rec.data.InitCreateRecordSet || []);
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
                tables.push(table);
            }
            else {
                column = Ext.copyTo({}, rec.data, columnFields);
                if (!columnIsDefaultFn || !columnIsDefaultFn.call(column, column))
                    table.Columns.push(column)
            }
        });

        var rv = [];
        Ext.each(tables, function (table) {
            if (!removeEmptyTable || table.Columns.length != 0 || !tableIsDefaultFn || !tableIsDefaultFn.call(table, table))
                rv.push(table);
        });

        return rv;
    }
});
