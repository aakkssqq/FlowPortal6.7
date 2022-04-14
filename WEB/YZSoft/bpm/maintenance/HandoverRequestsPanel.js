/*
* uid
* collapseSearchPanel - true/false
*/

Ext.define('YZSoft.bpm.maintenance.HandoverRequestsPanel', {
    extend: 'YZSoft.bpm.src.panel.TaskAbstract',
    title: RS.$('All_RunningRequests'),
    requires: [
        'YZSoft.bpm.src.model.Task'
    ],
    config: {
        uid: null
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: 100,
            model: 'YZSoft.bpm.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetHandoverRequests',
                    uid: config.uid
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function () {
                },
                load: function (store, records, successful, operation, eOpts) {
                    if (successful)
                        me.setTitle(Ext.String.format('{0}({1})', RS.$('All_RunningRequests'), store.getTotalCount()));
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
            viewConfig: {
                getRowClass: function(record) {
                    return me.getRowClass(record);
                }
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlags.bind(me) },
                    { text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', scope: this, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN } },
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 130, align: 'left', renderer: me.renderProcessName.bind(me) },
                    { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', flex: 1, cellWrap: true },
                    { text: RS.$('All_Version'), hidden: true, dataIndex: 'ProcessVersion', width: 80, align: 'center' },
                    { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', renderer: me.renderTaskOwner.bind(me) },
                    { text: RS.$('All_PostAt'), dataIndex: 'CreateAt', width: 130, align: 'center', formatter: 'friendlyDate' },
                    { text: RS.$('All_Status'), dataIndex: 'State', width: 220, align: 'center', tdCls: 'yz-cell-taskstatus', renderer: me.renderTaskState.bind(me) },
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
                                me.handover(record,'HandoverRequests');
                            }
                        }]
                    }
                ]
            },
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store,
                displayInfo: true
            }),
            listeners: {
                itemdblclick: function(grid, record, item, index, e, eOpts) {
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

                me.handover(recs,'HandoverRequests');
            }
        });

        me.btnAbort = Ext.create('YZSoft.src.button.Button', {
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

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
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
                sm = me.grid.getSelectionModel();
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
                sm = me.grid.getSelectionModel();
                recs = sm.getSelection() || [];

                if (recs.length != 1)
                    return;

                me.openTrace(recs[0], 2);
            }
        });

        me.btnTrace = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_TaskTrace'),
            glyph:0xeb10,
            menu: { items: [me.menuTraceChart, me.menuTraceList, me.menuForecast] },
            store: me.store,
            sm: me.grid.getSelectionModel(),
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
                me.btnAbort,
                me.btnDelete,
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
                    Method: 'GetTaskPermision'
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

    renderSN: function (value, metaData, record) {
        return Ext.String.format("<a href='#'>{0}</a>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onClickSN: function (view, cell, recordIndex, cellIndex, e) {
        if (e.getTarget().tagName == 'A')
            this.openForm(this.store.getAt(recordIndex));
    },

    openForm: function (record) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        });
    },

    openTrace: function (record, activeTabIndex) {
        var me = this,
            rec = record,
            taskid = rec.data.TaskID;

        var view = YZSoft.ViewManager.addView(me, 'YZSoft.bpm.tasktrace.Panel', {
            id: 'BPM_TaskTrace_' + taskid,
            title: Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), rec.data.SerialNum),
            TaskID: taskid,
            activeTabIndex: activeTabIndex,
            closable: true
        });

        view.traceTab.setActiveTab(activeTabIndex);
    },

    updateUid: function (uid) {
        var me = this,
            store = me.store;

        me.store.getProxy().getExtraParams().uid = uid;
        me.store.loadPage(1);
    }
});
