
Ext.define('YZSoft.bpm.src.panel.WorklistAbstract', {
    extend: 'YZSoft.bpm.src.panel.StepAbstract',

    getTaskDelegationHtml: function (record) {
        var task = record.data,
            html;

        html = '';
        if (!Ext.isEmpty(task.AgentAccount) && !String.Equ(task.AgentAccount, task.OwnerAccount)) {
            html = Ext.String.format([
                '<span class="yz-grid-cell-box yz-glyph yz-glyph-eab5" data-qtip="{0}">',
                '</span>'].join(''),
                Ext.String.format(RS.$('All_PostDelegator'), Ext.util.Format.text(task.AgentDisplayName || task.AgentAccount))
            );
        }

        return html;
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

    getTaskStateStepRecp: function (step) {
        if (step.Finished) {
            if (Ext.isEmpty(step.RecipientAccount) && step.Share)
                return RS.$('All_ShareTaskNotGot');
        }
        else {
            if (Ext.isEmpty(step.RecipientAccount) && step.Share)
                return RS.$('All_SharePool');
        }

        return Ext.util.Format.text(step.RecipientDisplayName || step.RecipientAccount);
    },

    getTaskStateStepTimeoutFlag: function(step,index) {
        var me = this,
            now = new Date(),
            deadline = step.TimeoutDeadline,
            remindDate = me.getRemindDate(step);

        if (!deadline)
            return '';

        if (now >= deadline)
            return Ext.String.format('<div class="yz-grid-cell-box-s yz-s-timeout yz-color-warn yz-glyph yz-glyph-ea9d" index="{0}"></div>', index);
        else if (now >= remindDate)
            return Ext.String.format('<div class="yz-grid-cell-box-s yz-s-timeout yz-color-info yz-glyph yz-glyph-ea9d" index="{0}"></div>', index);
        else
            return Ext.String.format('<div class="yz-grid-cell-box-s yz-s-timeout yz-color-flag yz-glyph yz-glyph-ea9d" index="{0}"></div>', index);
    },

    renderFlags: function (value, metaData, record) {
        var me = this,
            args = arguments,
            rv = [];

        Ext.Array.each([
            me.renderShareFlag,
            me.renderTimeoutFlag
            //me.renderStepTypeFlag
        ], function (func) {
            rv.push(func.apply(me, args));
        });

        return rv.join('');
    },

    renderShareFlag: function (value, metaData, record) {
        if (record.data.Share) {
            return Ext.String.format('<div class="yz-s-share" data-qtip="{0}"></div >',
                RS.$('All_ShareTask')
            );
        }
    },

    renderStepTypeFlag: function (value, metaData, record) {
        if (record.isInformStep())
            return '<div class="yz-grid-cell-box-flag yz-color-flag yz-glyph yz-glyph-e651"></div>';

        if (record.isIndicateStep())
            return '<div class="yz-grid-cell-box-flag yz-color-flag yz-glyph yz-glyph-e651"></div>';

        return '';
    },

    renderSN: function (value, metaData, record) {
        return Ext.String.format("<a href='#'>{0}</a>", Ext.util.Format.text(value));
    },

    renderProcessName: function (value, metaData, record) {
        return Ext.String.format('<div data-qtip="{1}<br/>{2} : {3}">{0}</div >',
            Ext.util.Format.text(value),
            Ext.util.Format.text(record.data.ProcessName),
            RS.$('All_Version'),
            Ext.util.Format.text(record.data.ProcessVersion)
        );
    },

    renderTaskOwner: function (value, metaData, record) {
        var me = this,
            task = record.data;

        if (Ext.isEmpty(task.OwnerAccount))
            return RS.$('All_StartBySystem');

        return Ext.String.format('<span class="yz-s-uid" uid="{0}">{1}</span>{2}',
            Ext.util.Format.text(task.OwnerAccount),
            Ext.util.Format.text(task.OwnerDisplayName || task.OwnerAccount),
            me.getTaskDelegationHtml(record));
    },

    renderTaskState: function(value, metaData, record) {
        var me = this,
            state = value,
            rv = me.getTaskStateDisplayString(state.State),
            steps = []

        if (state.State != 'running')
            return rv;

        if (!state.children || state.children.length == 0)
            return rv;

        Ext.each(state.children, function (step,index) {
            var recp = me.getTaskStateStepRecp(step),
                timeoutFlag = me.getTaskStateStepTimeoutFlag(step,index),
                stepName = Ext.util.Format.text(step.StepName),
                itemText;

            recp = recp ? Ext.String.format('<span class="yz-m-l2">({0})</span>', recp) : recp;
            itemText = stepName + recp;

            if (step.RecipientAccount)
                itemText = Ext.String.format('<span class="yz-s-uid" uid="{0}">{1}</span>',
                    Ext.util.Format.text(step.RecipientAccount),
                    itemText);

            itemText = timeoutFlag + itemText
            steps.push(itemText);
        });

        return steps.join('<br/>');
    },

    renderTaskStateSimple: function(value, metaData, record) {
        return this.getTaskStateDisplayString(value.State);
    },

    onClickSN: function (view, cell, recordIndex, cellIndex, e) {
        if (e.getTarget().tagName == 'A')
            this.openForm(this.store.getAt(recordIndex));
    }
});