
Ext.define('YZSoft.bpm.form.Read', {
    extend: 'YZSoft.bpm.form.BPMFormBase',
    border: false,

    constructor: function (config) {
        var me = this;

        me.btnInform = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-e657',
            text: RS.$('All_Inform'),
            perm: 'Inform',
            handler: function (item) {
                me.inform();
            }
        });

        me.btnInviteIndicate = me.createButton(true, {
            text: RS.$('All_InviteIndicate'),
            glyph: 0xeb20,
            perm: 'InviteIndicate',
            handler: function (item) {
                me.inviteIndicate();
            }
        });

        me.btnRemind = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-e967',
            perm: 'Reminder',
            text: RS.$('All_Remind'),
            handler: function (item) {
                me.remind();
            }
        });

        me.menuTraceChart = me.createButton(false, {
            text: RS.$('All_ProcessChart'),
            glyph: 0xeae5,
            handler: function (item) {
                me.openTrace(0);
            }
        });

        me.menuTraceList = me.createButton(false, {
            text: RS.$('All_TraceTimeline'),
            glyph: 0xeb1e,
            handler: function (item) {
                me.openTrace(1);
            }
        });

        me.menuForecast = me.createButton(false, {
            text: RS.$('All_Forecast'),
            glyph: 0xea94,
            handler: function (item) {
                me.openTrace(2);
            }
        });

        me.btnTrace = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_TaskTrace'),
            glyph: 0xeb10,
            menu: { items: [me.menuTraceChart, me.menuTraceList, me.menuForecast] }
        });

        me.menuPickback = me.createButton(false, {
            iconCls: 'yz-glyph yz-glyph-e612',
            text: RS.$('All_Pickback'),
            perm: 'PickBackExt',
            handler: function () {
                me.pickback();
            }
        });

        me.menuAbort = me.createButton(false, {
            iconCls: 'yz-glyph yz-glyph-e606',
            text: RS.$('All_Abort'),
            perm: 'Abort',
            handler: function (item) {
                me.abort();
            }
        });

        me.menuDelete = me.createButton(false, {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            perm: 'Delete',
            handler: function (item) {
                me.deleteTask();
            }
        });

        me.menuContinue = me.createButton(false, {
            text: RS.$('All_ContinueTask'),
            glyph: 0xe997,
            perm: 'Continue',
            handler: function (item) {
                me.restore();
            }
        });

        me.menuPublic = me.createButton(false, {
            text: RS.$('All_Public'),
            glyph: 0xe918,
            perm: 'Public',
            handler: function (item) {
                me.public();
            }
        });

        me.btnMore = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e602',
            text: RS.$('All_MoreOpt'),
            menu: {
                items: [
                    me.menuPublic,
                    '-',
                    me.menuPickback,
                    me.menuAbort,
                    me.menuDelete,
                    me.menuContinue
                ]
            }
        });

        me.btnPrint = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e61f',
            text: RS.$('All_Print'),
            handler: function (item) {
                me.print();
            }
        });

        me.btnRefresh = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function (item) {
                me.refresh();
            }
        });

        me.summaryPanel = Ext.create('Ext.panel.Panel', {
            width: 200,
            region: 'east',
            border: false,
            title: RS.$('Form_Task_Summary'),
            hidden: true,
            header: false,
            split: {
                cls: 'yz-spliter',
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            cls: ['yz-tbar-module', 'yz-tbar-bpmform', 'yz-tbar-bpmform-loading'],
            items: [me.btnInform, me.btnInviteIndicate, '|', me.btnTrace, '|', me.btnMore, '->', me.btnRemind, me.btnPrint, '|', me.btnRefresh]
        });

        me.formPanel = Ext.create('YZSoft.src.panel.IFramePanel', {
            region: 'center',
            cls: 'yz-border-t',
            border: false,
            params: config.params,
            listeners: {
                yzafterrender: function () {
                    me.init(config);
                },
                close: function () {
                    me.close();
                }
            }
        });

        var cfg = {
            layout: 'border',
            tbar: me.toolbar,
            border: false,
            items: [me.formPanel, me.summaryPanel]
        };

        me.formCard = Ext.create('Ext.panel.Panel', cfg);

        cfg = {
            layout: 'card',
            border: false,
            items: [me.formCard]
        };
        Ext.apply(cfg, config);

        me.callParent([cfg]);
    },

    init: function (config) {
        var me = this;

        me.request({
            params: Ext.apply(Ext.clone(config.params), {
                method: 'GetTaskReadInfo'
            }),
            success: function (action) {
                var result = action.result;

                me.sn = result.sn;

                if (result.urlParams)
                    Ext.apply(me.formPanel.params, Ext.decode(result.urlParams));

                me.formPanel.load(result.url);
            },
            failure: function (action) {
                me.reportErrorInForm(action.result.errorMessage);
            }
        });
    },

    remind: function () {
        var me = this,
            dlg;

        dlg = Ext.create('YZSoft.bpm.taskoperation.RemindDlg', {
            autoShow: true,
            autoClose: false,
            taskid: me.params.tid,
            fn: function (targets, comments) {
                if (targets.length == 0)
                    return;

                dlg.hide();

                var params = me.onBeforeRequest({
                    Method: 'Remind'
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    jsonData: {
                        comments: comments,
                        targets: targets
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Remind_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        me.mask({
                            msg: Ext.String.format(RS.$('TaskOpt_Remind_Success'), action.result.UserNameList),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                me.fireEventExt('modified', 'Remind');
                                me.fireEventExt('afterRemind');
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Remind_Fail'), me.sn, action.result.errorMessage), function () {
                            dlg.show();
                        });
                    },
                    exception: function () {
                        dlg.show();
                    }
                });
            }
        });
    }
});