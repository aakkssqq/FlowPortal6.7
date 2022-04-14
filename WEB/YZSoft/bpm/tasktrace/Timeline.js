/*
config
    TaskID
    backButton
    activeTabIndex
Events
    backClick
*/
Ext.define('YZSoft.bpm.tasktrace.Timeline', {
    extend: 'Ext.view.View',
    requires: [
        'YZSoft.bpm.src.model.Step'
    ],
    scrollable: true,
    overItemCls: 'yz-item-over',
    selectedItemCls: 'yz-item-select',
    itemSelector: '.yz-dataview-item',
    style: 'background-color:#f5f5f5;',
    padding: 20,
    tpl: [
        '<tpl for=".">',
            '<div class="yz-dataview-item yz-dataview-item-tasktrace {[this.renderOuterStepCls(values)]}">',
                '<div class="d-flex flex-row level1-block level1-curblock">', //主步骤
                    '<div class="level1-col1">',
                        '<div class="text-right stepname">{[this.renderStepName(values)]}</div>',
                        '<div class="text-right from">{[this.renderFrom(values)]}</div>',
                        '<div class="text-right date">{[this.renderStepReciveDate(values)]}</div>',
                    '</div>',
                    '<div class="level1-timelinecol">',
                        '<div class="indicator"></div>',
                    '</div>',
                    '<div class="flex-fill level1-col3">',
                        '<tpl if="this.isSystemStartStep(values)">', //系统步骤
                            '<div class="level2-step level2-step-finished level2-step-systemstart">',
                                '<div class="body">',
                                    '<div class="systemstep systemstart">' + RS.$('All_StartBySystem')+'</div>',
                                '</div>',
                            '</div>',
                        '<tpl elseif="this.isEndStep(values)">', //结束步骤
                            '<div class="level2-step level2-step-finished level2-step-end">',
                                '<div class="body">',
                                    '<div class="systemstep systemend">{TaskState:this.renderTaskState}</div>',
                                '</div>',
                            '</div>',
                        '<tpl elseif="this.isActivityStep(values)">',
                            '<tpl if="Finished">',//已完成的签核的主步骤
                                '<div class="level2-step level2-step-finished {[this.renderMainStepCls(values)]}">',
                                    '<div class="body">',
                                        '<div class="d-flex flex-row line-paper selaction">',
                                            '<div class="flex-fill actionname">{[this.renderFinishedStepCaption(values)]}</div>',
                                            '<div class="elapsed">{[this.renderFinishedStepElapsed(values)]}</div>',
                                        '</div>',
                                        '<div class="line-paper comments {[this.renderCommentsCls(values)]}">{Comments:this.renderComments}</div>',
                                        '<div class="d-flex flex-row justify-content-end sign {[this.renderSignCls(values)]}">',
                                            '<div class="signdate">{FinishAt:this.renderDateM}</div>',
                                            '<div class="flex-fill orangerecipient">{[this.renderOrangeRecipient(values)]}</div>',
                                            '<div class="signlabel">{[this.renderSignLabel(values)]}</div>',
                                            '<div class="signuser">{[this.renderHandler(values)]}</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '<tpl else>',//正在签核的主步骤
                                '<tpl if="this.isShareTaskInPool(values)">',  //尚在共享池中的待办任务
                                    '<div class="level2-step level2-step-running {[this.renderMainStepCls(values)]}">',
                                        '<div class="d-flex flex-row justify-content-end header">',  //头部
                                            '<div class="elapsed">{[this.renderRunningStepElapsed(values, true)]}</div>',
                                        '</div>',
                                        '<div class="d-flex flex-row align-items-center body">', //主体
                                            '<div><img class="processingimg sharepool" src="{[YZSoft.$url(\"YZSoft/theme/images/trace/sharepool.png\")]}"/></div>',
                                            '<div class="processingtext">' + RS.$('Trace_TaskStatus_InSharePool') + '</div>',
                                        '</div>',
                                    '</div>',
                                '<tpl elseif="IsInformStep || IsIndicateStep">',  //正在审批的知会或阅示步骤
                                    '<div class="level2-step level2-step-running level2-step-inform">',
                                        '<div class="d-flex flex-row justify-content-end header">',  //头部
                                            '<div class="elapsed">{[this.renderRunningStepElapsed(values)]}</div>',
                                        '</div>',
                                        '<div class="d-flex flex-row align-items-center body">',
                                            '<div><img class="processingimg processuserheadsort" src="{[this.renderRecipientHeadsort(values)]}"/></div>',
                                            '<div class="processuser">{[this.renderRecipient(values)]}</div>',
                                            '<div class="flex-fill processingtext">' + RS.$('Trace_TaskStatus_InformWaitRead') + '</div>',
                                            '<div class="cancel">' + RS.$('All_Cancel') + '</div>',
                                        '</div>',
                                    '</div>',
                                '<tpl else>', //其他类别待办任务
                                    '<div class="level2-step level2-step-running {[this.renderMainStepCls(values)]}">',
                                        '<div class="d-flex flex-row justify-content-end header">',  //头部
                                            '<div class="elapsed">{[this.renderRunningStepElapsed(values)]}</div>',
                                        '</div>',
                                        '<div class="d-flex flex-row align-items-center body">', //主体
                                            '<div><img class="processingimg processuserheadsort" src="{[this.renderRecipientHeadsort(values)]}"/></div>',
                                            '<div class="processuser">{[this.renderRecipient(values)]}</div>',
                                            '<div class="processingtext">' + RS.$('All_Processing')+'</div>',
                                        '</div>',
                                    '</div>',
                                '</tpl>',
                            '</tpl>',
                        '</tpl>',
                    '</div>',
                '</div>',
                '<div class="d-flex flex-row level1-block level1-beforeblock">', //加签
                    '<div class="level1-col1"></div>',
                    '<div class="level1-timelinecol"></div>',
                    '<div class="flex-fill level1-col3">',
                        '<tpl for="consignSteps">',
                            '<tpl if="Finished">',//已完成的签核步骤
                                '<div class="level2-step level2-step-finished level2-step-consign">',
                                    '<div class="d-flex flex-row header">',  //日期部分
                                        '<div class="flex-fill receivedate">' + RS.$('Trace_TaskStatus_InConsignPerfix') + '{ReceiveAt:this.renderFriendyDate}</div>',
                                    '</div>',
                                    '<div class="body">',
                                        '<div class="d-flex flex-row justify-content-end line-paper selaction">',
                                            '<div class="flex-fill actionname">{[this.renderFinishedStepCaption(values)]}</div>',
                                            '<div class="elapsed">{[this.renderFinishedStepElapsed(values)]}</div>',
                                        '</div>',
                                        '<div class="line-paper comments {[this.renderCommentsCls(values)]}">{Comments:this.renderComments}</div>',
                                        '<div class="d-flex flex-row justify-content-end sign">',
                                            '<div class="flex-fill signdate">{FinishAt:this.renderDateM},{StepID}</div>',
                                            '<div class="signlabel">{[this.renderSignLabel(values)]}</div>',
                                            '<div class="signuser">{[this.renderHandler(values)]}</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '<tpl else>',//未完成的签核步骤
                                '<div class="level2-step level2-step-running level2-step-consign">',
                                    '<div class="d-flex flex-row header">',  //日期部分
                                        '<div class="flex-fill receivedate">' + RS.$('Trace_TaskStatus_InConsignPerfix') + '{ReceiveAt:this.renderFriendyDate}</div>',
                                        '<div class="elapsed">{[this.renderRunningStepElapsed(values)]}</div>',
                                    '</div>',
                                    '<div class="d-flex flex-row align-items-center body">',
                                        '<div><img class="processingimg processuserheadsort" src="{[this.renderRecipientHeadsort(values)]}"/></div>',
                                        '<div class="processuser">{[this.renderRecipient(values)]}</div>',
                                        '<div class="processingtext">' + RS.$('Trace_TaskStatus_InConsign') + '</div>',
                                    '</div>',
                                '</div>',
                            '</tpl>',
                        '</tpl>',
                    '</div>',
                '</div>',
                '<div class="d-flex flex-row level1-block level1-beforeblock">', //fllowSteps
                    '<div class="level1-col1"></div>',
                    '<div class="level1-timelinecol"></div>',
                    '<div class="flex-fill level1-col3">',
                        '<tpl for="fllowSteps">',
                            '<tpl if="Finished">',//已完成的步骤(知会或阅示)
                                '<div class="level2-step level2-step-finished level2-step-inform">',
                                    '<div class="body">',
                                        '<div class="d-flex flex-row justify-content-end line-paper selaction">',
                                            '<div class="flex-fill actionname">{[this.renderFinishedStepCaption(values)]}</div>',
                                            '<div class="elapsed">{[this.renderFinishedStepElapsed(values)]}</div>',
                                        '</div>',
                                        '<div class="line-paper comments {[this.renderCommentsCls(values)]}">{Comments:this.renderComments}</div>',
                                        '<div class="d-flex flex-row justify-content-end sign">',
                                            '<div class="flex-fill signdate">{FinishAt:this.renderDateM}</div>',
                                            '<div class="signlabel">{[this.renderSignLabel(values)]}</div>',
                                            '<div class="signuser">{[this.renderHandler(values)]}</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '<tpl else>',//未完成的步骤(知会或阅示)
                                '<div class="level2-step level2-step-running level2-step-inform">',
                                    '<div class="d-flex flex-row align-items-center body">',
                                        '<div><img class="processingimg processuserheadsort" src="{[this.renderRecipientHeadsort(values)]}"/></div>',
                                        '<div class="processuser">{[this.renderRecipient(values)]}</div>',
                                        '<div class="flex-fill processingtext">' + RS.$('Trace_TaskStatus_InformWaitRead') + '</div>',
                                        '<div class="cancel">' + RS.$('All_Cancel') + '</div>',
                                    '</div>',
                                '</div>',
                            '</tpl>',
                        '</tpl>',
                    '</div>',
                '</div>',
            '</div>',
        '</tpl>', {
            isOuterStepFinished: function (step) {
                var hasUnfinishedStep;

                if (step.isEndStep)
                    return true;

                //存在未完成的加签步骤
                hasUnfinishedStep = Ext.Array.findBy(step.consignSteps || [], function (childstep) {
                    return !childstep.Finished;
                });

                if (hasUnfinishedStep)
                    return !hasUnfinishedStep;

                //存在未完成的阅示步骤
                hasUnfinishedStep = Ext.Array.findBy(step.fllowSteps || [], function (childstep) {
                    return childstep.IsIndicateStep && !childstep.Finished;
                });

                if (hasUnfinishedStep)
                    return !hasUnfinishedStep;

                return step.Finished;
            },
            isShareTaskInPool: function (step) {
                return step.Share && !step.OwnerAccount;
            },
            getFllowStepRecipinets: function (step) {
                var me = this,
                    userNames = [],
                    recp;

                Ext.each(step.fllowSteps, function (fllowstep) {
                    recp = me.getStepRecipinet(fllowstep);
                    recp && userNames.push(recp);
                })

                return userNames;
            },
            getStepRecipinet: function (step) {
                if (!step)
                    return '';

                return Ext.util.Format.text(step.RecipientDisplayName || step.RecipientAccount);
            },
            getUserNames: function (users) {
                var names = [];

                Ext.each(users, function (user) {
                    names.push(user.ShortName);
                });

                return names;
            },
            getStepIdentity: function (step) {
                return Ext.String.format('{0}({1})', step.NodeName, step.RecipientDisplayName || step.RecipientAccount);
            },
            getStepIdentities: function (steps) {
                var me = this,
                    names = [];

                Ext.each(steps, function (step) {
                    names.push(me.getStepIdentity(step));
                });

                return names;
            },
            renderOuterStepCls: function (mainStep) { //最外层的步骤是否结束
                var rv = [];

                rv.push(this.isOuterStepFinished(mainStep) ? 'level1-finished' : 'level1-running');
                rv.push(mainStep.Finished ? 'level1-mainstep-finished' : 'level1-mainstep-running');

                return rv.join(' ');
            },
            renderString: function (value) {
                return Ext.util.Format.text(value);
            },
            isSystemStartStep: function (step) {
                return step.IsStartStep && !step.IsHumanStep;
            },
            isEndStep: function (step) {
                return step.isEndStep;
            },
            isActivityStep: function (step) {
                return true;
            },
            isLevel1StepFinished: function (step) {
                return false;
            },
            renderDateM: function (date) {
                return Ext.util.Format.date(date, 'Y-m-d H:i');
            },
            renderFriendyDate: function (date) {
                return Ext.util.Format.friendlyDate(date);
            },
            renderStepReciveDate: function (step) {
                var date = step.ReceiveAt;

                if (!date)
                    return '';

                if (step.IsTaskOptStep || step.IsStartStep)
                    return Ext.util.Format.friendlyDate(date);
                else
                    return Ext.util.Format.friendlyDate(date, null, RS.$('Trace_Timeline_ReceiveTime'));
            },
            renderRunningStepElapsed: function (step, taskinsharepool) {
                var now = new Date(),
                    minutes = Math.floor(Ext.Date.getElapsed(step.ReceiveAt, now) / 1000 / 60),
                    msgfmt = taskinsharepool ? RS.$('Trace_Timeline_ReceiveTime_SharePool') : RS.$('Trace_Timeline_ReceiveTime_Worklist');

                if (minutes < 0)
                    return;

                rv = Ext.util.Format.toElapsedString(minutes);
                rv = Ext.String.format(msgfmt, rv);
                return rv;

            },
            renderComments: function (value) {
                return value ? Ext.util.Format.text(value) : RS.$('Trace_Timeline_Empty_Comments');
            },
            renderCommentsCls: function (step) {
                return step.Comments ? '' : 'comments-empty';
            },
            renderMainStepCls: function (step) {
                if (step.IsTaskOptStep)
                    return 'level2-step-taskoperation';
                else
                    return 'level2-step-activity';
            },
            renderHandler: function (step) {
                return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="l50-r50">{1}</span>',
                    Ext.util.Format.text(step.HandlerAccount),
                    Ext.util.Format.text(step.HandlerDisplayName || step.HandlerAccount));
            },
            renderRecipient: function (step) {
                return Ext.String.format('<span class="yz-s-uid" uid="{0}" tip-align="l50-r50">{1}</span>',
                    Ext.util.Format.text(step.RecipientAccount),
                    Ext.util.Format.text(step.RecipientDisplayName || step.RecipientAccount));
            },
            renderStepName: function (step) {
                var actionlow = (step.SelAction || '').toLowerCase(),
                    prevstep = step.prevSteps && step.prevSteps[0],
                    rv;

                if (step.IsTaskOptStep) {
                    switch (actionlow) {
                        case 'sysabort':
                            return '<span class="highlight-step">' + RS.$('Trace_SysAction_Abort') + '<span>';
                        case 'sysreactive':
                            return '<span class="highlight-step">' + RS.$('Trace_SysAction_Reactive') + '<span>';
                        case 'sysdelete':
                            return '<span class="highlight-step">' + RS.$('Trace_SysAction_Delete') + '<span>';
                        case 'syscontinue':
                            return '<span class="highlight-step">' + RS.$('Trace_SysAction_Continue') + '<span>';
                    }
                    return step.SelActionDisplayString;
                }

                if (step.Share && (!step.OwnerAccount || actionlow == 'syspickupsharetask'))
                    rv = step.NodeDisplayName + RS.$('Trace_Timeline_Indicator_InSharePool');
                else
                    rv = step.NodeDisplayName;

                if (prevstep) {
                    var provstepactionlow = (prevstep.SelAction || '').toLowerCase();
                    switch (provstepactionlow) {
                        case 'sysrecedeback':
                            rv += RS.$('Trace_Timeline_Indicator_RecedeBack');
                            break;
                        case 'syspickbackrestart':
                            rv += RS.$('Trace_Timeline_Indicator_PickBackRestart');
                            break;
                        case 'syspickback':
                            rv += RS.$('Trace_Timeline_Indicator_PickBack');
                            break;
                        case 'systransfer':
                            rv += RS.$('Trace_Timeline_Indicator_Transfer');
                            break;
                        case 'syshandover':
                            rv += RS.$('Trace_Timeline_Indicator_Handover');
                            break;
                    }
                }

                return rv;
            },
            renderFrom: function (step) {
                return '';
                var prevstep = step.prevSteps && step.prevSteps[0];

                if (prevstep) {
                    var actionlow = prevstep.SelAction.toLowerCase();
                    switch (actionlow) {
                        case 'sysrecedeback':
                            return Ext.String.format('{0}', this.getStepIdentity(prevstep));
                    }
                }
            },
            renderFinishedStepCaption: function (step) {
                var actionlow = step.SelAction.toLowerCase();

                if (step.IsTaskOptStep) {
                    switch (actionlow) {
                        case 'sysinform':
                            return Ext.String.format(RS.$('Trace_SysAction_InformExt'), this.getFllowStepRecipinets(step).join(' ; '));
                        case 'sysinviteindicate':
                            return Ext.String.format(RS.$('Trace_SysAction_InviteIndicateExt'), this.getFllowStepRecipinets(step).join(' ; '));
                    }
                }

                switch (actionlow) {
                    case 'syspickupsharetask':
                        return RS.$('Trace_SysAction_PickupShareTask');
                    case 'sysputbacksharetask':
                        return RS.$('Trace_SysAction_PutbackShareTask');
                    case 'sysstop':
                        return '<span class="highlight-action">' + RS.$('Trace_SysAction_Stop') + '</span>';
                    case 'sysabort':
                        return RS.$('Trace_SysAction_AbortExt');
                    case 'sysrecedeback':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_RecedeBack'), this.getStepIdentities(step.nextSteps).join(' ; ')) + '</span>';
                    case 'sysassignowner':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_AssignOwner'), this.getStepRecipinet(step.nextSteps && step.nextSteps[0])) + '</span>';
                    case 'sysreject':
                        return '<span class="highlight-action">' + RS.$('Trace_SysAction_Reject') + '</span>';
                    case 'sysreactive':
                        return Ext.String.format(RS.$('Trace_SysAction_ReactiveExt'), this.getStepIdentities(step.nextSteps).join(' ; '));
                    case 'sysdelete':
                        return RS.$('Trace_SysAction_DeleteExt');
                    case 'syscontinue':
                        return RS.$('Trace_SysAction_ContinueExt');
                    case 'sysjump':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_Jump'), this.getStepIdentities(step.nextSteps).join(' ; ')) + '</span>';
                    case 'systimeoutjump':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_TimeoutJump'), this.getStepIdentities(step.nextSteps).join(' ; ')) + '</span>';
                    case 'syspickbackrestart':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_PickbackRrestart'), this.getStepIdentities(step.nextSteps).join(' ; ')) + '</span>';
                    case 'syspickback':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_Pickback'), this.getStepIdentities(step.nextSteps).join(' ; ')) + '</span>';
                    case 'systransfer':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_Transfer'), this.getStepRecipinet(step.nextSteps && step.nextSteps[0])) + '</span>';
                    case 'syshandover':
                        return '<span class="highlight-action">' + Ext.String.format(RS.$('Trace_SysAction_Handover'), this.getStepRecipinet(step.nextSteps && step.nextSteps[0])) + '</span>';
                }

                if (step.RisedConsignID != -1)
                    return Ext.String.format(RS.$('Trace_SysAction_RaiseConsign'), this.getUserNames(step.consignUsers).join(' ; '));

                return step.SelActionDisplayString;
            },
            renderSignCls: function (step) {
                var actionlow = step.SelAction.toLowerCase();

                switch (actionlow) {
                    case 'systimeoutjump':
                        return 'system-sign';
                }
            },
            renderOrangeRecipient: function (step) {
                var actionlow = step.SelAction.toLowerCase();

                switch (actionlow) {
                    case 'sysstop':
                    case 'sysassignowner':
                    case 'systimeoutjump':
                    case 'syspickbackrestart':
                    case 'syspickback':
                    case 'syshandover':
                        return Ext.String.format('{0}<span class="yz-s-uid" uid="{1}" tip-align="l50-r50">{2}</span>',
                            RS.$('Trace_OrangeRecipient_Postfix'),
                            Ext.util.Format.text(step.RecipientAccount),
                            Ext.util.Format.text(step.RecipientDisplayName || step.RecipientAccount));
                        break;
                    case 'sysreject':
                    case 'sysjump':
                        if (!String.Equ(step.HandlerAccount, step.RecipientAccount)) {
                            return Ext.String.format('{0}<span class="yz-s-uid" uid="{1}" tip-align="l50-r50">{2}</span>',
                                RS.$('Trace_OrangeRecipient_Postfix'),
                                Ext.util.Format.text(step.RecipientAccount),
                                Ext.util.Format.text(step.RecipientDisplayName || step.RecipientAccount));
                        }
                        break;
                }
            },
            renderSignLabel: function (step) {
                var actionlow = step.SelAction.toLowerCase();

                if (step.IsInformStep)
                    return RS.$('Trace_SignLabel_InformStep');

                if (step.IsIndicateStep)
                    return RS.$('Trace_SignLabel_IndicateStep');

                if (step.IsConsignStep)
                    return RS.$('Trace_SignLabel_ConsignStep');

                if (step.IsTaskOptStep) {
                    switch (step.SelAction.toLowerCase()) {
                        case 'sysinform':
                        case 'sysinviteindicate':
                            return RS.$('Trace_SignLabel_RaiseInformStep');
                    }
                }

                switch (actionlow) {
                    case 'syspickupsharetask':
                        return RS.$('Trace_SignLabel_PickupShartTask');
                    case 'sysputbacksharetask':
                        return RS.$('Trace_SignLabel_PutbackShareTask');
                    case 'sysstop':
                        return RS.$('Trace_SignLabel_Stop');
                    case 'sysabort':
                        return RS.$('Trace_SignLabel_Abort');
                    case 'sysassignowner':
                        return RS.$('Trace_SignLabel_Admin');
                    case 'sysreject':
                        if (!String.Equ(step.HandlerAccount, step.RecipientAccount))
                            return RS.$('Trace_SignLabel_Admin');
                        break;
                    case 'sysreactive':
                        return RS.$('Trace_SignLabel_Admin');
                    case 'sysdelete':
                        return RS.$('Trace_SignLabel_Delete');
                    case 'syscontinue':
                        return RS.$('Trace_SignLabel_Admin');
                    case 'sysjump':
                        return RS.$('Trace_SignLabel_Jump');
                    case 'systimeoutjump':
                        return RS.$('Trace_SignLabel_AutoProcess');
                    case 'syspickbackrestart':
                        return RS.$('Trace_SignLabel_PickbackRestart');
                    case 'syspickback':
                        return RS.$('Trace_SignLabel_Pickback');
                    case 'syshandover':
                        return RS.$('Trace_SignLabel_Admin');
                }

                return RS.$('Trace_SignLabel_Signer');
            },

            renderFinishedStepElapsed: function (step) {
                var minutes = step.UsedMinutesWork,
                    rv = minutes >= 0 ? Ext.util.Format.toElapsedString(minutes) : '',
                    actionlow = step.SelAction.toLowerCase(),
                    msgfmt;

                switch (actionlow) {
                    case 'syspickupsharetask':
                        msgfmt = RS.$('Trace_Elapsed_PickupShareTask');
                    case 'sysputbacksharetask':
                        msgfmt = RS.$('Trace_Elapsed_PutbackShareTask');

                }

                msgfmt = msgfmt || RS.$('Trace_Elapsed_General');

                if (rv)
                    rv = Ext.String.format(msgfmt, rv);

                return rv;
            },

            renderTaskState: function (taskState) {
                switch (taskState) {
                    case 'Approved':
                        return RS.$('Trace_TaskStatus_Approved');
                    case 'Rejected':
                        return '<span class="highlight-action">' + RS.$('Trace_TaskStatus_Rejected') + '</span>';
                    case 'Aborted':
                        return '<span class="highlight-action">' + RS.$('Trace_TaskStatus_Aborted') + '</span>';
                    case 'Deleted':
                        return '<span class="highlight-action">' + RS.$('Trace_TaskStatus_Deleted') + '</span>';
                }
            },

            renderRecipientHeadsort: function (step) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: step.RecipientAccount,
                    thumbnail: 'M'
                }));
            }
        }
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.Step',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Task.ashx'),
                extraParams: {
                    Method: 'GetTimellineSteps',
                    TaskID: config.TaskID
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
