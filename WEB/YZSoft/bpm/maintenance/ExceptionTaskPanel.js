
Ext.define('YZSoft.bpm.maintenance.ExceptionTaskPanel', {
    extend: 'YZSoft.bpm.src.panel.WorklistAbstract',
    requires: [
        'YZSoft.bpm.src.model.Worklist',
        'YZSoft.bpm.taskoperation.Manager',
        'YZSoft.bpm.src.ux.FormManager'
    ],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            pageSize: $S.pageSize.defaultSize,
            model: 'YZSoft.bpm.src.model.Worklist',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetExceptionTaskList'
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
                { text: RS.$('All_ExceptionStep'), dataIndex: 'NodeName', width: 100, align: 'center', sortable: true, formatter: 'text' },
                { text: RS.$('All_StepException_Type'), dataIndex: 'Recipient', width: 100, align: 'center', sortable: false, renderer: me.renderExceptionType.bind(me) },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('All_ActionTip_SetParticipant'),
                    width: 100,
                    align: 'center',
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    disabledCls: 'yz-visibility-hidden',
                    items: [{
                        glyph: 0xeae1,
                        iconCls: 'yz-size-icon-13 yz-action-hot',
                        handler: function (grid, rowIndex, colIndex, item, e, record) {
                            var sm = me.grid.getSelectionModel();

                            sm.select(record);
                            me.assignOwner();
                        }
                    }]
                }
            ],
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

        me.btnAssignOwner = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_AssignOwner'),
            glyph: 0xeae1,
            perm: 'AssignOwner',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, 1));
            },
            handler: me.assignOwner.bind(me)
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
            glyph:0xeb10,
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
                me.btnAssignOwner,
                me.btnTrace,
                '->',
                me.btnSearch
            ]
        });

        me.sts = Ext.create('YZSoft.src.sts', {
            tbar: me.toolBar,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            getId: function (rec) {
                return rec.data.TaskID;
            },
            request: {
                params: {
                    Method: 'GetTaskPermision'
                }
            }
        });

        var cfg = {
            closable: true,
            border: false,
            layout: 'border',
            items: [me.searchPanel, me.grid],
            tbar: me.toolBar
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.initTimeoutFlagTip(me.grid);
    },

    renderFlags: function (value, metaData, record) {
        return Ext.String.format('<div class="yz-grid-cell-box-flag yz-color-warn yz-glyph yz-glyph-ea93" data-qtip="{0}"></div>', RS.$('All_ExceptionTask'));
    },

    renderProcessName: function(value, metaData, record) {
        return Ext.util.Format.text(value)
    },

    renderExceptionType: function (value){
        return '<span class="yz-color-warn">' + RS.$('All_StepExceptionType_NoRecipient') + '</span>';
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    openForm: function (record) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        });
    },

    assignOwner: function () {
        var me = this,
            sm = me.grid.getSelectionModel(),
            recs = sm.getSelection() || [],
            rec = recs[0];

        if (!rec)
            return;

        YZSoft.bpm.taskoperation.Manager.AssignOwner(me.grid, {
            dlgConfig: {
                stepsConfig: {
                    value: [rec.data]
                }
            }
        });
    }
});
