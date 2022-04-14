/*
* uid
* collapseSearchPanel - true/false
*/

Ext.define('YZSoft.bpm.monitor.timeout.Panel', {
    extend: 'YZSoft.bpm.src.panel.WorklistAbstract',
    requires: [
        'YZSoft.bpm.src.model.Worklist',
        'YZSoft.bpm.taskoperation.Manager',
        'YZSoft.bpm.src.ux.FormManager',
        'YZSoft.bpm.src.sparkline.StepProgress'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 20,
            model: 'YZSoft.bpm.src.model.Worklist',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetTimeoutMonitorWorklist',
                    uid:config.uid
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function (store, operation, eOpts) {
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            columns: [
                { xtype: 'rownumberer', align: 'center' },
                { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlags.bind(me) },
                { locked: false, text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', sortable: true, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN } },
                { locked: false, text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 130, align: 'left', sortable: true, renderer: me.renderProcessName },
                { locked: false, text: RS.$('All_CurStep'), dataIndex: 'NodeName', width: 100, align: 'center', sortable: true, renderer1: YZSoft.Render.renderString },
                { locked: false, text: RS.$('All_Recipient'), dataIndex: 'Recipient', width: 100, align: 'center', sortable: true, renderer: me.renderRecipient },
                { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', sortable: true, flex: 1, cellWrap: false },
                { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', sortable: true, renderer: me.renderTaskOwner.bind(me) },
                { text: RS.$('All_PostAt'), dataIndex: 'CreateAt', width: 130, align: 'center', sortable: true, formatter: 'friendlyDate' },
                { text: RS.$('All_ReceiveAt'), hidden:true, dataIndex: 'ReceiveAt', width: 130, align: 'center', sortable: true, formatter: 'date("n-d H:i")' },
                { text: RS.$('All_Deadline'), hidden: true, dataIndex: 'TimeoutDeadline', width: 130, align: 'center', sortable: true, formatter: 'date("n-d H:i")' },
                { locked: false, text: RS.$('All_Timeout'), xtype: 'widgetcolumn', width: 120, sortable: true, dataIndex: 'Progress', widget: {
                    xtype: 'yzstepprogresswidget',
                    textTpl: [
                        '{percent:number("0")}%'
                    ]
                }
                },
                { text: RS.$('All_TimeoutNotifyCount'), dataIndex: 'TimeoutNotifyCount', minWidth: 60, align: 'center', sortable: true },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('All_ActionTip_Trace'),
                    width: 68,
                    align: 'center',
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    disabledCls: 'yz-visibility-hidden',
                    items: [{
                        glyph: 0xeb24,
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            me.openTrace(record);
                        }
                    }]
                }
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            }),
            listeners: {
                itemdblclick: function (grid, record, item, index, e, eOpts) {
                    me.openForm(record);
                }
            }
        });

        me.menuTraceChart = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_ProcessChart'),
            glyph: 0xeae5,
            handler: function (item) {
                sm = me.grid.getSelectionModel();
                recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openTrace(recs[0], 0);
            }
        });

        me.menuTraceList = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_TraceTimeline'),
            glyph: 0xeb1e,
            handler: function (item) {
                var sm = me.grid.getSelectionModel(),
                    recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openTrace(recs[0], 1);
            }
        });

        me.menuForecast = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_Forecast'),
            glyph: 0xea94,
            handler: function (item) {
                var sm = me.grid.getSelectionModel(),
                    recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openTrace(recs[0], 2);
            }
        });

        me.btnTrace = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_TaskTrace'),
            glyph: 0xeb10,
            menu: { items: [me.menuTraceChart, me.menuTraceList, me.menuForecast] },
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, null, 1, 1));
            }
        });

        me.searchPanel = Ext.create('YZSoft.bpm.monitor.timeout.SearchPanel', {
            hidden: config.collapseSearchPanel !== false,
            region: 'north',
            disableTaskState: true,
            grid: me.grid
        });

        me.btnSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_Search'),
            expandPanel: me.searchPanel
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            cls: 'yz-tbar-module',
            items: [
                me.btnTrace,
                '->',
                me.btnSearch
            ]
        });

        me.sts = Ext.create('YZSoft.src.sts', {
            tbar: me.toolBar,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            request: {
                params: {
                    Method: 'GetProcessingPermision'
                }
            }
        });

        cfg = {
            layout: 'border',
            tbar: me.toolBar,
            items: [me.searchPanel, me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.initTimeoutFlagTip(me.grid);
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);

        delete this.modified;
    },

    renderRecipient: function (value, metaData, record) {
        if (!value.account)
            return RS.$('All_None');

        return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="l50-r50">{1}</span>',
            Ext.util.Format.text(value.account),
            Ext.util.Format.text(value.displayName || data.account));
    },

    openForm: function (record) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        });
    }
});