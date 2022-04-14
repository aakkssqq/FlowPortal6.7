
Ext.define('YZSoft.bpm.src.panel.StepAbstract', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.ux.FormManager',
        'YZSoft.bpm.taskoperation.Manager'
    ],

    renderFlags: function (value, metaData, record) {
        var me = this,
            args = arguments,
            rv = [];

        Ext.Array.each([
            me.renderTimeoutFlag
        ], function (func) {
            rv.push(func.apply(me, args));
        });

        return rv.join('');
    },

    renderTimeoutFlag: function (value, metaData, record) {
        var now = new Date(),
            deadline = record.data.TimeoutDeadline,
            remindDate = record.getRemindDate();

        if (!deadline)
            return '';

        if (now >= deadline)
            return '<div class="yz-grid-cell-box-flag yz-s-timeout yz-color-warn yz-glyph yz-glyph-ea9d"></div>';
        else if (now >= remindDate)
            return '<div class="yz-grid-cell-box-flag yz-s-timeout yz-color-info yz-glyph yz-glyph-ea9d"></div>';
        else
            return '<div class="yz-grid-cell-box-flag yz-s-timeout yz-color-flag yz-glyph yz-glyph-ea9d"></div>';
    },

    renderProcessName: function (value, metaData, record) {
        return Ext.String.format('<div data-qtip="{1}">{0}</div >',
            Ext.util.Format.text(value),
            Ext.util.Format.text(record.data.NodeName)
        );
    },

    renderTimeout: function (value, metaData, record) {
        var now = new Date(),
            deadline = record.data.TimeoutDeadline,
            remindDate = record.getRemindDate(),
            fmtFunc = Ext.util.Format.toElapsedString,
            minutes;

        if (!deadline)
            return '';

        minutes = Math.floor(Ext.Date.getElapsed(deadline, now) / 1000 / 60);

        if (now >= deadline) {
            rv = Ext.String.format([
                '<span class="yz-timeout-desc yz-color-warn">',
                RS.$('All_Timeout_Timeout'),
                '</span>'].join(''),
                fmtFunc(minutes));
            return rv;
        }
        else if (now >= remindDate) {
            return Ext.String.format([
                '<span class="yz-timeout-desc yz-color-info">',
                RS.$('All_Timeout_Remind'),
                '</span>'].join(''),
                fmtFunc(minutes));
        }
        else {
            return Ext.String.format([
                '<span class="yz-timeout-desc yz-color-flag">',
                RS.$('All_Timeout_Normal'),
                '</span>'].join(''),
                fmtFunc(minutes));
        }
    },

    getRemindDate: function(step) {
        var deadline = step.TimeoutDeadline,
            remindDate = step.TimeoutFirstNotifyDate || (deadline ? Ext.Date.add(deadline, Ext.Date.HOUR, -1) : null);

        return remindDate;
    },

    initTimeoutFlagTip: function (grid) {
        var me = this,
            view = grid.getView();

        view.on({
            single: true,
            render: function () {
                me.tip1 = Ext.create('Ext.tip.ToolTip', {
                    target: view.el,
                    delegate: view.itemSelector + ' .yz-s-timeout',
                    cls: 'yz-nowrap',
                    renderTo: Ext.getBody(),
                    listeners: {
                        beforeshow: function (tip) {
                            return me.beforeshowTimeoutTip(view, tip);
                        }
                    }
                });

                me.tip2 = Ext.create('Ext.tip.ToolTip', {
                    target: view.el,
                    delegate: view.itemSelector + ' .yz-timeout-desc.yz-color-warn',
                    cls: 'yz-nowrap',
                    renderTo: Ext.getBody(),
                    listeners: {
                        beforeshow: function (tip) {
                            return me.beforeshowTimeoutTip(view, tip);
                        }
                    }
                });
            }
        });
    },

    beforeshowTimeoutTip: function(view, tip) {
        var me = this,
            now = new Date(),
            el = el = tip.triggerElement,
            rec = view.getRecord(el),
            index = el.getAttribute('index'),
            data = index ? rec.data.State.children[index] : rec.data,
            deadline = data.TimeoutDeadline,
            remindDate = me.getRemindDate(data),
            fmtFunc = Ext.util.Format.toElapsedString,
            minutes;

        if (!deadline)
            return false;

        tip.removeCls(['yz-color-warn', 'yz-color-info', 'yz-color-flag']);

        if (now >= deadline) {
            minutes = Math.floor(Ext.Date.getElapsed(deadline, now) / 1000 / 60);
            tip.addCls('yz-color-warn');
            tip.update(Ext.String.format(RS.$('All_Timeout_Tip_Timeout'), fmtFunc(minutes), deadline));
        }
        else if (now >= remindDate) {
            minutes = Math.floor(Ext.Date.getElapsed(now, deadline) / 1000 / 60);
            tip.addCls('yz-color-info');
            tip.update(Ext.String.format(RS.$('All_Timeout_Tip_Remind'), fmtFunc(minutes), deadline));
        }
        else {
            minutes = Math.floor(Ext.Date.getElapsed(now, deadline) / 1000 / 60);
            tip.addCls('yz-color-flag');
            tip.update(Ext.String.format(RS.$('All_Timeout_Tip_Normal'), fmtFunc(minutes), deadline));
        }
    },

    openForm: function (record, config) {
        YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, Ext.apply(config || {}, {
            sender: this,
            title: Ext.String.format('{0}-{1}', record.data.ProcessName, record.data.SerialNum)
        }));
    },

    openTrace: function (rec, activeTabIndex) {
        var me = this,
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

    openKM: function (rec) {
        var me = this;

        YZSoft.ViewManager.addView(me, 'YZSoft.bpm.km.sprite.StepPanel', {
            id: Ext.String.format('StepKM_{0}', rec.data.StepID),
            title: Ext.String.format('{0} - {1}', rec.data.ProcessName, rec.data.NodeName),
            stepid: rec.data.StepID,
            closable: true
        });
    },

    remind: function (rec) {
        var me = this,
            taskid = rec.data.TaskID,
            sn = rec.data.SerialNum || '',
            dlg;

        dlg = Ext.create('YZSoft.bpm.taskoperation.RemindDlg', {
            autoShow: true,
            autoClose: false,
            taskid: taskid,
            fn: function (targets, comments) {
                if (targets.length == 0)
                    return;

                dlg.hide();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'Remind'
                    },
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
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Remind_Fail'), sn, action.result.errorMessage), function () {
                            dlg.show();
                        });
                    },
                    exception: function () {
                        dlg.show();
                    }
                });
            }
        });
    },

    handover: function (recs,method) {
        var me = this,
            items = [],
            params;

        recs = Ext.Array.from(recs);

        if (recs.length == 0)
            return;

        params = {
            Method: method || 'HandoverSteps',
            uid: me.uid
        };

        for (var i = 0; i < recs.length; i++) {
            items.push({
                ID: i,
                StepID: recs[i].data.StepID
            });
        };

        YZSoft.bpm.taskoperation.Manager.Handover(me.grid, params, items);
    }
});