/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Activity', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Activity'
    },
    staticData: {
        ElementTypeName: 'ActivityNode'
    },
    link: {
        configConfirm: true,
        configDefaultLink: true
    },
    getHumanStepNames: function () {
        return this.data.Name;
    },
    constructor: function (config) {
        this.defaultData = YZSoft.bpm.src.flowchart.property.Defaultes.copy({
            Permision: [
                'Transfer',
                'Inform',
                'InviteIndicate',
                'Public',
                'MobileApprove'
            ],
            BizTypeInheri: true
        }, 'Participant,DataControl,Message,Links,Timeout,Events,Rules');

        Ext.apply(this.defaultData, config.defaultData);
        delete config.defaultData;

        this.callParent(arguments);
    }
});