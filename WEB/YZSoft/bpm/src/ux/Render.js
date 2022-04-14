
Ext.define('YZSoft.bpm.src.ux.Render', {
    singleton: true,

    getUserFriendlyName: function (account, displayName, shortFormat) {
        if (Ext.isEmpty(displayName))
            return account;

        if (shortFormat)
            return displayName;

        return displayName + '(' + account + ')';
    },

    getTaskStateDisplayString: function (state) {
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

    renderRecipientShortName: function (value, metaData, record) {
        if (!value.account)
            return RS.$('All_None');

        return YZSoft.HttpUtility.htmlEncode(YZSoft.bpm.src.ux.Render.getUserFriendlyName(value.account, value.displayName, true));
    },

    renderTaskOwner: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.renderTaskOwnerExt(record.data, false);
    },

    renderStepOwner: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.renderStepOwnerExt(record.data);
    },

    renderStepRecipient: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.renderStepRecipientExt(record.data, false);
    },

    renderStepAgent: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.renderStepAgentExt(record.data);
    },

    renderStepHandler: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.renderStepHandlerExt(record.data);
    },

    renderTaskState: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.renderTaskStateExt(value);
    },

    renderTaskStateNoWrap: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.renderTaskStateExt(value, ';');
    },

    renderTaskOwnerExt: function (task, singleLine) {
        if (Ext.isEmpty(task.OwnerAccount))
            return RS.$('All_StartBySystem');

        var ownerHtml = YZSoft.HttpUtility.htmlEncode(YZSoft.bpm.src.ux.Render.getUserFriendlyName(task.OwnerAccount, task.OwnerDisplayName, true));

        var agentHtml = '';
        if (!Ext.isEmpty(task.AgentAccount) && !String.Equ(task.AgentAccount, task.OwnerAccount)) {
            agentHtml = Ext.String.format("<span class=\"yz-agent-name\">{0}</span>",
                    Ext.String.format(RS.$('All_PostByAgent'), YZSoft.HttpUtility.htmlEncode(YZSoft.bpm.src.ux.Render.getUserFriendlyName(task.AgentAccount, task.AgentDisplayName, true))));

            if (singleLine)
                agentHtml = '[' + agentHtml + ']';
            else
                agentHtml = '<br/>' + agentHtml;
        }

        return Ext.String.format('<span class="yz-s-uid" uid="{0}">{1}{2}</span>',
            task.OwnerAccount,
            ownerHtml,
            agentHtml);
    },

    renderStepOwnerExt: function (step) {
        if (step.Finished) {
            //if (step.AutoProcess)
            //    return RS.$('All_None');

            if (Ext.isEmpty(step.OwnerAccount) && step.Share)
                return RS.$('All_ShareTaskNotGot');
        }
        else {
            if (Ext.isEmpty(step.OwnerAccount) && step.Share)
                return RS.$('All_SharePool');
        }

        if (Ext.isEmpty(step.OwnerAccount))
            return RS.$('All_None');

        return YZSoft.HttpUtility.htmlEncode(YZSoft.bpm.src.ux.Render.getUserFriendlyName(step.OwnerAccount, step.OwnerDisplayName, false));
    },

    renderStepRecipientExt: function (step, shortFormat) {
        if (step.Finished) {
            //if (step.AutoProcess)
            //    return RS.$('All_None');

            if (Ext.isEmpty(step.RecipientAccount) && step.Share)
                return RS.$('All_ShareTaskNotGot');
        }
        else {
            if (Ext.isEmpty(step.RecipientAccount) && step.Share)
                return RS.$('All_SharePool');
        }

        return YZSoft.HttpUtility.htmlEncode(YZSoft.bpm.src.ux.Render.getUserFriendlyName(step.RecipientAccount, step.RecipientDisplayName, shortFormat)) || RS.$('All_StepRecipientEmpty');
    },

    renderStepAgentExt: function (step) {
        if (Ext.isEmpty(step.AgentAccount) || String.Equ(step.OwnerAccount, step.AgentAccount))
            return '';

        return YZSoft.HttpUtility.htmlEncode(YZSoft.bpm.src.ux.Render.getUserFriendlyName(step.AgentAccount, step.AgentDisplayName, false));
    },

    renderStepHandlerExt: function (step, autoprocessShowOwner) {
        if (step.AutoProcess)
            return (autoprocessShowOwner ? this.renderStepOwnerExt(step) : RS.$('All_None'));

        return YZSoft.HttpUtility.htmlEncode(YZSoft.bpm.src.ux.Render.getUserFriendlyName(step.HandlerAccount, step.HandlerDisplayName, false));
    },

    renderTaskStateExt: function (state, join) {
        var rv = YZSoft.bpm.src.ux.Render.getTaskStateDisplayString(state.State);

        join = join || '<br/>';

        if (state.State == 'running' && state.children && state.children.length != 0) {
            if ($S.BPM.Render.TaskStateMergeStep) {
                var msteps = []; //合并队列

                //获得合并队列
                Ext.each(state.children, function (step) {
                    var itemRecp = YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true); //这个步骤的处理人

                    //查找已存在的步骤
                    var find = false;
                    Ext.each(msteps, function (mstep) {
                        if (mstep.StepName == step.StepName) {
                            mstep.Recps.push(itemRecp);
                            find = true;
                            return;
                        }
                    });

                    //步骤不存在
                    if (!find) {
                        var mstep = {};
                        mstep.StepName = step.StepName;
                        mstep.Recps = [itemRecp];
                        msteps.push(mstep);
                    }
                });

                //显示合并队列
                var steps = [];
                Ext.each(msteps, function (mstep) {
                    //获得一个步骤的显示信息
                    var recp = mstep.Recps.join(",");
                    var item = Ext.String.format(recp ? "{0}&nbsp;[{1}]" : "{0}",
                        YZSoft.HttpUtility.htmlEncode(mstep.StepName),
                        recp);

                    //添加到队列
                    steps.push(item);
                });

                rv = steps.join(join);
            }
            else {
                var steps = [];
                Ext.each(state.children, function (step) {
                    //获得一个步骤的显示信息
                    var recp = YZSoft.bpm.src.ux.Render.renderStepRecipientExt(step, true);
                    var item = Ext.String.format(recp ? "{0}&nbsp;[{1}]" : "{0}",
                        YZSoft.HttpUtility.htmlEncode(step.StepName),
                        recp);

                    //添加到队列
                    steps.push(item);
                });

                rv = steps.join(join);
            }
        }

        return rv;
    },

    getRowClass: function (record) {
        switch (record.data.State.State) {
            case 'aborted':
            case 'deleted':
                return 'yz-task-row yz-task-row-gray';
            case 'rejected':
                return 'yz-task-row yz-task-row-rejected';
            case 'running':
                return 'yz-task-row yz-task-row-running';
            default:
                return 'yz-task-row';
        }
    }
});