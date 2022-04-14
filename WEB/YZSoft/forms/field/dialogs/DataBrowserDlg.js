/*
config
    ds,
    filters,
    displayColumns
    mapColumns,
    multiSelect
*/
Ext.define('YZSoft.forms.field.dialogs.DataBrowserDlg', {
    extend: 'Ext.window.Window', //111111
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 980,
    minWidth: 980,
    minHeight: 610,
    modal: false,
    resizable: false,
    maximizable: true,
    buttonAlign: 'right',
    constrain: true,

    constructor: function (config) {
        var me = this,
            isTableDS = config.ds.TableName,
            cfg;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
            async: false,
            params: Ext.apply({
                method: 'GetDataSourceSchema'
            }, config.ds),
            success: function (action) {
                me.DSSchema = action.result.Tables[0];
            }
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
            async: false,
            params: Ext.apply({
                method: 'GetDataSourceParams'
            }, config.ds),
            success: function (action) {
                me.DSParams = action.result.Tables[0];
            }
        });

        var displayColumns = me.regularDisplayColumns(config.displayColumns, config.mapColumns, me.DSSchema);

        //根据数据源查询参数，获得能动态查询的参数
        var dynSearchParams = [];
        Ext.each(me.DSParams.Columns, function (dsparam) {
            //去掉固定filter项目
            if (me.isFixFilter(config.filters, dsparam.ColumnName))
                return;

            //如果是table数据源，只查询可显示列
            if (isTableDS) {
                var exist = Ext.Array.findBy(displayColumns, function (displayColumn) {
                    if (String.Equ(displayColumn.columnName, dsparam.ColumnName))
                        return true;
                });

                if (!exist)
                    return;

                //为dsparam添加displayName列
                var displayColumn = me.findDisplayColumn(displayColumns, dsparam.ColumnName);
                if (displayColumn)
                    dsparam.displayName = displayColumn.displayName;
            }

            dynSearchParams.push(dsparam);
        });

        //准备displayColumns
        var gridColumns = [],
            hasFlexColumn;

        Ext.each(displayColumns, function (column) {
            var gridColumn = {
                header: column.displayName || column.columnName,
                dataIndex: column.columnName,
                sortable: true,
                hidden: column.hidden,
                scope: me,
                renderer: 'renderValue'
            };

            if (!column.width || column.width < 0)
                gridColumn.flex = 1;
            else
                gridColumn.width = column.width;

            if (!gridColumn.hidden && gridColumn.flex)
                hasFlexColumn = true;

            gridColumns.push(gridColumn);
        });

        //扩展列
        if (!hasFlexColumn) {
            for (var i = gridColumns.length - 1; i >= 0; i--) {
                var gridColumn = gridColumns[i];
                if (!gridColumn.hidden) {
                    delete gridColumn.width;
                    gridColumn.flex = 1
                    break;
                }
            }
        }

        //创建store
        var fields = [];
        Ext.each(me.DSSchema.Columns, function (column) {
            fields.push(column.ColumnName);
        });

        var supportAllSearchParams = [];
        Ext.each(dynSearchParams, function (dsParam) {
            if (dsParam.DataType && dsParam.DataType.name == 'String')
                supportAllSearchParams.push(dsParam.ColumnName);
        });

        var allOutputColumns = [];
        Ext.each(displayColumns, function (displayColumn) {
            allOutputColumns.push(displayColumn.columnName);
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: $S.pageSize.xform.databrowser,
            fields: fields,
            proxy: {
                actionMethods: { read: 'POST' },
                type: 'ajax',
                url: YZSoft.$url(me, 'DataBrowser.ashx?method=GetData'),
                extraParams: {
                    ds: Ext.util.Base64.encode(Ext.encode(config.ds)),
                    filters: Ext.util.Base64.encode(Ext.encode(config.filters)), //固定filter
                    supportAllSearchParams: Ext.util.Base64.encode(Ext.encode(supportAllSearchParams)), //all搜索列
                    allOutputColumns: Ext.util.Base64.encode(Ext.encode(allOutputColumns)), //结果集包含列
                    params: Ext.util.Base64.encode(Ext.encode([]))
                },
                reader: {
                    rootProperty: 'children'
                },
                listeners: {
                    exception: function (store, response, operation, eOpts) {
                        try {
                            var err = Ext.decode(response.responseText || { errorMessage: '' });
                            YZSoft.alert(err.errorMessage);
                        }
                        catch (exp) {
                            Ext.log.warn(Ext.String.format(RS.$('All_JsonDecodeError'), store.url, response.responseText));
                            return;
                        }
                    }
                }
            }
        });

        if (config.multiSelect)
            me.sm = Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' });
        else
            me.sm = Ext.create('Ext.selection.CheckboxModel', { mode: 'SINGLE' });

        me.sm.on({
            scope: me,
            selectionchange: function () {
                me.updateStatus();
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            border: true,
            minHeight: 380,
            flex: 1,
            store: me.store,
            selModel: me.sm,
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: gridColumns
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        }, config.gridConfig));

        if (!config.multiSelect) {
            me.grid.on({
                scope: me,
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.closeDialog([record.data]);
                }
            });
        }

        //me.store.load();

        //将数据源可动态查询参数转化为ExtSearchPanel查询参数
        var params = [];
        Ext.each(dynSearchParams, function (dsparam) {
            params.push({
                name: dsparam.ColumnName,
                displayName: dsparam.displayName || dsparam.ColumnName,
                dataType: dsparam.DataType
            });
        });

        //对table数据源，添加全文搜索
        if (isTableDS) {
            params.splice(0, 0, {
                isAll: true,
                name: 'all',
                displayName: RS.$('All_All'),
                op: ['like']
            });
        }

        me.pnlSearch = Ext.create(isTableDS ? 'YZSoft.bpm.src.panel.ExtSearchPanel' : 'YZSoft.bpm.src.panel.ParamsPanel', {
            params: params,
            selectFirstItem: isTableDS,
            listeners: {
                scope: me,
                searchClicked: 'onSearch'
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var sm = me.sm,
                    recs = sm.getSelection();

                if (recs) {
                    var rows = [];
                    Ext.each(recs, function (v) {
                        rows.push(v.data);
                    });

                    me.closeDialog(rows);
                }
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            scope: this,
            handler: function () {
                me.close();
            }
        });

        cfg = {
            title: config.title + ' - ' + config.ds.TableName,
            items: [me.pnlSearch, me.grid],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.onSearch(me.pnlSearch, me.pnlSearch.getParams(), {
            loadMask: {
                start: 200
            }
        });
    },

    renderValue: function (value, metaData, record, rowIndex, colIndex, store) {
        return YZSoft.HttpUtility.htmlEncode(value);
    },

    regularDisplayColumns: function (displayColumns, mapColumns, schema) {
        var me = this,
            rv = [];

        displayColumns = displayColumns || [];
        mapColumns = mapColumns || [];

        Ext.each(displayColumns, function (displayColumn) {
            var column = me.findSchemaColumn(schema, displayColumn.columnName);
            if (column && !me.findDisplayColumn(rv, column.ColumnName)) {
                rv.push(Ext.apply(Ext.clone(displayColumn), {
                    columnName: column.ColumnName,
                    width: Ext.Number.from(displayColumn.width, -1)
                }));
            }
        });

        var displayColumnExist = rv.length != 0;
        Ext.each(mapColumns, function (columnName) {
            var column = me.findSchemaColumn(schema, columnName);
            if (column && !me.findDisplayColumn(rv, column.ColumnName)) {
                rv.push({
                    columnName: columnName,
                    hidden: displayColumnExist
                });
            }
        });

        if (rv.length == 0) {
            Ext.each(schema.Columns, function (column) {
                rv.push({
                    columnName: column.ColumnName
                });
            });
        }

        return rv;
    },

    findSchemaColumn: function (schema, columnName) {
        return Ext.Array.findBy(schema.Columns, function (column) {
            if (String.Equ(column.ColumnName, columnName))
                return true;
        });
    },

    findDisplayColumn: function (displayColumns, columnName) {
        return Ext.Array.findBy(displayColumns, function (displayColumn) {
            if (String.Equ(displayColumn.columnName, columnName))
                return true;
        });
    },

    isFixFilter: function (filters, columnName) {
        return (columnName in filters);
    },

    onSearch: function (pnlSearch, params, config) {
        var me = this,
            extParams = me.store.getProxy().getExtraParams();

        extParams.params = Ext.util.Base64.encode(Ext.encode(params));
        me.store.loadPage(1, Ext.apply({
            loadMask: {
                start: 0
            }
        }, config));
    },

    updateStatus: function () {
        var me = this;
        sm = me.sm,
            recs = sm.getSelection();

        me.btnOK.setDisabled(recs.length == 0);
    }
});