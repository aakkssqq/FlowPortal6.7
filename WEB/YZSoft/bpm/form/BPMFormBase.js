
Ext.define('YZSoft.bpm.form.BPMFormBase', {
    extend: 'YZSoft.bpm.form.Base',
    requires: [
        'YZSoft.core.MessageClient',
        'YZSoft.ViewManager'
    ],

    constructor: function () {
        var me = this;

        me.callParent(arguments);

        me.on({
            modified: function () {
                delete me.chart;
            }
        });
    },

    openTrace: function (activeTabIndex, data) {
        var me = this,
            taskid = me.params.tid,
            tab = YZSoft.ViewManager.getModuleTab(me),
            sn = me.params.sn;

        if (tab) {
            var view = YZSoft.ViewManager.addView(me, 'YZSoft.bpm.tasktrace.Panel', {
                id: 'BPM_TaskTrace_' + taskid,
                title: Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), sn),
                TaskID: taskid,
                data: data,
                activeTabIndex: activeTabIndex,
                closable: true
            }, function (view) {
                view.forecastPanel.setFormData(data);
                view.traceTab.setActiveTab(activeTabIndex);
            });
        }
        else {
            if (!me.chart) {
                me.chart = Ext.create('YZSoft.bpm.tasktrace.Panel', {
                    header: false,
                    title: Ext.String.format('{0} - {1}', RS.$('All_TaskTrace'), sn),
                    TaskID: taskid,
                    data: data,
                    activeTabIndex: activeTabIndex,
                    backButton: true,
                    listeners: {
                        backClick: function () {
                            me.chart.hide();
                            me.setActiveItem(me.formCard);
                        }
                    }
                });
                me.add(me.chart);
            }
            else {
                me.chart.forecastPanel.setFormData(data);
                me.chart.traceTab.setActiveTab(activeTabIndex);
            }

            me.setActiveItem(me.chart);
        }
    },

    openFlowChart: function (data, activeTabIndex) {
        var me = this,
            pn = me.params.pn,
            tab = YZSoft.ViewManager.getModuleTab(me),
            ver = me.params.version;

        if (tab) {
            YZSoft.ViewManager.addView(me, 'YZSoft.bpm.process.Panel', {
                id: 'BPM_FlowChart_' + YZSoft.util.hex.encode(pn),
                title: Ext.String.format('{0} - {1}', RS.$('All_ProcessChart'), pn),
                processName: pn,
                processVersion: ver,
                data: data,
                activeTabIndex: activeTabIndex,
                closable: true
            }, function (view) {
                view.forecastPanel.setFormData(data);
                view.traceTab.setActiveTab(activeTabIndex);
            });
        }
        else {
            if (!me.processChart) {
                me.processChart = Ext.create('YZSoft.bpm.process.Panel', {
                    header: false,
                    processName: pn,
                    processVersion: ver,
                    data: data,
                    activeTabIndex: activeTabIndex,
                    backButton: true,
                    listeners: {
                        backClick: function () {
                            me.processChart.hide();
                            me.setActiveItem(me.formCard);
                        }
                    }
                });
                me.add(me.processChart);
            }
            else {
                me.processChart.forecastPanel.setFormData(data);
                me.processChart.traceTab.setActiveTab(activeTabIndex);
            }

            me.setActiveItem(me.processChart);
        }
    },

    createPositionCombobox: function (positions, value, delegation) {
        var me = this;

        var store = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'value'],
            data: positions
        });

        me.cmbInitiatorPosition = Ext.create('Ext.form.field.ComboBox', {
            //fieldLabel: RS.$('Form_PostPosition'),
            flex: 1,
            minWidth: 160,
            maxWidth: 260,
            queryMode: 'local',
            store: store,
            displayField: 'name',
            valueField: 'value',
            //disabled: delegation,
            value: value,
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            listeners: {
                change: function (combo, newValue, oldValue, eOpts) {
                    me.fireEvent('positionChange', newValue);
                }
            }
        });

        return me.cmbInitiatorPosition;
    },

    getComments: function () {
        var me = this,
            value = me.commentsPanel.getValue();

        return value.Comments;
    },

    getConsignInfo: function () {
        var me = this,
            value = me.commentsPanel.getValue();

        return Ext.copyTo({}, value, ['ConsignEnabled', 'ConsignUsers', 'ConsignRoutingType', 'ConsignReturnType']);
    },

    getInviteIndicateInfo: function () {
        var me = this,
            value = me.commentsPanel.getValue();

        return Ext.copyTo({}, value, ['InviteIndicateUsers']);
    },

    getRoutingInfo: function () {
        var me = this,
            value = me.commentsPanel.getValue();

        return value.Routing;
    },

    checkComments: function () {
        return this.commentsPanel.check();
    },

    encodeHeader: function (header) {
        if (header.ConsignUsers)
            header.ConsignUsers = Ext.encode(header.ConsignUsers);

        if (header.InviteIndicateUsers)
            header.InviteIndicateUsers = Ext.encode(header.InviteIndicateUsers);

        if (header.Context)
            header.Context = Ext.encode(header.Context);

        if (header.UrlParams)
            header.UrlParams = Ext.encode(header.UrlParams);
    },

    getOwnerFullName: function () {
        return this.cmbInitiatorPosition ? this.cmbInitiatorPosition.getValue() : null;
    },

    getPostResultMessage: function (rv) {
        var ar;

        ar = [];
        for (var i = 0; i < rv.Accounts.length; i++)
            ar.push(rv.Accounts[i].DisplayName);
        var toUserList = ar.join(';');

        ar = [];
        for (var i = 0; i < rv.Indicators.length; i++)
            ar.push(rv.Indicators[i].Account);

        var indicateMessage = ar.length != 0 ? ('\n' + Ext.String.format(RS.$('Form_Result_Indicator'), ar.join(';'))) : '';

        var customMessage = rv.CustomMessage ? ('\n[' + rv.CustomMessage + ']') : '';

        var msg = '';
        switch (rv.PostResult) {
            case 'HasSentToOtherUsers':
                msg = Ext.String.format(RS.$('Form_SendToOthUsers'), rv.SN, toUserList, indicateMessage, customMessage);
                break;
            case 'InWaitingOtherUsers':
                msg = Ext.String.format(RS.$('Form_WaitingOthUsers'), rv.SN, toUserList, indicateMessage, customMessage);
                break;
            case 'TaskInWaiting':
                msg = Ext.String.format(RS.$('Form_TaskInWaiting'), rv.SN, indicateMessage, customMessage);
                break;
            case 'TaskFinishedApproved':
                msg = Ext.String.format(RS.$('Form_TaskFinishedApproved'), rv.SN, customMessage);
                break;
            case 'TaskFinishedRejected':
                msg = Ext.String.format(RS.$('Form_TaskFinishedRejected'), rv.SN, customMessage);
                break;
        }
        return msg;
    },

    getPostForecastData: function (fn) {
        var me = this;

        var data = {
            Header: {
                Method: 'PostForecast',
                ProcessName: me.params.pn,
                delagationPost: me.params.owner ? true : false,
                PID: me.params.pid,
                OwnerMemberFullName: me.getOwnerFullName(),
                Comment: me.getComments()
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'saveAsDraft',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                if (fn)
                    fn(data);
            }
        });
    },

    saveAsDraft: function (btn) {
        var me = this,
            persistParams = me.PersistParams || [],
            data;

        data = {
            Header: {
                Method: 'SaveAsDraft',
                ProcessName: me.params.pn,
                OwnerMemberFullName: me.getOwnerFullName(),
                Comment: me.getComments(),
                UrlParams: Ext.copyTo({}, me.params, persistParams)
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'saveAsDraft',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: {
                        msg: RS.$('Form_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (rv) {
                        me.mask({
                            msg: RS.$('Form_SaveAsDraft_Success'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                btn.draftid = me.params.did = rv.SN;
                                btn.setText(RS.$('All_SaveDraft'));
                            }
                        });

                        me.fireFormEvent({
                            event: 'afterSaveAsDraft',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSaveAsDraft', rv);
                                me.fireEventExt('afterSaveDraft', 'SaveAsDraft', rv);
                                me.fireEventExt('afterSave', 'SaveAsDraft', rv);
                                me.fireEventExt('modified', 'SaveAsDraft', rv);
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    saveDraft: function (draftid) {
        var me = this,
            persistParams = me.PersistParams || [],
            data,cfg;

        data = {
            Header: {
                Method: 'SaveDraft',
                ProcessName: me.params.pn,
                DraftGuid: draftid,
                OwnerMemberFullName: me.getOwnerFullName(),
                Comment: me.getComments(),
                UrlParams: Ext.copyTo({}, me.params, persistParams)
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'saveDraft',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                cfg = {
                    waitMsg: {
                        msg: RS.$('Form_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (rv) {
                        me.mask({
                            msg: RS.$('Form_SaveDraft_Success'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                            }
                        });

                        me.fireFormEvent({
                            event: 'afterSaveDraft',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSaveDraft', 'SaveDraft', rv);
                                me.fireEventExt('afterSave', 'SaveDraft', rv);
                                me.fireEventExt('modified', 'SaveDraft', rv);
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    saveAsFormTemplate: function (btn) {
        var me = this,
            persistParams = me.PersistParams || [];

        var data = {
            Header: {
                Method: 'SaveAsFormTemplate',
                ProcessName: me.params.pn,
                OwnerMemberFullName: me.getOwnerFullName(),
                Comment: me.getComments(),
                UrlParams: Ext.copyTo({}, me.params, persistParams)
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'saveAsFormTemplate',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: {
                        msg: RS.$('Form_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (rv) {
                        me.mask({
                            msg: RS.$('Form_SaveAsFormTemplate_Success'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                btn.setText(RS.$('All_SaveFormTemplate'));
                                btn.draftid = rv.SN;
                            }
                        });

                        me.fireFormEvent({
                            event: 'afterSaveAsFormTemplate',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSaveAsFormTemplate', rv);
                                me.fireEventExt('afterSaveDraft', 'SaveAsFormTemplate', rv);
                                me.fireEventExt('afterSave', 'SaveAsFormTemplate', rv);
                                me.fireEventExt('modified', 'SaveAsFormTemplate', rv);
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    saveFormTemplate: function (draftid) {
        var me = this,
            persistParams = me.PersistParams || [];

        var data = {
            Header: {
                Method: 'SaveDraft',
                ProcessName: me.params.pn,
                DraftGuid: draftid,
                OwnerMemberFullName: me.getOwnerFullName(),
                Comment: me.getComments(),
                UrlParams: Ext.copyTo({}, me.params, persistParams)
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'saveDraft',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: {
                        msg: RS.$('Form_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (rv) {
                        me.mask({
                            msg: RS.$('All_SaveFormTemplate_Success'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                            }
                        });

                        me.fireFormEvent({
                            event: 'afterSaveDraft',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSaveFormTemplate', rv);
                                me.fireEventExt('afterSaveDraft', 'SaveFormTemplate', rv);
                                me.fireEventExt('afterSave', 'SaveFormTemplate', rv);
                                me.fireEventExt('modified', 'SaveFormTemplate', rv);
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    saveAsTestingTemplate: function (btn) {
        var me = this,
            persistParams = me.PersistParams || [];

        var data = {
            Header: {
                Method: 'SaveAsTestingTemplate',
                ProcessName: me.params.pn,
                Comment: me.getComments(),
                UrlParams: Ext.copyTo({}, me.params, persistParams)
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'saveAsTestingTemplate',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: {
                        msg: RS.$('Form_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (rv) {
                        me.mask({
                            msg: RS.$('All_SaveAsSimulateFormInstante_Success'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                btn.draftid = rv.SN;
                                btn.setText(RS.$('All_SaveTestingFormInstance'));
                            }
                        });

                        me.fireFormEvent({
                            event: 'afterSaveAsTestingTemplate',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSaveAsTestingTemplate', rv);
                                me.fireEventExt('afterSaveDraft', 'SaveAsTestingTemplate', rv);
                                me.fireEventExt('afterSave', 'SaveAsTestingTemplate', rv);
                                me.fireEventExt('modified', 'SaveAsTestingTemplate', rv);
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    saveTestingTemplate: function (draftid) {
        var me = this,
            persistParams = me.PersistParams || [];

        var data = {
            Header: {
                Method: 'SaveDraft',
                ProcessName: me.params.pn,
                DraftGuid: draftid,
                Comment: me.getComments(),
                UrlParams: Ext.copyTo({}, me.params, persistParams)
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'saveDraft',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: {
                        msg: RS.$('Form_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (rv) {
                        me.mask({
                            msg: RS.$('All_SaveSimulateFormInstante_Success'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                            }
                        });

                        me.fireFormEvent({
                            event: 'afterSaveDraft',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSaveTestingTemplate', rv);
                                me.fireEventExt('afterSaveDraft', 'SaveTestingTemplate', rv);
                                me.fireEventExt('afterSave', 'SaveTestingTemplate', rv);
                                me.fireEventExt('modified', 'SaveTestingTemplate', rv);
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    save: function (config) {
        var me = this;

        config = config || {};
        var data = {
            Header: {
                Method: 'Save',
                PID: me.params.pid,
                Comment: me.getComments()
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'save',
            params: Ext.apply({
                data: data
            }, config.params),
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: {
                        msg: RS.$('Form_Saving'),
                        target: me,
                        start: 0
                    },
                    success: function (rv) {
                        me.mask({
                            msg: RS.$('All_Save_Succeed'),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                if (config.success)
                                    config.success.call(config.scope || config, rv);
                            }
                        });

                        me.fireFormEvent({
                            event: 'afterSave',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSave', 'Save', rv);
                                me.fireEventExt('modified', 'Save', rv);

                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    inform: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.taskoperation.InformDlg', {
            autoShow: true,
            autoClose: false,
            fn: function (users, comments) {
                if (users.length == 0)
                    return;

                dlg.hide();

                var params = me.onBeforeRequest({
                    Method: 'Inform',
                    uid: me.uid,
                    TaskID: me.params.tid
                });

                var uids = [];
                Ext.each(users, function (user) {
                    uids.push(user.Account);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    jsonData: {
                        comments: comments,
                        uids: uids
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Inform_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        me.mask({
                            msg: Ext.String.format(RS.$('TaskOpt_Inform_Success'), action.result.UserNameList),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                me.fireEventExt('modified', 'Inform');
                                me.fireEventExt('afterInform');
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Inform_Fail'), me.sn, action.result.errorMessage), function () {
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

    inviteIndicate: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.taskoperation.InviteIndicateDlg', {
            autoShow: true,
            autoClose: false,
            fn: function (users, comments) {
                if (users.length == 0)
                    return;

                dlg.hide();

                var params = me.onBeforeRequest({
                    Method: 'InviteIndicate',
                    uid: me.uid,
                    TaskID: me.params.tid
                });

                var uids = [];
                Ext.each(users, function (user) {
                    uids.push(user.Account);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    jsonData: {
                        comments: comments,
                        uids: uids
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_InviteIndicate_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        me.mask({
                            msg: Ext.String.format(RS.$('TaskOpt_InviteIndicate_Success'), action.result.UserNameList),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                me.fireEventExt('modified', 'InviteIndicate');
                                me.fireEventExt('afterInviteIndicate');
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_InviteIndicate_Fail'), me.sn, action.result.errorMessage), function () {
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

    getSaveData: function (config) {
        var me = this;

        config = config || {};
        var data = {
            Header: {
                Method: 'Save',
                PID: me.params.pid,
                Comment: me.getComments()
            }
        };

        //加签信息
        Ext.apply(data.Header, me.getConsignInfo());

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        //路由信息
        Ext.apply(data.Header, {
            Context: {
                Routing: me.getRoutingInfo()
            }
        });

        me.callFormApi({
            method: 'save',
            params: Ext.apply({
                data: data
            }, config.params),
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                if (config.success)
                    config.success.call(config.scope || config, data);
            }
        });
    },

    reject: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            autoClose: false,
            title: RS.$('TaskOpt_Reject_ConfirmTitle'),
            info: RS.$('TaskOpt_Reject_Prompt_Desc'),
            label: RS.$('TaskOpt_Reject_Comments'),
            validateEmpty: true,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                dlg.hide();

                me.getSaveData({
                    success: function (formdata) {
                        var params = me.onBeforeRequest({
                            Method: 'Reject',
                            uid: me.uid,
                            TaskID: me.params.tid,
                            StepID: me.params.pid
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                            params: params,
                            jsonData: {
                               comments: text,
                               formdata: YZSoft.util.xml.encode('XForm', formdata)
                            },
                            waitMsg: {
                                msg: RS.$('TaskOpt_Reject_LoadMask'),
                                target: me,
                                start: 0
                            },
                            success: function (action) {
                                Ext.destroy(dlg);

                                YZSoft.alert(Ext.String.format(RS.$('Form_Reject_Success'), me.sn), function () {
                                    me.fireEventExt('modified', 'Reject');
                                    me.fireEventExt('afterReject');
                                    me.close('ok');
                                });
                            },
                            failure: function (action) {
                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Reject_Fail'), me.sn, action.result.errorMessage), function () {
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
    },

    recedeRestart: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            autoClose: false,
            title: RS.$('All_ReturnToIniaiator'),
            info: RS.$('TaskOpt_ReturnToInitiator_Prompt_Desc'),
            label: RS.$('TaskOpt_ReturnToInitiator_Comments'),
            validateEmpty: true,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                dlg.hide();

                me.getSaveData({
                    success: function (formdata) {
                        var params = me.onBeforeRequest({
                            Method: 'ReturnToInitiator',
                            uid: me.uid,
                            TaskID: me.params.tid,
                            StepID: me.params.pid
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                            params: params,
                            jsonData: {
                                comments: text,
                                formdata: YZSoft.util.xml.encode('XForm', formdata)
                            },
                            waitMsg: {
                                msg: RS.$('TaskOpt_ReturnToInitiator_LoadMask'),
                                target: me,
                                start: 0
                            },
                            success: function (action) {
                                Ext.destroy(dlg);

                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_ReturnToInitiator_Success'), me.sn, action.result.UserFriendlyName), function () {
                                    me.fireEventExt('modified', 'RecedeRestart');
                                    me.fireEventExt('afterRecedeRestart');
                                    me.close('ok');
                                });
                            },
                            failure: function (action) {
                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_ReturnToInitiator_Fail'), me.sn, action.result.errorMessage), function () {
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
    },

    jump: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.taskoperation.JumpDlg', {
            autoShow: true,
            autoClose: false,
            taskid: me.params.tid,
            fn: function (fromSteps, tagNode, comments) {
                if (fromSteps.length == 0 || Ext.isEmpty(tagNode))
                    return;

                dlg.hide();

                me.getSaveData({
                    success: function (formdata) {

                        var params = me.onBeforeRequest({
                            Method: 'Jump',
                            uid: me.uid,
                            TaskID: me.params.tid,
                            StepID: me.params.pid,
                            ToStepName: tagNode.NodeName
                        });

                        var fromStepIDs = [];
                        Ext.each(fromSteps, function (fromStep) {
                            fromStepIDs.push(fromStep.StepID);
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                            params: params,
                            jsonData: {
                                comments: comments,
                                formdata: YZSoft.util.xml.encode('XForm', formdata),
                                fromStepIDs: fromStepIDs
                            },
                            waitMsg: {
                                msg: RS.$('TaskOpt_Jump_LoadMask'),
                                target: me,
                                start: 0
                            },
                            success: function (action) {
                                Ext.destroy(dlg);

                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Jump_Success'), me.sn, action.result.StepName, action.result.UserFriendlyName, RS.$('All_WindowWillBeClose')), function () {
                                    me.fireEventExt('modified', 'Jump');
                                    me.fireEventExt('afterJump');
                                    me.close('ok');
                                });
                            },
                            failure: function (action) {
                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Jump_Fail'), me.sn, action.result.errorMessage), function () {
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
    },

    abort: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            autoClose: false,
            title: RS.$('TaskOpt_Abort_ConfirmTitle'),
            info: RS.$('TaskOpt_Abort_Prompt_Desc'),
            label: RS.$('TaskOpt_Abort_Comments'),
            validateEmpty: true,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                dlg.hide();

                var params = me.onBeforeRequest({
                    Method: 'Abort',
                    uid: me.uid,
                    TaskID: me.params.tid,
                    Comments: text
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    waitMsg: {
                        msg: RS.$('TaskOpt_Abort_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Abort_Success'), me.sn), function () {
                            me.fireEventExt('modified', 'Abort');
                            me.fireEventExt('afterAbort');
                            me.close('ok');
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Abort_Fail'), me.sn, action.result.errorMessage), function () {
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

    deleteTask: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            autoClose: false,
            title: RS.$('All_DeleteConfirm_Title'),
            info: RS.$('TaskOpt_Delete_Prompt_Desc'),
            label: RS.$('TaskOpt_Delete_Comments'),
            validateEmpty: true,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                dlg.hide();

                var params = me.onBeforeRequest({
                    Method: 'Delete',
                    uid: me.uid,
                    TaskID: me.params.tid,
                    Comments: text
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    waitMsg: {
                        msg: RS.$('TaskOpt_Delete_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Delete_Success'), me.sn), function () {
                            me.fireEventExt('modified', 'Delete');
                            me.fireEventExt('afterDelete');
                            me.close('ok');
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Delete_Fail'), me.sn, action.result.errorMessage), function () {
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

    pickback: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.taskoperation.PickbackDlg', {
            autoShow: true,
            autoClose: false,
            taskid: me.params.tid,
            fn: function (step, text) {
                dlg.hide();

                var params = me.onBeforeRequest({
                    Method: 'Pickback',
                    TaskID: me.params.tid,
                    StepID: step.StepID,
                    Comments: text
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    waitMsg: {
                        msg: RS.$('TaskOpt_Pickback_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        Ext.destroy(dlg);

                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Pickback_Success'), me.sn, action.result.StepName, action.result.UserFriendlyName), function () {
                            me.fireEventExt('modified', 'Pickback');
                            me.fireEventExt('afterPickback');
                            me.close('ok');
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Pickback_Fail'), me.sn, action.result.errorMessage), function () {
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

    public: function () {
        var me = this;

        YZSoft.SelUsersDlg.show({
            fn: function (users) {
                if (users.length == 0)
                    return;

                var uids = [];
                Ext.each(users, function (user) {
                    uids.push(user.Account);
                });

                var params = me.onBeforeRequest({
                    Method: 'Public',
                    uid: me.uid,
                    TaskID: me.params.tid
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    jsonData: {
                        comments: '',
                        uids: uids
                    },
                    waitMsg: {
                        msg: RS.$('All_Publicing'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.mask({
                            msg: Ext.String.format(RS.$('TaskOpt_Public_Success'), action.result.UserNameList),
                            msgCls: 'yz-mask-msg-success',
                            autoClose: 'xx',
                            fn: function () {
                                me.fireEventExt('afterPublic');
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Public_Fail'), me.sn, action.result.errorMessage));
                    }
                });
            }
        });
    },

    restore: function () {
        var me = this;

        var params = me.onBeforeRequest({
            Method: 'Restore',
            TaskID: me.params.tid
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
            params: params,
            waitMsg: {
                msg: RS.$('TaskOpt_Continue_LoadMask'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('TaskOpt_Continue_Success'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: 'xx',
                    fn: function () {
                        me.fireEventExt('modified', 'Restore');
                        me.fireEventExt('afterRestore');
                    }
                });
            },
            failure: function (action) {
                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Continue_Fail'), me.sn, action.result.errorMessage), function () {
                });
            },
            exception: function () {
            }
        });
    }
});