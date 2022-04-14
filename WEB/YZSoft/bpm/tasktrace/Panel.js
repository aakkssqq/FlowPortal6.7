/*
config
    TaskID
    backButton
    activeTabIndex
Events
    backClick
*/
Ext.define('YZSoft.bpm.tasktrace.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.Step',
        'YZSoft.bpm.src.ux.Render'
    ],
    layout: 'border',
    plain: true,
    modal: true,
    border: false,

    constructor: function (config) {
        var me = this,
            cfg;

        config.backButton = config.backButton === true;

        me.btnBack = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xe612,
            cls: 'yz-btn-flat',
            text: RS.$('All_Return_Form'),
            hidden: !config.backButton,
            handler: function (item) {
                me.fireEvent('backClick');
            }
        });

        me.tabBar = Ext.create('Ext.tab.Bar', {
        });

        me.cmpTaskStatus = Ext.create('Ext.Component', {
            style:'margin-right:10px;'
        });

        me.cmpTaskID = Ext.create('Ext.Component', {
            cls:'yz-cmp-tasktrace-titleitem'
        });

        me.cmpInitiator = Ext.create('Ext.Component', {
            cls: 'yz-cmp-tasktrace-titleitem'
        });

        me.cmpProcessVersion = Ext.create('Ext.Component', {
            cls: 'yz-cmp-tasktrace-titleitem'
        });

        var sp = {
            xtype: 'tbseparator',
            cls: 'yz-seprator-tasktrace-title'
        };

        me.titleBar = Ext.create('Ext.container.Container', {
            region: 'north',
            padding:'0 12 0 6',
            style: 'background-color:#eaeaea',
            layout: {
                type: 'hbox',
                align: 'center',
            },
            items: [me.btnBack, me.tabBar, { xtype: 'tbfill' }, me.cmpTaskStatus, me.cmpTaskID, sp, me.cmpInitiator, sp, me.cmpProcessVersion]
        });

        me.chartPanel = Ext.create('YZSoft.bpm.tasktrace.FlowChart', {
            title: RS.$('All_Trace_FlowChart'),
            TaskID: config.TaskID
        });

        me.currentStepsPanel = Ext.create('YZSoft.bpm.tasktrace.CurrentSteps', {
            TaskID: config.TaskID,
            hidden: true,
            margin: '0 0 0 0',
            padding: '0 20',
            style: 'background-color:#fff'
        });

        me.timelinePanel = Ext.create('YZSoft.bpm.tasktrace.Timeline', {
            TaskID: config.TaskID,
            flex: 1
        });

        me.forecastPanel = Ext.create('YZSoft.bpm.forecast.TaskPanel', {
            TaskID: config.TaskID,
            data: config.data
        });

        me.traceTab = Ext.create('YZSoft.src.tab.Panel', {
            region: 'center',
            tabBar: me.tabBar,
            activeTab: config.activeTabIndex,
            items: [me.chartPanel, {
                xtype: 'container',
                title: RS.$('All_TraceTimeline'),
                style:'background-color:#f5f5f5;',
                layout: {
                    type: 'vbox',
                    align:'stretch'
                },
                items:[
                    //me.currentStepsPanel,
                    me.timelinePanel
                ]
            }, me.forecastPanel]
        });

        cfg = {
            title: Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), config.TaskID),
            layout: 'border',
            items: [me.titleBar, me.traceTab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        //获得任务摘要信息
        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            params: {
                method: 'GetTaskSummaryInfo',
                TaskID: config.TaskID
            },
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
            success: function (response) {
                me.taskinfo = Ext.decode(response.responseText);

                if (me.taskinfo.TaskState.toLowerCase() == 'running') {
                    me.currentStepsPanel.show();
                    me.currentStepsPanel.store.load({
                        loadMask: {
                            msg: RS.$('All_Loading'),
                            target: me.currentStepsPanel
                        }
                    });
                }

                if (!me.taskinfo.success) {
                    me.labSummary.setText(me.taskinfo.errorMessage, false);
                }
                else {
                    var newTitle = Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), me.taskinfo.SerialNum);
                    me.setTitle(newTitle);

                    me.cmpTaskStatus.setHtml(me.renderTaskStateDisplayString(me.taskinfo.TaskState));
                    me.cmpTaskStatus.setUserCls('yz-cmp-trace-taskstatus yz-cmp-trace-taskstatus-' + me.taskinfo.TaskState.toLowerCase());
                    me.cmpTaskID.setHtml(Ext.String.format('TaskID: {0}', config.TaskID));
                    me.cmpInitiator.setHtml(me.renderTaskOwner(me.taskinfo));
                    me.cmpProcessVersion.setHtml(Ext.String.format('{0}: {1}', RS.$('All_Version'), me.taskinfo.ProcessVersion));
                }
            },
            failure: function (response) {
                me.labSummary.setText(response.responseText, false);
            }
        });

        me.chartPanel.on({
            single: true,
            afterRender: function () {
                this.openTask(config.TaskID, {
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: this
                    }
                })
            }
        });

        me.timelinePanel.on({
            single: true,
            afterRender: function () {
                this.store.load({
                    loadMask: {
                        msg: RS.$('All_Loading'),
                        target: this
                    }
                });
            }
        });

        me.forecastPanel.on({
            single: true,
            afterRender: function () {
                this.store.load({
                    loadMask: {
                        msg: RS.$('All_Forecast_LoadMask_FirstTime'),
                        target: this
                    }
                });
            }
        });
    },

    renderTaskStateDisplayString: function (state) {
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

    renderTaskOwner: function (task) {
        if (Ext.isEmpty(task.OwnerAccount))
            return RS.$('All_StartBySystem');

        var ownerHtml = Ext.util.Format.text(task.OwnerAccount || task.OwnerDisplayName),
            agentHtml = '';

        if (!Ext.isEmpty(task.AgentAccount) && !String.Equ(task.AgentAccount, task.OwnerAccount)) {
            agentHtml = Ext.String.format("[<span class=\"yz-agent-name\">{0}</span>]",Ext.String.format(RS.$('All_PostByAgent'), Ext.util.Format.text(task.AgentAccount || task.AgentDisplayName)));
        }

        return Ext.String.format('<span class="yz-s-uid" uid="{0}">{1}{2}</span>',
            task.OwnerAccount,
            ownerHtml,
            agentHtml);
    }
});
