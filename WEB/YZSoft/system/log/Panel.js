
Ext.define('YZSoft.system.log.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.AppLog'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.AppLog',
            pageSize: $S.pageSize.BPMAdmin.appLog,
            sorters: {
                property: 'LogDate',
                direction: 'DESC'
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/AppLog.ashx'),
                extraParams: {
                    method: 'GetAppLog'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function (store, operation, eOpts) {
                    var params = operation.getParams() || {};
                    Ext.apply(params, {
                        date: me.edtDate.getValue()
                    });
                    operation.setParams(params);
                },
                load: function (store, records, successful, operation, eOpts) {
                    if (!successful)
                        return;

                    var params = operation.getParams() || {};

                    me.labCaption.setText(Ext.Date.format(params.date, RS.$('All_BPMLog_Caption')));
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            viewConfig: {
                getRowClass: function (record) {
                    return record.data.Succeed ? '' : 'yz-grid-row-warn';
                }
            },
            columns: [
                { text: RS.$('Log_Date'), dataIndex: 'LogDate', width: 80, align: 'left', renderer: me.renderTime },
                { text: RS.$('All_User'), dataIndex: 'UserAccount', width: 120, align: 'center', renderer: me.renderUser },
                { text: RS.$('All_Operate'), dataIndex: 'Action', width: 120, align: 'center', sortable: true },
                { text: RS.$('Log_Comments'), dataIndex: 'ActParam1', width: 180, align: 'center', renderer: me.renderAction },
                { text: RS.$('Log_Detail'), dataIndex: 'Error', flex: 1, align: 'left', sortable: false, renderer: me.renderErr },
                { text: RS.$('All_FromIP'), dataIndex: 'ClientIP', width: 120, align: 'center' },
                { text: RS.$('Log_Result'), dataIndex: 'Succeed', width: 80, align: 'center', renderer: me.renderResult },
                { text: RS.$('Log_UsedTime'), dataIndex: 'TickUsed', width: 90, align: 'right', menuDisabled: true, renderer: me.renderTick }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            })
        });

        me.labCaption = Ext.create('Ext.toolbar.TextItem', {
            text: '',
            style: 'font-size:22px;font-weight:bold'
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('Log{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            btnConfig: {
                margin: '0 0 0 10'
            },
            fileName: 'BPMLog',
            allowExportAll: true,
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date()
                }
            }
        });

        me.pnlSearch = Ext.create('YZSoft.system.log.SearchPanel', {
            hidden: config.collapseSearchPanel !== false,
            region: 'north',
            store: me.store
        });

        me.btnSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_Search'),
            margin: '0 0 0 8',
            expandPanel: me.pnlSearch
        });

        me.btnPrev = Ext.create('Ext.button.Button', {
            text: Ext.String.format('< {0}', RS.$('All_PreviousDay')),
            margin: 0,
            handler: function (item) {
                var date = me.edtDate.getValue(),
                    prev = Ext.Date.add(date, Ext.Date.DAY, -1);

                me.edtDate.setValue(prev);
            }
        });

        me.btnNext = Ext.create('Ext.button.Button', {
            text: Ext.String.format('{0} >', RS.$('All_NextDay')),
            margin: 0,
            handler: function (item) {
                var date = me.edtDate.getValue(),
                    next = Ext.Date.add(date, Ext.Date.DAY, 1);

                me.edtDate.setValue(next);
            }
        });

        me.edtDate = Ext.create('Ext.form.field.Date', {
            margin: '0 6',
            width: 130,
            editable: false,
            value: new Date(),
            allowBlank: false,
            listeners: {
                change: function () {
                    me.store.loadPage(1,{
                        loadMask: true
                    });
                }
            }
        });

        cfg = {
            layout: 'border',
            items: [me.pnlSearch, me.grid],
            tbar: {
                padding: '10 6 10 8',
                items: [
                    me.labCaption,
                    me.btnExcelExport,
                    me.btnSearch,
                    '->',
                    me.btnPrev,
                    me.edtDate,
                    me.btnNext
                ]
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    renderTime: function (value, metaData, record) {
        return Ext.String.format('<span data-qtip="{1}">{0}</span >',
            Ext.Date.format(value,'H:i:s'),
            Ext.Date.format(value, RS.$('All_Date_Format_s'))
        );
    },

    renderUser: function (value, metaData, record) {
        var me = this,
            data = record.data;

        return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="l50-r50">{1}</span>',
            Ext.util.Format.text(data.UserAccount),
            Ext.util.Format.text(data.UserDisplayName || data.UserAccount));
    },

    renderAction:function(value,metaData,record){
        var items = [];

        Ext.each(['ActParam1', 'ActParam2'], function (name) {
            if (record.data[name])
                items.push(record.data[name]);
        });

        return items.join(',');
    },

    renderErr: function (value, metaData, record) {
        return Ext.String.format('<span data-qtip="{0}">{0}</span >',
            Ext.util.Format.text(value)
        );
    },

    renderResult: function (value) {
        return value ? RS.$('AppLog_Result_Success') : RS.$('AppLog_Result_Fail');
    },

    renderTick: function (value) {
        return (value / 1000).toFixed(3);
    }
});
