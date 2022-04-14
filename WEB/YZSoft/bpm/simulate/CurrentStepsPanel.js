/*
* specProcessName - process name
* collapseSearchPanel - true/false
*/

Ext.define('YZSoft.bpm.simulate.CurrentStepsPanel', {
    extend: 'YZSoft.bpm.src.panel.WorklistAbstract',
    requires: [
        'YZSoft.bpm.src.model.Worklist',
        'YZSoft.src.ux.Push',
        'YZSoft.bpm.taskoperation.Manager',
        'YZSoft.bpm.src.ux.FormManager'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: $S.pageSize.defaultSize,
            model: 'YZSoft.bpm.src.model.Worklist',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetWorkList',
                    specProcessName: config.specProcessName
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
            selModel: {
                selType: 'checkboxmodel',
                mode: 'MULTI'
            },
            columns: [
                { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlags.bind(me) },
                { locked: false, text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', sortable: true, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN} },
                { locked: false, text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 130, align: 'left', sortable: true, renderer: me.renderProcessName },
                { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', sortable: true, flex: 1, cellWrap: true },
                { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', sortable: true, renderer: me.renderTaskOwner.bind(me) },
                { text: RS.$('All_PostAt'), dataIndex: 'CreateAt', width: 130, align: 'center', sortable: true, formatter: 'friendlyDate' },
                { text: RS.$('All_CurStep'), dataIndex: 'NodeName', width: 100, align: 'center', sortable: true, formatter: 'text' },
                { text: RS.$('All_Timeout_Column'), width: 120, align: 'center', sortable: false, renderer: me.renderTimeout }
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

        me.btnReject = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-reject',
            text: RS.$('All_Reject'),
            perm: 'Reject',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function () {
                YZSoft.bpm.taskoperation.Manager.Reject(me.grid);
            }
        });

        me.btnReturnToInitiator = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e612',
            text: RS.$('All_ReturnToIniaiator'),
            perm: 'RecedeRestart',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function () {
                YZSoft.bpm.taskoperation.Manager.ReturnToInitiator(me.grid);
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

        me.btnKM = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_StepKM'),
            glyph: 0xeb18,
            perm: 'StepKM',
            hidden: YZSoft.modules.BPA === false,
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, 'StepKM', 1, -1));
            },
            handler: function () {
                var sm = me.grid.getSelectionModel();
                recs = sm.getSelection(),
                    rec = recs[0];

                if (rec)
                    me.openKM(rec);
            }
        });

        me.menuInform = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e657',
            text: RS.$('All_Inform'),
            perm: 'Inform',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function (item) {
                YZSoft.bpm.taskoperation.Manager.Inform(me.grid);
            }
        });

        me.menuInviteIndicate = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_InviteIndicate'),
            glyph: 0xeb20,
            perm: 'InviteIndicate',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function (item) {
                YZSoft.bpm.taskoperation.Manager.InviteIndicate(me.grid);
            }
        });

        me.menuPublic = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_Public'),
            glyph: 0xe918,
            perm: 'Public',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function (item) {
                YZSoft.bpm.taskoperation.Manager.Public(me.grid);
            }
        });

        me.menuRecedeBack = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-ea40',
            text: RS.$('All_RecedeBack'),
            perm: 'RecedeBack',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function () {
                YZSoft.bpm.taskoperation.Manager.RecedeBack(me.grid);
            }
        });

        me.menuJump = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_Jump'),
            glyph: 0xeb1f,
            perm: 'Jump',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: function (item) {
                YZSoft.bpm.taskoperation.Manager.Jump(me.grid);
            }
        });

        me.menuAbort = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e606',
            text: RS.$('All_Abort'),
            perm: 'Abort',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function (item) {
                YZSoft.bpm.taskoperation.Manager.Abort(me.grid);
            }
        });

        me.menuDelete = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            perm: 'Delete',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function (item) {
                YZSoft.bpm.taskoperation.Manager.Delete(me.grid);
            }
        });

        me.btnMore = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e602',
            text: RS.$('All_MoreOpt'),
            menu: {
                items: [
                    me.menuInform,
                    me.menuInviteIndicate,
                    me.menuPublic,
                    '-',
                    me.menuRecedeBack,
                    me.menuJump,
                    '-',
                    me.menuAbort,
                    me.menuDelete
                ]
            }
        });

        me.edtSearch = Ext.create('YZSoft.src.form.field.Search', {
            store: me.store,
            createSearchPanel: function () {
                var pnl = Ext.create({
                    xclass: 'YZSoft.bpm.src.panel.TaskSearchPanel',
                    region: 'north',
                    specProcessName: config.specProcessName,
                    disableTaskState: true,
                    store: me.store
                });

                me.insert(0, pnl);
                return pnl;
            }
        });

        me.toolBar = Ext.create('Ext.toolbar.Toolbar', {
            cls: 'yz-tbar-module',
            items: [
                me.btnBatchApprove,
                me.btnReject,
                me.btnReturnToInitiator,
                me.btnTransfer,
                me.btnPutbackShareTask,
                '|',
                me.btnTrace,
                me.btnKM,
                '|',
                me.btnMore,
                '->',
                me.edtSearch
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
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.initTimeoutFlagTip(me.grid);

        me.store.on({
            single: true,
            load: function () {
                YZSoft.src.ux.Push.subscribe({
                    cmp: me,
                    channel: 'worklistChanged',
                    fn: function () {
                        YZSoft.src.ux.Push.on({
                            worklistChanged: 'onWorkListChanged',
                            scope: me
                        });
                    }
                });
                me.on({
                    destroy: function () {
                        YZSoft.src.ux.Push.unsubscribe({
                            cmp: me,
                            channel: 'worklistChanged'
                        });
                    }
                });
            }
        });
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    onWorkListChanged: function () {
        //处理时，触发了主动加载，此时不需要启用推送更新
        if (this.store.isLoading())
            return;

        this.store.loadPage(1, {
            loadMask: false
        });
    },

    openForm: function (record) {
        YZSoft.bpm.src.ux.FormManager.openTaskForProcess(record.data.StepID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum),
            listeners: {
                scope: this,
                modified: function (name, data) {
                    this.store.reload({
                        loadMask: false
                    });
                }
            }
        });
    }
});