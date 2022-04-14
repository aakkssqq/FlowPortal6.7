/*
* specProcessName - process name
* collapseSearchPanel - true/false
*/

Ext.define('YZSoft.bpm.sharetask.Panel', {
    extend: 'YZSoft.bpm.src.panel.ShareTaskAbstract',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.bpm.src.model.Worklist',
        'YZSoft.bpm.src.ux.Render',
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
                    method: 'GetShareTasks'
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                beforeload: function () {
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
                { locked: false, text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', sortable: true, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN } },
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

        me.btnPickup = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_PickupShareTask'),
            glyph: 0xeb1c,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, null, 1, -1));
            },
            handler: function () {
                YZSoft.bpm.taskoperation.Manager.PickupShareTask(me.grid);
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
                me.btnPickup,
                me.btnTrace,
                '->',
                me.edtSearch
            ]
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
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openShareTask(record.data.StepID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum),
            listeners: {
                scope: me,
                modified: function (name, data) {
                    me.store.reload({ loadMask: false });
                }
            }
        });
    }
});
