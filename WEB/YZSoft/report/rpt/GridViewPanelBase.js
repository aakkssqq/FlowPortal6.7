/*
config
    path - path of report,
    viewName
    paging
    pageItems
    extraParams
    params 报表参数

property:
    curParams
*/
Ext.define('YZSoft.report.rpt.GridViewPanelBase', {
    //extend: 'Ext.grid.Panel',
    extend: 'YZSoft.src.grid.ExcelPanel',
    requires: [
        'YZSoft.bpm.src.ux.FormManager'
    ],
    layout: 'fit',
    border: false,
    sortableColumns: true,
    enableColumnMove: false,
    enableColumnHide: true,
    enableColumnResize: true,

    constructor: function (config) {
        var me = this,
            url = YZSoft.$url('YZSoft.Services.REST/Reports/Report.ashx'),
            cfg, gridColumns;

        me.define = config.define;
        if (!me.define) {        
            YZSoft.Ajax.request({ //获得报表定义
                method: 'GET',
                async: false,
                params: {
                    method: 'GetGridViewDefine',
                    path: config.path,
                    viewName: config.viewName
                },
                url: url,
                scope: me,
                success: function (action) {
                    me.define = action.result;
                }
            });
        }

        me.store = config.store;
        if (!me.store) {
            me.store = Ext.create('YZSoft.report.rpt.store.ReportStore', {
                pageSize: config.paging ? (config.pageItems || $S.pageSize.defaultSize) : 1000,
                proxy: {
                    extraParams: Ext.apply({
                        path: config.path,
                        viewName: config.viewName,
                        paging:config.paging,
                        params: Ext.util.Base64.encode(Ext.encode(config.params))
                    }, config.extraParams)
                }
            });
        }

        gridColumns = [];
        Ext.each(me.define.view.ColumnInfos, function (columnInfo) {
            var schemacol = me.findColumn(columnInfo.ColumnName),
                gridColumn;

            gridColumn = {
                header: (schemacol || {}).DisplayName || columnInfo.ColumnName,
                dataIndex: columnInfo.ColumnName,
                sortable: true,
                hidden: !columnInfo.Visible,
                width: Ext.Number.from(columnInfo.Width, undefined),
                group: columnInfo.Group,
                minWidth: 100,
                align: columnInfo.Align || 'left',
                scope: me,
                renderer: 'renderValue',
                listeners: {
                    scope: me,
                    click: 'onClickColumn'
                }
            };

            gridColumns.push(gridColumn);
        });

        cfg = {
            store: me.store,
            columns: gridColumns,
            trackMouseOver: true,
            disableSelection: false,
            viewConfig: {
                stripeRows: false,
                markDirty: false,
                enableTextSelection:true
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.on({
            scope: me,
            load: function (store, records, successful, operation, eOpts) {
                me.curParams = Ext.decode(Ext.util.Base64.decode(operation.getRequest().getParams().params));
            }
        });
    },

    findColumn: function (columnName) {
        var me = this;

        return Ext.Array.findBy(me.define.columnInfos, function (schemacol) {
            return String.Equ(schemacol.ColumnName, columnName);
        });
    },

    renderValue: function (value, metaData, record, rowIndex, colIndex, store) {
        var me = this,
            columnName = metaData.column.dataIndex,
            columnDefine = me.findColumn(columnName);

        if (columnDefine) {
            if (columnDefine.LinkType == 'Task') {
                var linkParams = me.getLinkParams(columnDefine.ParametersFill, record);
                if ('@TaskID' in linkParams)
                    return Ext.String.format('<a href="#" class="yz-report-tasklinkbase yz-report-tasklink">{0}</a>', value);
            }

            if (columnDefine.LinkType == 'FormApplication' && !Ext.isEmpty(columnDefine.LinkTo)) {
                var linkParams = me.getLinkParams(columnDefine.ParametersFill, record);

                if ('@Key' in linkParams)
                    return Ext.String.format('<a href="#" class="yz-report-formapplink">{0}</a>', value);
            }

            if (columnDefine.LinkType == 'Report' && !Ext.isEmpty(columnDefine.LinkTo))
                return Ext.String.format('<a href="#" class="yz-report-reportlink">{0}</a>', value);
        }

        if (String.Equ(columnName, 'TaskID'))
            return Ext.String.format('<a href="#" class="yz-report-tasklinkbase yz-report-taskid">{0}</a>', value);

        return YZSoft.HttpUtility.htmlEncode(value, true);
    },

    onClickColumn: function (view, cell, recordIndex, cellIndex, e) {
        var me = this,
            column = e.position.column,
            record = e.position.record,
            columnName = column.dataIndex,
            columnDefine = me.findColumn(columnName);

        if (e.getTarget().tagName != 'A')
            return;

        if (columnDefine) {
            if (columnDefine.LinkType == 'Task') {
                var linkParams = me.getLinkParams(columnDefine.ParametersFill, record);
                me.openTask(linkParams['@TaskID'], record.data[columnName + 'Token']);
                return;
            }

            if (columnDefine.LinkType == 'FormApplication') {
                var linkParams = me.getLinkParams(columnDefine.ParametersFill, record);

                YZSoft.bpm.src.ux.FormManager.openFormApplication(columnDefine.LinkTo, linkParams['@Key'], 'Report', {
                    sender: me
                });
                return;
            }

            if (columnDefine.LinkType == 'Report') {
                var linkParams = me.getLinkParams(columnDefine.ParametersFill, record);

                me.gotoReport(record, columnName, columnDefine.LinkTo, linkParams, {
                    sender: me
                });
                return;
            }
        }

        if (String.Equ(columnName, 'TaskID')) {
            me.openTask(record.get(columnName), record.data.Token);
            return;
        }
    },

    openTask: function (taskid, token) {
        YZSoft.bpm.src.ux.FormManager.openTaskForRead(taskid, {
            sender: this,
            params: {
                token: token
            }
        });
    },

    getLinkParams: function (paramsFill, record) {
        var me = this,
            rv = {};

        paramsFill = paramsFill || [];
        Ext.each(paramsFill, function (fill) {
            if (!Ext.isEmpty(fill.FillWith)) {
                if (fill.FillWith in record.data) {
                    rv[fill.Name] = record.get(fill.FillWith);
                }
                else if (Ext.String.startsWith(fill.FillWith, 'Params.', true)) {
                    var fillWith = fill.FillWith.substring(7);

                    var curParam = Ext.Array.findBy(me.curParams, function (curParam) {
                        return String.Equ(curParam.name, fillWith)
                    });

                    if (curParam)
                        rv[fill.Name] = curParam.value;
                }
            }
        });

        return rv;
    },

    gotoReport: function (record, columnName, reportPath, params, config) {
        var me = this,
            linktext = record.get(columnName);

        YZSoft.ViewManager.addView(me, 'YZSoft.report.rpt.Panel', Ext.apply({
            titleTpl: linktext ? '{0} - ' + linktext : '{0}',
            path: reportPath,
            params: params
        }, config));
    }
});