
Ext.define('YZSoft.bpm.taskoperation.Manager', {
    singleton: true,
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],

    BatchApprove: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                StepID: rec.data.StepID
            });
        });

        Ext.Msg.show({
            title: RS.$('TaskOpt_BatchApprove_ConfirmTitle'),
            msg: RS.$('TaskOpt_BatchApprove_ConfirmMsg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'ok',
            icon: Ext.Msg.INFO,
            fn: function (btn) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'BatchApprove'
                    },
                    jsonData: {
                        items:items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_BatchApprove_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore(),
                            msg = '';

                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += item.SerialNum + ' : ' + item.Result;
                        });

                        return msg;
                    },
                    success: function (action) {
                        var msg = this.getSuccessMessage(action.result.processedItems),
                            mbox, store;
                        
                        mbox = Ext.Msg.show({
                            title: RS.$('All_Operation_Success_Title'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO,
                            fn: function (btn, text) {
                            }
                        });

                        store = grid.getStore();
                        store.reload({ mbox: mbox });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_BatchApprove_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING,
                            fn: function (btn, text) {
                            }
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    Reject: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                StepID: rec.data.StepID || -1,
                TaskID: rec.data.TaskID
            });
        });

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            title: RS.$('TaskOpt_Reject_ConfirmTitle'),
            info: RS.$('TaskOpt_Reject_Prompt_Desc'),
            label: RS.$('TaskOpt_Reject_Comments'),
            validateEmpty: true,
            fn: function (btn, comments) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'RejectExt'
                    },
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Reject_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore(),
                            msg = '';

                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.format(RS.$('TaskOpt_Reject_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_Reject_SuccessMsg'), action.result.processedItems.length),
                                start: 0,
                                stay:'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Reject_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    ReturnToInitiator: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                StepID: rec.data.StepID || -1,
                TaskID: rec.data.TaskID
            });
        });

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            title: RS.$('All_ReturnToIniaiator'),
            info: RS.$('TaskOpt_ReturnToInitiator_Prompt_Desc'),
            label: RS.$('TaskOpt_ReturnToInitiator_Comments'),
            validateEmpty: true,
            fn: function (btn, comments) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'ReturnToInitiatorExt'
                    },
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_ReturnToInitiator_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore(),
                            msg = '';

                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.format(RS.$('TaskOpt_ReturnToInitiator_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_ReturnToInitiator_SuccessMsg'), action.result.processedItems.length),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_ReturnToInitiator_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    Transfer: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                StepID: rec.data.StepID
            });
        });

        var dlg = Ext.create('YZSoft.bpm.taskoperation.TransferDlg', {
            autoShow: true,
            fn: function (user, comments) {
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'TransferExt',
                        MemberFullName: user.MemberFullName
                    },
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Transfer_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.formatText(RS.$('TaskOpt_Transfer_ItemSuccess'), store.getById(item.ID).data.SerialNum, YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName));
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.formatText(RS.$('TaskOpt_Transfer_SuccessMsg'), action.result.processedItems.length, YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)),
                                start: 0,
                                //msgCls: 'yz-mask-msg-success', //此处用于测试
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Transfer_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    PickupShareTask: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                StepID: rec.data.StepID
            });
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
            params: {
                Method: 'PickupShareTaskExt'
            },
            jsonData: {
                items: items
            },
            waitMsg: {
                msg: RS.$('TaskOpt_PickupShareTask_LoadMask'),
                target: grid
            },
            getSuccessMessage: function (items) {
                var store = grid.getStore();
                var msg = '';
                Ext.each(items, function (item) {
                    if (!Ext.isEmpty(msg))
                        msg += '<br/>';

                    msg += Ext.String.format(RS.$('TaskOpt_PickupShareTask_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                });

                return msg;
            },
            success: function (action) {
                grid.getStore().reload({
                    loadMask: {
                        msg: Ext.String.format(RS.$('TaskOpt_PickupShareTasks_Success'), action.result.processedItems.length),
                        start: 0,
                        stay: 'taskoptquick'
                    }
                });
            },
            failure: function (action) {
                var processedItems = action.result.processedItems || [],
                    msg = this.getSuccessMessage(processedItems),
                    rec = recs[processedItems.length],
                    sn = rec.data.SerialNum,
                    failItem = Ext.String.formatHtml(RS.$('TaskOpt_PickupShareTask_ItemFail'), sn, action.result.errorMessage);

                if (!Ext.isEmpty(msg))
                    msg += '<br/>';

                msg += failItem;

                var mbox = Ext.Msg.show({
                    title: RS.$('All_MsgTitle_Error'),
                    msg: msg,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });

                if (processedItems.length != 0) {
                    var store = grid.getStore();
                    store.reload({ mbox: mbox });
                }
            }
        });
    },

    PutbackShareTask: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                StepID: rec.data.StepID
            });
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
            params: {
                Method: 'PutbackShareTaskExt'
            },
            jsonData: {
                items: items
            },
            waitMsg: {
                msg: RS.$('TaskOpt_PutbackShareTask_LoadMask'),
                target: grid
            },
            getSuccessMessage: function (items) {
                var store = grid.getStore();
                var msg = '';
                Ext.each(items, function (item) {
                    if (!Ext.isEmpty(msg))
                        msg += '<br/>';

                    msg += Ext.String.format(RS.$('TaskOpt_PutbackShareTask_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                });

                return msg;
            },
            success: function (action) {
                grid.getStore().reload({
                    loadMask: {
                        msg: Ext.String.format(RS.$('TaskOpt_PutbackShareTasks_Success'), action.result.processedItems.length),
                        start: 0,
                        stay: 'taskoptquick'
                    }
                });
            },
            failure: function (action) {
                var processedItems = action.result.processedItems || [],
                    msg = this.getSuccessMessage(processedItems),
                    rec = recs[processedItems.length],
                    sn = rec.data.SerialNum,
                    failItem = Ext.String.formatHtml(RS.$('TaskOpt_PutbackShareTask_ItemFail'), sn, action.result.errorMessage);

                if (!Ext.isEmpty(msg))
                    msg += '<br/>';

                msg += failItem;

                var mbox = Ext.Msg.show({
                    title: RS.$('All_MsgTitle_Error'),
                    msg: msg,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.WARNING
                });

                if (processedItems.length != 0) {
                    var store = grid.getStore();
                    store.reload({ mbox: mbox });
                }
            }
        });
    },

    Inform: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                TaskID: rec.data.TaskID
            });
        });

        var dlg = Ext.create('YZSoft.bpm.taskoperation.InformDlg', {
            autoShow: true,
            fn: function (users, comments) {
                if (users.length == 0)
                    return;

                var accounts = [],
                    dspNames = [];

                Ext.each(users, function (user) {
                    accounts.push(user.Account);
                    dspNames.push(YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)));
                });

                var userDisplayString = dspNames.toString();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'InformExt'
                    },
                    jsonData: {
                        comments: comments,
                        items: items,
                        accounts: accounts
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Inform_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.formatText(RS.$('TaskOpt_Inform_ItemSuccess'), store.getById(item.ID).data.SerialNum, userDisplayString);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.formatText(RS.$('TaskOpt_Inform_SuccessMsg'), action.result.processedItems.length, userDisplayString),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Inform_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    InviteIndicate: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                TaskID: rec.data.TaskID
            });
        });

        var dlg = Ext.create('YZSoft.bpm.taskoperation.InviteIndicateDlg', {
            autoShow: true,
            fn: function (users, comments) {
                if (users.length == 0)
                    return;

                var accounts = [],
                    dspNames = [];

                Ext.each(users, function (user) {
                    accounts.push(user.Account);
                    dspNames.push(YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)));
                });

                var userDisplayString = dspNames.toString();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'InviteIndicateExt'
                    },
                    jsonData: {
                        comments: comments,
                        items: items,
                        accounts: accounts
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_InviteIndicate_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.formatText(RS.$('TaskOpt_InviteIndicate_ItemSuccess'), store.getById(item.ID).data.SerialNum, userDisplayString);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.formatText(RS.$('TaskOpt_InviteIndicate_SuccessMsg'), action.result.processedItems.length, userDisplayString),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_InviteIndicate_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    Public: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                TaskID: rec.data.TaskID
            });
        });

        YZSoft.SelUsersDlg.show({
            fn: function (users) {
                if (users.length == 0)
                    return;

                var accounts = [],
                    dspNames = [];

                Ext.each(users, function (user) {
                    accounts.push(user.Account);
                    dspNames.push(YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)));
                });

                var userDisplayString = dspNames.toString();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'PublicExt'
                    },
                    jsonData: {
                        items: items,
                        accounts: accounts
                    },
                    waitMsg: {
                        msg: RS.$('All_Publicing'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.formatText(RS.$('All_Public_ItemSuccess'), store.getById(item.ID).data.SerialNum, userDisplayString);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.formatText(RS.$('TaskOpt_Public_SuccessMsg'), action.result.processedItems.length, userDisplayString),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('All_Public_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
                    }
                });
            }
        });
    },

    RecedeBack: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length != 1)
            return;

        var rec = recs[0];
        var dlg = Ext.create('YZSoft.bpm.taskoperation.RecedeBackDlg', {
            autoShow: true,
            stepid: rec.data.StepID,
            fn: function (steps, comments) {
                if (steps.length == 0)
                    return;

                var toStepIDs = [];
                Ext.each(steps, function (step) {
                    toStepIDs.push(step.StepID);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'RecedeBack',
                        StepID: rec.data.StepID
                    },
                    jsonData: {
                        comments: comments,
                        toStepIDs: toStepIDs
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_RecedeBack_LoadMask'),
                        target: grid
                    },
                    success: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Operation_Success_Title'),
                            msg: Ext.String.formatText(RS.$('TaskOpt_RecedeBack_Success'), rec.data.SerialNum, action.result.tosteps, ''),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                        grid.getStore().reload({ mbox: mbox });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: Ext.String.formatHtml(RS.$('TaskOpt_RecedeBack_Fail'), rec.data.SerialNum, action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING,
                            fn: function (btn, text) {
                            }
                        });
                    }
                });
            }
        });
    },

    Jump: function (grid) {
        var sm = grid.getSelectionModel();
        var recs = sm.getSelection() || [];

        if (recs.length != 1)
            return;

        var rec = recs[0];
        var dlg = Ext.create('YZSoft.bpm.taskoperation.JumpDlg', {
            autoShow: true,
            title: Ext.String.format(RS.$('TaskOpt_Jump_Title'), rec.data.SerialNum),
            taskid: rec.data.TaskID,
            fn: function (fromSteps, tagNode, comments) {
                if (fromSteps.length == 0 || Ext.isEmpty(tagNode))
                    return;

                var fromStepIDs = [];
                Ext.each(fromSteps, function (fromStep) {
                    fromStepIDs.push(fromStep.StepID);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'Jump',
                        StepID: rec.data.StepID,
                        TaskID: rec.data.TaskID,
                        ToStepName: tagNode.NodeName
                    },
                    jsonData: {
                        comments: comments,
                        fromStepIDs: fromStepIDs
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Jump_LoadMask'),
                        target: grid
                    },
                    success: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Operation_Success_Title'),
                            msg: Ext.String.formatText(RS.$('TaskOpt_Jump_Success'), rec.data.SerialNum, action.result.StepName, action.result.UserFriendlyName, ''),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                        grid.getStore().reload({ mbox: mbox });
                    },
                    failure: function (action) {
                        Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: Ext.String.formatHtml(RS.$('TaskOpt_Jump_Fail'), rec.data.SerialNum, action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
                    }
                });
            }
        });
    },

    Abort: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                TaskID: rec.data.TaskID
            });
        });

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            title: RS.$('TaskOpt_Abort_ConfirmTitle'),
            info: RS.$('TaskOpt_Abort_Prompt_Desc'),
            label: RS.$('TaskOpt_Abort_Comments'),
            validateEmpty: true,
            fn: function (btn, comments) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'AboutExt'
                    },
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Abort_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.format(RS.$('TaskOpt_Abort_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_Abort_SuccessMsg'), action.result.processedItems.length),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Abort_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    Delete: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var items = [];
        Ext.each(recs, function (rec) {
            items.push({
                ID: rec.id,
                TaskID: rec.data.TaskID
            });
        });

        var dlg = Ext.create('YZSoft.bpm.src.dialogs.ConfirmDlg', {
            autoShow: true,
            title: RS.$('All_DeleteConfirm_Title'),
            info: RS.$('TaskOpt_Delete_Prompt_Desc'),
            label: RS.$('TaskOpt_Delete_Comments'),
            validateEmpty: true,
            fn: function (btn, comments) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'DeleteExt'
                    },
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Delete_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.format(RS.$('TaskOpt_Delete_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_Delete_SuccessMsg'), action.result.processedItems.length),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Delete_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    Pickback: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var rec = recs[0];
        var dlg = Ext.create('YZSoft.bpm.taskoperation.PickbackDlg', {
            autoShow: true,
            taskid: rec.data.TaskID,
            fn: function (step, comments) {
                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'Pickback',
                        TaskID: rec.data.TaskID,
                        StepID: step.StepID,
                        Comments: comments
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Pickback_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.format(RS.$('TaskOpt_Pickback_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_Pickback_SuccessMsg'), recs.length),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: Ext.String.formatHtml(RS.$('TaskOpt_Pickback_Fail'), rec.data.SerialNum, action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
                    }
                });
            }
        });
    },

    Restore: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        Ext.Msg.show({
            msg: RS.$('All_Msg_RestoreConfirm'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'ok',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                var items = [];
                Ext.each(recs, function (rec) {
                    items.push({
                        ID: rec.id,
                        TaskID: rec.data.TaskID
                    });
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'RestoreExt'
                    },
                    jsonData: {
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Continue_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.format(RS.$('TaskOpt_Continue_ItemSuccess'), store.getById(item.ID).data.SerialNum);
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('TaskOpt_Continue_SuccessMsg'), action.result.processedItems.length),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Continue_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    ReActive: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var rec = recs[0];
        var dlg = Ext.create('YZSoft.bpm.taskoperation.ReActiveDlg', {
            autoShow: true,
            taskid: rec.data.TaskID,
            fn: function (steps, comments) {

                var toStepIDs = [];
                Ext.each(steps, function (step) {
                    toStepIDs.push(step.StepID);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'ReActive',
                        TaskID: rec.data.TaskID
                    },
                    jsonData: {
                        comments: comments,
                        toStepIDs: toStepIDs
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_ReActive_LoadMask'),
                        target: grid
                    },
                    success: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Operation_Success_Title'),
                            msg: Ext.String.formatText(RS.$('TaskOpt_ReActive_SuccessMsg'), rec.data.SerialNum, action.result.tosteps),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });

                        var store = grid.getStore();
                        store.reload({ mbox: mbox });

                    },
                    failure: function (action) {
                        Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: Ext.String.formatHtml(RS.$('TaskOpt_ReActive_Fail'), rec.data.SerialNum, action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
                    }
                });
            }
        });
    },

    TaskTransfer: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length != 1)
            return;

        var rec = recs[0];

        var dlg = Ext.create('YZSoft.bpm.taskoperation.TaskTransferDlg', {
            autoShow: true,
            taskid: rec.data.TaskID,
            fn: function (steps, users, comments) {
                if (steps.length == 0 || users.length == 0)
                    return;

                var user = users[0],
                    items = [];

                for (var i = 0; i < steps.length; i++) {
                    items.push({
                        ID: i,
                        StepID: steps[i].StepID
                    });
                }

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'TransferExt',
                        Count: steps.length,
                        MemberFullName: user.MemberFullName
                    },
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Transfer_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            var step = steps[item.ID];
                            msg += Ext.String.formatText(RS.$('TaskOpt_Transfer_ItemSuccess'),
                                Ext.String.format('{0}({1})', step.NodeName, YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true)),
                                YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)
                            );
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.formatText(RS.$('TaskOpt_Transfer_SuccessMsg'), action.result.processedItems.length, YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            step = steps[processedItems.length],
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Transfer_ItemFail'),
                                YZSoft.HttpUtility.htmlEncode(Ext.String.format('{0}({1})', step.NodeName, YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true))),
                                action.result.errorMessage
                            );

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error') + ' - ' + rec.data.SerialNum,
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    },

    TaskRecedeBack: function (grid) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length != 1)
            return;

        var rec = recs[0];
        var dlg = Ext.create('YZSoft.bpm.taskoperation.TaskRecedeBackDlg', {
            autoShow: true,
            taskid: rec.data.TaskID,
            fn: function (fromstep, tosteps, comments) {
                if (tosteps.length == 0)
                    return;

                var toStepIDs = [];
                Ext.each(tosteps, function (step) {
                    toStepIDs.push(step.StepID);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'RecedeBack',
                        StepID: fromstep.StepID
                    },
                    jsonData: {
                        comments: comments,
                        toStepIDs: toStepIDs
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_RecedeBack_LoadMask'),
                        target: grid
                    },
                    success: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Operation_Success_Title'),
                            msg: Ext.String.formatText(RS.$('TaskOpt_RecedeBack_Success'), rec.data.SerialNum, action.result.tosteps, ''),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                        grid.getStore().reload({ mbox: mbox });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: Ext.String.formatHtml(RS.$('TaskOpt_RecedeBack_Fail'), rec.data.SerialNum, action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING,
                            fn: function (btn, text) {
                            }
                        });
                    }
                });
            }
        });
    },

    AssignOwner: function (grid,config) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [],
            rec;

        if (recs.length != 1)
            return;

        rec = recs[0];
        config = config || {};

        var dlg = Ext.create('YZSoft.bpm.taskoperation.AssignOwnerDlg', Ext.apply({
            autoShow: true,
            taskid: rec.data.TaskID,
            fn: function (steps, user, comments) {

                var items = [];
                for (var i = 0; i < steps.length; i++) {
                    items.push({
                        ID: i,
                        StepID: steps[i].StepID
                    });
                }

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'AssignOwner',
                        MemberFullName: user.MemberFullName
                    },
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_AssignOwner_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            var step = steps[item.ID];
                            msg += Ext.String.formatText(RS.$('TaskOpt_AssignOwner_ItemSuccess'),
                                Ext.String.format('{0}({1})', step.NodeName, YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true)),
                                YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)
                            );
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.formatText(RS.$('TaskOpt_AssignOwner_SuccessMsg'), action.result.processedItems.length, YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            step = steps[processedItems.length],
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_AssignOwner_ItemFail'),
                                YZSoft.HttpUtility.htmlEncode(Ext.String.format('{0}({1})', step.NodeName, YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true))),
                                action.result.errorMessage
                            );

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error') + ' - ' + rec.data.SerialNum,
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        },config.dlgConfig));
    },

    Repair: function (grid) {
        var sm = grid.getSelectionModel();
        var recs = sm.getSelection() || [];

        if (recs.length != 1)
            return;

        var rec = recs[0];
        var dlg = Ext.create('YZSoft.bpm.taskoperation.TaskRepairDlg', {
            autoShow: true,
            title: Ext.String.format('{0} - {1}', RS.$('All_TaskRepair'), rec.data.SerialNum),
            taskid: rec.data.TaskID,
            fn: function (fromSteps, createNodes, comments) {
                if (fromSteps.length == 0 && createNodes.length == 0)
                    return;

                var fromStepIDs = [];
                Ext.each(fromSteps, function (step) {
                    fromStepIDs.push(step.StepID);
                });

                var toNodeNames = [];
                Ext.each(createNodes, function (node) {
                    toNodeNames.push(node.NodeName);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: {
                        Method: 'Repair',
                        TaskID: rec.data.TaskID
                    },
                    jsonData: {
                        comments: comments,
                        fromStepIDs: fromStepIDs,
                        toNodeNames: toNodeNames
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Repair_LoadMask'),
                        target: grid
                    },
                    success: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Operation_Success_Title'),
                            msg: action.result.tosteps ? Ext.String.formatText(RS.$('TaskOpt_Repair_Success'), rec.data.SerialNum, action.result.tosteps) : Ext.String.formatText(RS.$('TaskOpt_Repair_SuccessEmpty'), rec.data.SerialNum),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                        grid.getStore().reload({ mbox: mbox });
                    },
                    failure: function (action) {
                        Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: Ext.String.formatHtml(RS.$('TaskOpt_Repair_Fail'), rec.data.SerialNum, action.result.errorMessage),
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
                    }
                });
            }
        });
    },

    Handover: function (grid, params, items) {
        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [];

        if (recs.length == 0)
            return;

        var dlg = Ext.create('YZSoft.bpm.taskoperation.HandoverDlg', {
            autoShow: true,
            fn: function (user, comments) {
                Ext.apply(params, {
                    MemberFullName: user.MemberFullName
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskOpt.ashx'),
                    params: params,
                    jsonData: {
                        comments: comments,
                        items: items
                    },
                    waitMsg: {
                        msg: RS.$('TaskOpt_Handover_LoadMask'),
                        target: grid
                    },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore();
                        var msg = '';
                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>';

                            msg += Ext.String.formatText(RS.$('TaskOpt_Handover_ItemSuccess'), recs[item.ID].data.SerialNum, YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName));
                        });

                        return msg;
                    },
                    success: function (action) {
                        grid.getStore().reload({
                            loadMask: {
                                msg: Ext.String.formatText(RS.$('TaskOpt_Handover_SuccessMsg'), action.result.processedItems.length, YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName)),
                                start: 0,
                                stay: 'taskopt'
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            sn = rec.data.SerialNum,
                            failItem = Ext.String.formatHtml(RS.$('TaskOpt_Handover_ItemFail'), sn, action.result.errorMessage);

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>';

                        msg += failItem;

                        var mbox = Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        if (processedItems.length != 0) {
                            var store = grid.getStore();
                            store.reload({ mbox: mbox });
                        }
                    }
                });
            }
        });
    }
});