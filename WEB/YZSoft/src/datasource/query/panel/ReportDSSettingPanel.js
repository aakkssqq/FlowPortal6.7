
Ext.define('YZSoft.src.datasource.query.panel.ReportDSSettingPanel', {
    extend: 'Ext.panel.Panel',
    border:true,

    constructor: function (config) {
        var me = this,
            config = config || {},
            value = config.value || {},
            cfg;

        me.tables = Ext.create('YZSoft.src.datasource.query.panel.TableAssist', {
            region: 'west',
            width: 250,
            datasourceName: value.datasourceName,
            split: {
                size: 4
            },
            listeners: {
                tableClick: function (table) {
                    me.edtQuery.insertAtCaret(table.TableName);
                    me.edtQuery.focus();
                },
                columnClick: function (column) {
                    me.edtQuery.insertAtCaret(column.ColumnName);
                    me.edtQuery.focus();
                }
            }
        });

        me.btnRun = Ext.create('Ext.button.Button', {
            glyph: 0xea86,
            text: RS.$('All_Run'),
            margin: 0,
            scope:me,
            handler: 'onRun'
        });

        me.btnUpdataParams = Ext.create('Ext.button.Button', {
            glyph: 0xe60f,
            text: RS.$('Designer_DataSource_Query_UpdateParams'),
            margin: 0,
            scope: me,
            handler: function () {
                me.updateParams(function () {
                    me.tabResult.setActiveItem(me.pnlParams);
                });
            }
        });

        me.edtQuery = Ext.create('YZSoft.src.form.field.Query', {
            region:'center',
            cls: ['yz-form-field-noborder', 'yz-form-field-code'],
            value: value.query
        });

        me.pnlResult = Ext.create('YZSoft.src.panel.QueryResultPanel', {
            title: RS.$('Designer_DataSource_Query_Result')
        });

        me.fieldParams = Ext.create('YZSoft.src.datasource.field.DSParams', {
            border: false,
            value: value.queryParams
        });

        me.pnlParams = Ext.create('Ext.container.Container', {
            title: RS.$('Designer_Params'),
            layout:'fit',
            items: [me.fieldParams],
            listeners: {
                activate: function () {
                    me.updateParams();
                }
            }
        });

        me.tabResult = Ext.create('Ext.tab.Panel', {
            region: 'south',
            height: 200,
            split: {
                size: 4
            },
            tabBar: {
                cls: 'yz-tab-bar-window-sub'
            },
            items: [
                me.pnlResult,
                me.pnlParams
            ]
        });

        cfg = {
            layout:'border',
            items: [me.tables, {
                xtype: 'panel',
                region: 'center',
                layout:'border',
                tbar: {
                    cls: 'yz-tbar-module',
                    padding: 3,
                    style: 'background-color:#f5f5f5;',
                    items: [me.btnRun, '->', me.btnUpdataParams]
                },
                items: [
                    me.edtQuery,
                    me.tabResult
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateParams: function (fn) {
        var me = this,
            datasourceName = me.tables.getDatasourceName(),
            query = Ext.String.trim(me.edtQuery.getValue());

        if (!query) {
            me.fieldParams.setParams([]);
            fn && fn();
            return;
        }

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportAdmin.ashx'),
            params: {
                method: 'ParseCommandText',
                datasourceName: datasourceName,
                query: query
            },
            success: function (action) {
                me.fieldParams.setParams(action.result);
                fn && fn();
            }
        });
    },

    save: function (fn) {
        var me = this,
            datasourceName = me.tables.getDatasourceName(),
            query = Ext.String.trim(me.edtQuery.getValue()),
            ds;

        me.updateParams(function () {
            ds = {
                type:'query',
                datasourceName: datasourceName,
                query: query,
                queryParams: me.fieldParams.getValue()
            };

            fn && fn(ds);
        });
    },

    onRun: function () {
        var me = this;

        me.save(function (ds) {
            me.fireEvent('beforerun', ds);

            if (!ds.query)
                return;

            ds = Ext.create('YZSoft.src.datasource.DataSource', ds);
            ds.getParams({}, function (params) {
                if (Ext.isEmpty(params)) {
                    me.execute(ds);
                }
                else {
                    Ext.create('YZSoft.src.datasource.dialogs.ExecuteParamsDialog', {
                        autoShow: true,
                        params: params,
                        value: me.lastParams,
                        fn: function (params) {
                            me.lastParams = params;
                            me.execute(ds, params);
                        }
                    });
                }
            });
        });
    },

    execute: function (ds, params) {
        var me = this,
            store;

        ds.getSchema({},function (columns) {
            store = ds.createStore({
                dsFilters: params
            });

            store.loadPage(1, {
                callback: function (records, options, success) {
                    if (!success) {
                        YZSoft.alert(options.error);
                        return;
                    }

                    me.pnlResult.showResult(columns, store);
                    me.tabResult.setActiveItem(me.pnlResult);
                }
            });
        });
    }
});