/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.FreeRouting', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.FreeRouting'
    },
    staticData: {
        ElementTypeName: 'FreeRoutingNode'
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
        }, 'FreeRoutingParticipant,DataControl,Message,Links,Timeout,Events,Rules');

        Ext.apply(this.defaultData, config.defaultData);
        delete config.defaultData;

        this.callParent(arguments);
    }
});