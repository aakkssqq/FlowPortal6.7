
Ext.define('YZSoft.bpm.form.Process', {
    extend: 'YZSoft.bpm.form.BPMFormBase',
    border: false,

    constructor: function (config) {
        var me = this,
            collapseCommentsPanel = config.collapseCommentsPanel === undefined ? $S.form.collapseCommentsPanel : config.collapseCommentsPanel;

        me.btnReject = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-reject',
            text: RS.$('All_Reject'),
            perm: 'Reject',
            handler: function (item) {
                me.reject();
            }
        });

        me.btnRecedeRestart = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-e612',
            text: RS.$('All_ReturnToIniaiator'),
            perm: 'RecedeRestart',
            handler: function (item) {
                me.recedeRestart();
            }
        });

        me.btnSave = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_Save'),
            handler: function (item) {
                me.save();
            }
        });

        me.btnShare = me.createButton(true, {
            text: RS.$('All_PutbackShare'),
            glyph: 0xeb1d,
            hidden: true,
            handler: function (item) {
                me.putbackShareTask();
            }
        });

        me.menuTraceChart = me.createButton(false, {
            text: RS.$('All_ProcessChart'),
            glyph: 0xeae5,
            handler: function (item) {
                me.getPostForecastData(function (data) {
                    me.openTrace(0, data);
                });
            }
        });

        me.menuTraceList = me.createButton(false, {
            text: RS.$('All_TraceTimeline'),
            glyph: 0xeb1e,
            handler: function (item) {
                me.getPostForecastData(function (data) {
                    me.openTrace(1, data);
                });
            }
        });

        me.menuForecast = me.createButton(false, {
            text: RS.$('All_Forecast'),
            glyph: 0xea94,
            handler: function (item) {
                me.getPostForecastData(function (data) {
                    me.openTrace(2, data);
                });
            }
        });

        me.btnTrace = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_TaskTrace'),
            glyph: 0xeb10,
            menu: { items: [me.menuTraceChart, me.menuTraceList, me.menuForecast] }
        });

        me.menuRecedeBack = me.createButton(false, {
            iconCls: 'yz-glyph yz-glyph-ea40',
            text: RS.$('All_RecedeBack'),
            perm: 'RecedeBack',
            handler: function () {
                me.recedeBack();
            }
        });

        me.menuTransfer = me.createButton(false, {
            iconCls: 'yz-glyph yz-glyph-e60e',
            text: RS.$('All_Transfer'),
            perm: 'Transfer',
            handler: function () {
                me.transfer();
            }
        });

        me.menuInform = me.createButton(false, {
            iconCls: 'yz-glyph yz-glyph-e657',
            text: RS.$('All_Inform'),
            perm: 'Inform',
            handler: function (item) {
                me.inform();
            }
        });

        me.menuInviteIndicate = me.createButton(false, {
            text: RS.$('All_InviteIndicate'),
            glyph: 0xeb20,
            perm: 'InviteIndicate',
            handler: function (item) {
                me.inviteIndicate();
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

        me.menuJump = me.createButton(false, {
            text: RS.$('All_Jump'),
            glyph: 0xeb1f,
            perm: 'Jump',
            handler: function () {
                me.jump();
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

        me.commentsPanel = Ext.create('YZSoft.bpm.form.Comments', {
            hidden: collapseCommentsPanel !== false,
            region: 'north'
        });

        me.btnComments = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_ExpandComments'),
            expandPanel: me.commentsPanel
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            cls: ['yz-tbar-module', 'yz-tbar-bpmform', 'yz-tbar-bpmform-loading'],
            items: []
        });

        me.formPanel = Ext.create('YZSoft.src.panel.IFramePanel', {
            region: 'center',
            cls:'yz-border-t',
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

        var cfg = {
            layout: 'border',
            tbar: me.toolbar,
            border: false,
            items: [me.commentsPanel, me.formPanel, me.summaryPanel]
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

    createPostButton: function (link) {
        var me = this;
        return me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-e627',
            text: link.DisplayString,
            link: link,
            handler: function () {
                me.post(this.link);
            }
        });
    },

    createDirectSendButton: function (directsend) {
        var me = this,
            tagItems = [],
            tipItems = [];

        Ext.each(directsend.toSteps, function (step) {
            tagItems.push(Ext.String.format(RS.$('All_DirectSendItemFmt'), step.NodeName, step.User));
            tipItems.push(Ext.String.format(RS.$('All_DirectSendTipItemFmt'), step.NodeName, step.User));
        });

        return me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-e627',
            text: Ext.String.ellipsis(Ext.String.format('{0}->{1}', RS.$('All_DirectSend'), tagItems.join(';')), 26),
            tooltip: Ext.String.format('<span class="yz-directsend-tip-title">{0}</span><br/>{1}', RS.$('All_DirectSendTipTitle'), tipItems.join('<br/>')),
            handler: function () {
                me.directSend(directsend);
            }
        });
    },

    init: function (config) {
        var me = this;

        me.request({
            async: false,
            params: Ext.apply(Ext.clone(config.params), {
                method: 'GetProcessInfo'
            }),
            success: function (action) {
                var result = action.result,
                    nodePerms = result.NodePermisions || {};

                me.sn = result.sn;
                me.uid = result.uid;

                if (result.urlParams)
                    Ext.apply(me.params, Ext.decode(result.urlParams));

                me.params.tid = result.taskid;
                if (result.subModel == 'Share')
                    me.params.share = 1;

                me.formPanel.load(action.result.url);

                var btns = me.actionButtons = [];

                me.commentsPanel.edtComments.setValue(result.Comments);

                if (result.subModel == 'Process') {

                    if (result.directsend && result.directsend.toSteps.length != 0) {
                        me.btnDirectSend = me.createDirectSendButton(result.directsend);
                        btns.push(me.btnDirectSend);
                    }

                    Ext.each(result.links, function (link) {
                        btns.push(me.createPostButton(link));
                    });

                    if (result.shareTask)
                        me.btnShare.show();

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
                                me.menuTransfer,
                                me.menuJump,
                                '-',
                                me.menuAbort,
                                me.menuDelete
                            ]
                        }
                    });

                    btns = Ext.Array.push(btns, [
                        '|',
                        me.btnReject,
                        me.btnRecedeRestart,
                        '|',
                        me.btnSave,
                        me.btnShare,
                        '|',
                        me.btnTrace,
                        me.btnMore,
                        '->',
                        me.btnRefresh,
                        '|',
                        me.btnPrint,
                        '|',
                        me.btnComments
                    ]);

                    me.commentsPanel.btnInviteIndicate.setDisabled(!nodePerms.InviteIndicate);
                    me.commentsPanel.btnConsign.setDisabled(!nodePerms.Consign);

                    var declare = result.ParticipantDeclares || [];
                    me.commentsPanel.setParticipantDeclares(declare, result.Routing);
                    if (declare.length != 0) {
                        me.commentsPanel.show();
                    }
                }
                else if (result.subModel == 'Inform') {

                    me.btnInformSubmit = Ext.create('Ext.button.Button', {
                        iconCls: 'yz-glyph yz-glyph-e615',
                        text: RS.$('All_InformSubmit'),
                        handler: function () {
                            me.informSubmit();
                        }
                    });

                    me.btnMore = Ext.create('Ext.button.Button', {
                        iconCls: 'yz-glyph yz-glyph-e602',
                        text: RS.$('All_MoreOpt'),
                        menu: {
                            items: [
                                me.menuTraceChart,
                                me.menuTraceList,
                                me.menuForecast,
                                '-',
                                me.menuInform,
                                me.menuPublic
                            ]
                        }
                    });

                    me.menuInform.setDisabled(false);

                    btns = [
                        me.btnInformSubmit,
                        '|',
                        me.btnMore,
                        '->',
                        me.btnRefresh,
                        '|',
                        me.btnPrint,
                        '|',
                        me.btnComments
                    ];

                    me.commentsPanel.btnInviteIndicate.setVisible(false);
                    me.commentsPanel.btnConsign.setVisible(false);
                }
                else if (result.subModel == 'Indicate') {
                    me.btnIndicateSubmit = Ext.create('Ext.button.Button', {
                        iconCls: 'yz-glyph yz-glyph-e615',
                        text: RS.$('All_InformSubmit'),
                        handler: function () {
                            me.indicateSubmit();
                        }
                    });

                    me.btnMore = Ext.create('Ext.button.Button', {
                        iconCls: 'yz-glyph yz-glyph-e602',
                        text: RS.$('All_MoreOpt'),
                        menu: {
                            items: [
                                me.menuTraceChart,
                                me.menuTraceList,
                                me.menuForecast,
                                '-',
                                me.menuInform,
                                me.menuInviteIndicate,
                                me.menuPublic
                            ]
                        }
                    });

                    me.menuInform.setDisabled(false);
                    me.menuInviteIndicate.setDisabled(false);

                    btns = [
                        me.btnIndicateSubmit,
                        '|',
                        me.btnMore,
                        '->',
                        me.btnRefresh,
                        '|',
                        me.btnPrint,
                        '|',
                        me.btnComments
                    ];

                    me.commentsPanel.btnInviteIndicate.setDisabled(!nodePerms.InviteIndicate);
                    me.commentsPanel.btnConsign.setVisible(false);
                }
                else if (result.subModel == 'Share') {
                    me.btnPickup = Ext.create('Ext.button.Button', {
                        text: RS.$('All_PickupShareTask'),
                        glyph: 0xeb1c,
                        handler: function () {
                            me.pickupShareTask();
                        }
                    });

                    btns = [
                        me.btnPickup,
                        '|',
                        me.btnTrace,
                        '->',
                        me.btnRefresh,
                        '|',
                        me.btnPrint
                    ];
                }
                else {
                    btns = [
                        me.btnRefresh,
                        '|',
                        me.btnPrint
                    ];
                }

                me.toolbar.removeAll(false);
                me.toolbar.add(btns);

            },
            failure: function (action) {
                me.reportErrorInForm(action.result.errorMessage);
            }
        });
    },

    recedeBack: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.taskoperation.RecedeBackDlg', {
            autoShow: true,
            autoClose: false,
            stepid: me.params.pid,
            fn: function (steps, comments) {
                if (steps.length == 0)
                    return;

                dlg.hide();

                me.getSaveData({
                    success: function (formdata) {
                        var params = me.onBeforeRequest({
                            Method: 'RecedeBack',
                            uid: me.uid,
                            StepID: me.params.pid
                        });

                        var toStepIDs = [];
                        Ext.each(steps, function (step) {
                            toStepIDs.push(step.StepID);
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                            params: params,
                            jsonData: {
                                comments: comments,
                                formdata: YZSoft.util.xml.encode('XForm', formdata),
                                toStepIDs: toStepIDs
                            },
                            waitMsg: {
                                msg: RS.$('TaskOpt_RecedeBack_LoadMask'),
                                target: me,
                                start: 0
                            },
                            success: function (action) {
                                Ext.destroy(dlg);

                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_RecedeBack_Success'), me.sn, action.result.tosteps, RS.$('All_WindowWillBeClose')), function () {
                                    me.fireEventExt('modified', 'RecedeBack');
                                    me.fireEventExt('afterRecedeBack');
                                    me.close('ok');
                                });
                            },
                            failure: function (action) {
                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_RecedeBack_Fail'), me.sn, action.result.errorMessage), function () {
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

    transfer: function () {
        var me = this;

        var dlg = Ext.create('YZSoft.bpm.taskoperation.TransferDlg', {
            autoShow: true,
            autoClose: false,
            fn: function (user, comments) {
                if (!user)
                    return;

                dlg.hide();

                me.getSaveData({
                    success: function (formdata) {
                        var params = me.onBeforeRequest({
                            Method: 'Transfer',
                            uid: me.uid,
                            StepID: me.params.pid,
                            MemberFullName: user.MemberFullName
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                            params: params,
                            jsonData: {
                                comments: comments,
                                formdata: YZSoft.util.xml.encode('XForm', formdata)
                            },
                            waitMsg: {
                                msg: RS.$('TaskOpt_Transfer_LoadMask'),
                                target: me,
                                start: 0
                            },
                            success: function (action) {
                                Ext.destroy(dlg);

                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Transfer_Success'), me.sn, action.result.UserFriendlyName), function () {
                                    me.fireEventExt('modified', 'Transfer');
                                    me.fireEventExt('afterTransfer');
                                    me.close('ok');
                                });
                            },
                            failure: function (action) {
                                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_Transfer_Fail'), me.sn, action.result.errorMessage), function () {
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

    pickupShareTask: function () {
        var me = this;

        var params = me.onBeforeRequest({
            Method: 'PickupShareTask',
            uid: me.uid,
            StepID: me.params.pid
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
            params: params,
            waitMsg: {
                msg: RS.$('TaskOpt_PickupShareTask_LoadMask'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.fireEventExt('afterPickupShareTask');
                me.fireEventExt('modified', 'PickupShareTask');
                delete me.params.share;
                me.params.pid = action.result.stepid;
                me.init(me);
            },
            failure: function (action) {
                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_PickupShareTask_Fail'), me.sn, action.result.errorMessage));
            }
        });
    },

    putbackShareTask: function () {
        var me = this;

        var params = me.onBeforeRequest({
            Method: 'PutbackShareTask',
            uid: me.uid,
            StepID: me.params.pid
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
            params: params,
            waitMsg: {
                msg: RS.$('TaskOpt_PutbackShareTask_LoadMask'),
                target: me,
                start: 0
            },
            success: function (action) {
                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_PutbackShareTask_Success'), me.sn), function () {
                    me.fireEventExt('modified', 'PutbackShareTask');
                    me.fireEventExt('afterPutbackShareTask');
                    me.close();
                });
            },
            failure: function (action) {
                YZSoft.alert(Ext.String.format(RS.$('TaskOpt_PutbackShareTask_Fail'), sn, action.result.errorMessage));
            }
        });
    },

    post: function (link, ignorePrompt) {
        var me = this;

        var data = {
            Header: {
                Method: 'Process',
                PID: me.params.pid,
                Action: link.DisplayString,
                Comment: me.getComments()
            }
        };

        var err = me.checkComments();
        if (err) {
            YZSoft.alert(err);
            return;
        }

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
            method: 'process',
            params: {
                action: link.DisplayString,
                validationGroup: link.ValidationGroup,
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: { msg: RS.$('All_Submiting'), target: me },
                    success: function (rv) {
                        me.fireFormEvent({
                            event: 'afterProcess',
                            params: rv,
                            success: function () {
                                var msg = me.getPostResultMessage(rv);
                                Ext.Msg.show({
                                    title: RS.$('Form_PostSuccess_Title'),
                                    msg: RS.$1(msg),
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.INFO,
                                    fn: function () {
                                        me.fireEventExt('afterProcess', rv);
                                        me.fireEventExt('afterSubmit', 'Process', rv);
                                        me.fireEventExt('modified', 'Process', rv);
                                        me.fireEventExt('submit', 'Process', rv);
                                        me.close();
                                    }
                                });
                            }
                        });
                    }
                };

                if (ignorePrompt !== true) {
                    me.postConfirm(link, function () {
                        me.ajaxPost(data, cfg);
                    });
                }
                else {
                    me.ajaxPost(data, cfg);
                }
            }
        });
    },

    informSubmit: function () {
        var me = this;

        var data = {
            Header: {
                Method: 'InformSubmit',
                PID: me.params.pid,
                Comment: me.getComments()
            }
        };

        me.callFormApi({
            method: 'informSubmit',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: { msg: RS.$('All_Submiting'), target: me },
                    success: function (rv) {
                        me.fireFormEvent({
                            event: 'afterInformSubmit',
                            params: rv,
                            success: function () {
                                var msg = me.getPostResultMessage(rv);
                                Ext.Msg.show({
                                    title: RS.$('Form_PostSuccess_Title'),
                                    msg: RS.$1(msg),
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.INFO,
                                    fn: function () {
                                        me.fireEventExt('afterInformSubmit', rv);
                                        me.fireEventExt('afterSubmit', 'InformSubmit', rv);
                                        me.fireEventExt('modified', 'InformSubmit', rv);
                                        me.close();
                                    }
                                });
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    indicateSubmit: function () {
        var me = this;

        var data = {
            Header: {
                Method: 'IndicateSubmit',
                PID: me.params.pid,
                Comment: me.getComments()
            }
        };

        //阅示信息
        Ext.apply(data.Header, me.getInviteIndicateInfo());

        me.callFormApi({
            method: 'indicateSubmit',
            params: {
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var cfg = {
                    waitMsg: { msg: RS.$('All_Submiting'), target: me },
                    success: function (rv) {
                        me.fireFormEvent({
                            event: 'afterIndicateSubmit',
                            params: rv,
                            success: function () {
                                var msg = me.getPostResultMessage(rv);
                                Ext.Msg.show({
                                    title: RS.$('Form_PostSuccess_Title'),
                                    msg: RS.$1(msg),
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.INFO,
                                    fn: function () {
                                        me.fireEventExt('afterIndicateSubmit', rv);
                                        me.fireEventExt('afterSubmit', 'IndicateSubmit', rv);
                                        me.fireEventExt('modified', 'IndicateSubmit', rv);
                                        me.close();
                                    }
                                });
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    },

    directSend: function (link) {
        var me = this;

        var data = {
            Header: {
                Method: 'Save',
                PID: me.params.pid,
                Comment: me.getComments()
            }
        };

        me.callFormApi({
            method: 'directSend',
            params: {
                validationGroup: link.ValidationGroup,
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);
                me.encodeHeader(data.Header);

                var params = me.onBeforeRequest({
                    Method: 'DirectSend',
                    StepID: me.params.pid,
                    SaveFormData: true
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    xmlData: YZSoft.util.xml.encode('XForm', data),
                    waitMsg: { msg: RS.$('All_Submiting'), target: me },
                    success: function (action) {
                        var rv = action.result;
                        me.fireFormEvent({
                            event: 'afterDirectSend',
                            params: rv,
                            success: function () {
                                var msg = Ext.String.formatText(RS.$('All_DirectSend_Success'), me.sn, rv.tosteps);
                                Ext.Msg.show({
                                    title: RS.$('Form_PostSuccess_Title'),
                                    msg: msg,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.INFO,
                                    fn: function () {
                                        me.fireEventExt('modified', 'DirectSend', rv);
                                        me.fireEventExt('afterDirectSend', rv);
                                        me.close();
                                    }
                                });
                            }
                        });
                    },
                    failure: function (action) {
                        YZSoft.alert(Ext.String.format(RS.$('All_DirectSend_Fail'), me.sn, action.result.errorMessage));
                    }
                });
            }
        });
    }
});