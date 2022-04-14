/*
* uid
* collapseSearchPanel - true/false
*/

Ext.define('YZSoft.bpm.maintenance.HandoverWorklistPanel', {
    extend: 'YZSoft.bpm.src.panel.WorklistAbstract',
    title: RS.$('All_WorkList'),
    requires: [
        'YZSoft.bpm.src.model.Worklist',
        'YZSoft.bpm.taskoperation.Manager',
        'YZSoft.bpm.src.ux.FormManager'
    ],
    config: {
        uid: null
    },

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 100,
            model: 'YZSoft.bpm.src.model.Worklist',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetWorkListOfUser',
                    uid:config.uid
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function (store, operation, eOpts) {
                },
                load: function (store, records, successful, operation, eOpts) {
                    if (successful)
                        me.setTitle(Ext.String.format('{0}({1})', RS.$('All_WorkList'), store.getTotalCount()));
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            selModel: {
                selType: 'checkboxmodel',
                mode: 'SIMPLE'
            },
            columns: [
                { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlags.bind(me) },
                { locked: false, text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', sortable: true, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN } },
                { locked: false, text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 130, align: 'left', sortable: true, renderer: me.renderProcessName },
                { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', sortable: true, flex: 1, cellWrap: true },
                { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', sortable: true, renderer: me.renderTaskOwner.bind(me) },
                { text: RS.$('All_PostAt'), dataIndex: 'CreateAt', width: 130, align: 'center', sortable: true, formatter: 'friendlyDate' },
                { text: RS.$('All_CurStep'), hidden: true, dataIndex: 'NodeName', width: 100, align: 'center', sortable: true, formatter: 'text' },
                { text: RS.$('All_Timeout_Column'), width: 120, align: 'center', sortable: false, renderer: me.renderTimeout },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('All_Handover'),
                    width: 100,
                    align: 'center',
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    disabledCls: 'yz-visibility-hidden',
                    items: [{
                        glyph: 0xeae1,
                        iconCls: 'yz-m-l8 yz-size-icon-13',
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            var sm = grid.getSelectionModel();

                            sm.select(record);
                            me.handover(record);
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

        me.btnHandover = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e60e',
            text: RS.$('All_BatchHandover'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, null, 1, -1));
            },
            handler: function () {
                var grid = me.grid,
                    sm = grid.getSelectionModel(),
                    recs = sm.getSelection() || [];

                if (recs.length == 0)
                    return;

                me.handover(recs);
            }
        });

        me.btnTransfer = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e614',
            text: RS.$('All_Transfer'),
            perm: 'Transfer',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function () {
                YZSoft.bpm.taskoperation.Manager.Transfer(me.grid);
            }
        });

        me.btnPutbackShareTask = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_PutbackShare'),
            glyph: 0xeb1d,
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, 'Share', 1, -1));
            },
            handler: function () {
                YZSoft.bpm.taskoperation.Manager.PutbackShareTask(me.grid);
            }
        });

        me.btnBatchApprove = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e627',
            text: RS.$('All_BatchApprove'),
            perm: 'BatchApprove',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function () {
                YZSoft.bpm.taskoperation.Manager.BatchApprove(me.grid);
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

                me.openTrace(recs[0], 1);
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

        me.searchPanel = Ext.create('YZSoft.bpm.src.panel.TaskSearchPanel', {
            hidden: config.collapseSearchPanel !== false,
            region: 'north',
            disableTaskState: true,
            store: me.store
        });

        me.btnSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_Search'),
            expandPanel: me.searchPanel
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            cls: 'yz-tbar-module',
            items: [
                me.btnHandover,
                me.btnPutbackShareTask,
                '|',
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

    openForm: function (record) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        });
    },

    updateUid: function (uid) {
        var me = this,
            store = me.store;

        me.store.getProxy().getExtraParams().uid = uid;
        me.store.loadPage(1);
    }
});