Ext.define('YZSoft.bpm.src.model.Worklist', {
    extend: 'Ext.data.Model',
    idProperty: 'StepID',
    fields: [
        { name: 'StepID' },
        { name: 'TaskID' },
        { name: 'SerialNum' },
        { name: 'ProcessName' },
        { name: 'ProcessVersion' },
        { name: 'OwnerAccount' },
        { name: 'OwnerDisplayName' },
        { name: 'AgentAccount' },
        { name: 'AgentDisplayName' },
        { name: 'CreateAt' },
        { name: 'NodeName' },
        { name: 'StepName' },
        { name: 'ReceiveAt' },
        { name: 'Share' },
        { name: 'State' },
        { name: 'TimeoutFirstNotifyDate' },
        { name: 'TimeoutDeadline' },
        { name: 'TimeoutNotifyCount' },
        { name: 'Description' },
        { name: 'perm' }
    ],

    getRemindDate: function () {
        var deadline = this.data.TimeoutDeadline,
            remindDate = this.data.TimeoutFirstNotifyDate || (deadline ? Ext.Date.add(deadline, Ext.Date.HOUR, -1) : null);

        return remindDate;
    },

    isInformStep: function () {
        return this.data.StepName == 'sysInform';
    },

    isIndicateStep: function () {
        return this.data.StepName == 'sysIndicate';
    }
});
