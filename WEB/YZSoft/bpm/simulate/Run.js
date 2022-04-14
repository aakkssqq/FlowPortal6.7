
Ext.define('YZSoft.bpm.simulate.Run', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.Step',
        'YZSoft.bpm.src.model.Task',
        'YZSoft.bpm.src.ux.FormManager'
    ],
    header: false,
    stepdefer: 2000,

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOpenForm = Ext.create('YZSoft.src.button.Button', {
            glyph:0xeae7,
            text: RS.$('Simulate_OpenForm'),
            handler: function () {
                me.openFormRead({
                    data: {
                        TaskID: me.taskid,
                        ProcessName: me.processName
                    }
                });
            }
        });

        me.btnRun = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('Simulate_AutoRun'),
            cls: 'yz-size-icon-12',
            glyph: 0xea86,
            handler: function () {
                if (this.behavior == 'stop') {
                    me.pause();
                }
                else {
                    if (me.runStore.getCount() != 0) {
                        me.setRunMode('auto');
                        me.process(me.runStore.getAt(0));
                    }
                }
            }
        });

        me.btnStep = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('Simulate_RunStepByStep'),
            cls: 'yz-size-icon-12',
            glyph: 0xea2f,
            handler: function () {
                if (me.runStore.getCount() != 0) {
                    me.setRunMode('step');
                    me.process(me.runStore.getAt(0));
                }
            }
        });

        me.btnUpdateProcess = Ext.create('Ext.button.Button', {
            glyph:0xe997,
            text: RS.$('Simulate_RefreshProcess'),
            handler: function () {
                me.chartPanel.openTask(me.taskid, {
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me.chartPanel,
                        start: 0
                    }
                });
                me.runStore.reload({
                    loadMask: false
                });
            }
        });

        me.maxminbtn = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-e98b',
            tooltip: RS.$('All_Window_Maximize'),
            disabled: false,
            scope: me,
            handler: function () {
                if (me.yzmaximized) {
                    me.maxminbtn.setIconCls('yz-glyph yz-glyph-e98b');
                    me.maxminbtn.setTooltip(RS.$('All_Window_Maximize'));
                    me.yzrestore();
                }
                else {
                    me.maxminbtn.setIconCls('yz-glyph yz-glyph-e98c');
                    me.maxminbtn.setTooltip(RS.$('All_Window_Restore'));
                    me.yzmaximize();
                }
            }
        });

        me.chartPanel = Ext.create('YZSoft.bpm.simulate.FlowChart', {
            region: 'center',
            autoLoad: false,
            header: false,
            border: false
        });

        me.chartPanel.drawContainer.on({
            scope: me,
            spritemouseover: function (sprite, event, eOpts) {
                var step = me.getProcessingStep(me.chartPanel, sprite.sprite);
                if (step) {
                    var rec = me.runStore.getById(step.StepID);
                    if (rec)
                        me.runGrid.getSelectionModel().select(rec);
                }
            },
            spritedblclick: function (sprite, event, eOpts) {
                var step = me.getProcessingStep(me.chartPanel, sprite.sprite);
                if (step) {
                    var rec = me.runStore.getById(step.StepID);
                    if (rec)
                        me.openFormProcess(rec);
                }
            }
        });

        me.runStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.Step',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Simulate.ashx'),
                extraParams: {
                    method: 'GetTaskProcessingSteps',
                    TaskID: config.taskid
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                load: function () {
                    if (me.runStore.getCount() != 0) {
                        if (me.runMode == 'auto')
                            me.process(me.runStore.getAt(0), me.stepdefer);
                        if (me.runMode == 'step')
                            me.pause();
                    }
                }
            }
        });

        me.runGrid = Ext.create('Ext.grid.Panel', {
            region: 'south',
            cls: 'yz-border-t',
            height: 150,
            header: {
                title: RS.$('Simulate_RunResult'),
                cls: 'yz-header-flat'
            },
            header: false,
            store: me.runStore,
            selModel: { mode: 'SINGLE' },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: RS.$('All_StepID'), dataIndex: 'StepID', align: 'center', width: 120 },
                    { text: RS.$('All_StepName'), dataIndex: 'NodeDisplayName', align: 'center', width: 180 },
                    { text: RS.$('All_Handler'), dataIndex: 'OwnerAccount', width: 180, align: 'center', renderer: me.renderStepRecipient.bind(me) },
                    { text: RS.$('Simulate_Exception'), dataIndex: 'exception', flex: 1, align: 'left', scope: me, renderer: me.renderException, listeners: { scope: me, click: me.onClickException } }, {
                        xtype: 'actioncolumn',
                        text: RS.$('Simulate_Action_Manual'),
                        width: 80,
                        align: 'center',
                        items: [{
                            glyph: 0xeafa,
                            iconCls: 'yz-action-download',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.openFormProcess(record);
                            }
                        }]
                    }
                ]
            },
            viewConfig: {
                getRowClass: function () { return 'yz-task-row yz-task-row-running' }
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.openFormProcess(record);
                }
            }
        });

        me.resultStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.Task',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Simulate.ashx'),
                extraParams: {
                    method: 'LoadTask',
                    TaskID: config.taskid
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.resultGrid = Ext.create('Ext.grid.Panel', {
            region: 'south',
            cls: 'yz-border-t',
            height: 150,
            hidden: true,
            store: me.resultStore,
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: RS.$('All_SN'), dataIndex: 'SerialNum', width: 130, align: 'left', scope: me, renderer: me.renderSN, listeners: { scope: me, click: me.onClickSN } },
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 160, align: 'left', formatter: 'text' },
                    { text: RS.$('All_TaskDesc'), dataIndex: 'Description', align: 'left', flex: 1, cellWrap: true },
                    { text: RS.$('All_Owner'), dataIndex: 'OwnerAccount', width: 100, align: 'center', renderer: me.renderTaskOwner.bind(me) },
                    { text: RS.$('All_Status'), dataIndex: 'State', width: 160, align: 'center', tdCls: 'yz-cell-taskstatus', renderer: me.renderTaskState }, {
                        xtype: 'actioncolumn',
                        text: RS.$('Simulate_Trace'),
                        width: 80,
                        align: 'center',
                        items: [{
                            glyph: 0xeab6,
                            iconCls: 'yz-action-download',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.openTrace(record, 1);
                            }
                        }]
                    }
                ]
            },
            viewConfig: {
                getRowClass: function (record) {
                    return YZSoft.bpm.src.ux.Render.getRowClass(record);
                }
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.openFormRead(record);
                }
            }
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls: 'yz-tbar-module yz-border-b',
                items: [
                    me.btnOpenForm,
                    '|',
                    me.btnRun,
                    me.btnStep,
                    '->',
                    me.btnUpdateProcess,
                    '|',
                    me.maxminbtn
                ]
            },
            items: [me.chartPanel, me.runGrid, me.resultGrid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.setRunMode(config.runMode);

        me.chartPanel.openTask(config.taskid, {
            fn: function () {
                me.runStore.reload();
            }
        });
    },

    renderStepRecipient: function (value, metaData, record) {
        var step = record.data,
            agent = Ext.util.Format.text(step.AgentDisplayName || step.AgentAccount),
            owner = Ext.util.Format.text(step.OwnerDisplayName || step.OwnerAccount);

        if (Ext.isEmpty(step.RecipientAccount) && step.Share)
            return RS.$('All_SharePool');

        if (!Ext.isEmpty(step.AgentAccount) && !String.Equ(step.AgentAccount, step.OwnerAccount)) {
            return Ext.String.format('{0}<span class="yz-sp-delagatestep-owner">{1}</span>', agent, Ext.String.format(RS.$('All_DelegateInfo'),owner));
        }
        else {
            return owner;
        }
    },

    renderTaskOwner: function (value, metaData, record) {
        var task = record.data;

        return Ext.util.Format.text(task.OwnerDisplayName || task.OwnerAccount);
    },

    renderTaskState: function (value, metaData, record) {
        var state = value.State;

        if (state)
            state = state.toLowerCase();

        switch (state) {
            case 'running':
                return RS.$('All_Running');
            case 'approved':
                return RS.$('All_Approved');
            case 'rejected':
                return RS.$('All_Rejected');
            case 'aborted':
                return RS.$('All_Aborted');
            case 'deleted':
                return RS.$('All_Deleted');
            default:
                return RS.$('All_UnknownStatus');
        }
    },

    renderException: function (value, metaData, record) {
        if (!value)
            return Ext.String.format('<span class="yz-sp-delagatestep-running">{0}</span>', RS.$('All_Processing'));
        else
            return Ext.String.format('<span class="yz-sp-delagatestep-excpetion">{0}</span>', value);
    },

    renderSN: function (value, metaData, record) {
        return Ext.String.format("<a href='#'>{0}</a>", YZSoft.HttpUtility.htmlEncode(value));
    },

    onClickException: function (view, cell, recordIndex, cellIndex, e, record) {
        if (e.getTarget('.yz-sp-delagatestep-excpetion'))
            YZSoft.alert(record.data.exception);
    },

    onClickSN: function (view, cell, recordIndex, cellIndex, e, record) {
        if (e.getTarget().tagName == 'A')
            this.openFormRead(record);
    },

    openTrace: function (record, activeTabIndex) {
        var me = this,
            rec = record,
            taskid = rec.data.TaskID,
            view;

        view = YZSoft.ViewManager.addView(me, 'YZSoft.bpm.tasktrace.Panel', {
            id: 'BPM_TaskTrace_' + taskid,
            title: Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), rec.data.SerialNum),
            TaskID: taskid,
            activeTabIndex: activeTabIndex,
            closable: true
        });

        view.traceTab.setActiveTab(activeTabIndex);
    },

    openFormRead: function (record) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, me.SerialNum)
        });
    },

    openFormProcess: function (record) {
        var me = this;

        YZSoft.bpm.src.ux.FormManager.openTaskForProcess(record.data.StepID, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.NodeDisplayName, me.SerialNum),
            params: {
                stk: record.data.stk
            },
            listeners: {
                scope: me,
                modified: function (name, data) {
                    me.chartPanel.updateTaskInfo(me.taskid, { loadMask: false });
                    me.runStore.reload({
                        loadMask: false,
                        callback: function (records, operation, success) {
                            if (!records.length) {
                                me.resultStore.reload({
                                    loadMask: false,
                                    callback: function (records, operation, success) {
                                        me.runGrid.hide();
                                        me.resultGrid.show();
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },

    process: function (rec, defer) {
        var me = this,
            item = rec.data;

        defer = defer ? defer : 0;
        me.deferThread = Ext.defer(function () {
            delete me.deferThread;

            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Simulate.ashx'),
                params: {
                    method: 'Process',
                    StepID: item.StepID,
                    uid: (item.AgentAccount ? item.AgentAccount : item.OwnerAccount)
                },
                success: function (action) {
                    me.chartPanel.updateTaskInfo(item.TaskID);

                    if (action.result.result == 'finished') {
                        me.resultStore.reload({
                            loadMask: false,
                            callback: function (records, operation, success) {
                                me.runGrid.hide();
                                me.resultGrid.show();
                            }
                        });
                    }
                    else {
                        me.runStore.reload({ loadMask: false });
                    }
                },
                failure: function (action) {
                    me.chartPanel.updateTaskInfo(item.TaskID);

                    rec.set('exception', action.result.errorMessage);
                    rec.commit(false);
                    me.setRunMode('pause');
                }
            });
        }, defer);
    },

    pause: function () {
        var me = this;

        if (me.deferThread) {
            clearTimeout(me.deferThread);
            delete me.deferThread;
        }

        me.setRunMode('pause');
    },

    exitRun: function () {
        var me = this;

        if (me.deferThread) {
            clearTimeout(me.deferThread);
            delete me.deferThread;
        }

        me.setRunMode('stop');
        me.mainPanel.getLayout().setActiveItem(0);
    },

    setRunMode: function (mode) {
        this.runMode = mode;
        this.updateStatus();
    },

    getProcessingStep: function (chartPanel, sprite) {
        var steps = chartPanel.getAllInstanceOf(sprite, chartPanel.steps);
        if (steps.length != 0) {
            var lastStep = steps[steps.length - 1];
            if (!lastStep.Finished)
                return lastStep;
        }
    },

    updateStatus: function () {
        this.btnRun.setDisabled(this.runMode == 'step');
        this.btnStep.setDisabled(this.runMode == 'auto' || this.runMode == 'step');
        this.btnRun.behavior = this.runMode == 'auto' ? 'stop' : 'run';
        this.btnRun.setText(this.btnRun.behavior == 'stop' ? RS.$('Simulate_Pause') : RS.$('Simulate_AutoRun'));
        this.btnRun.setGlyph(this.btnRun.behavior == 'stop' ? 0xea85 : 0xea86);
    },

    destroy: function () {
        var me = this;

        if (me.deferThread) {
            clearTimeout(me.deferThread);
            delete me.deferThread;
        }

        me.callParent(arguments);
    }
});
