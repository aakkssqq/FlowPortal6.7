/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.CallProcess', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.CallProcess'
    },
    staticData: {
        ElementTypeName: 'CallProcessNode'
    },
    constructor: function (config) {
        this.defaultData = YZSoft.bpm.src.flowchart.property.Defaultes.copy({
            ApporveStartStep: true,
            Participants: [],
            ParticipantPolicy: {
                PolicyType: 'FirstUser',
                BParam1: true
            },
            JumpIfNoParticipants: false,
            CallDataMap: {
                Tables: []
            },
            ReturnDataMap: {
                Tables: []
            }
        }, 'Rules');

        Ext.apply(this.defaultData, config.defaultData);
        delete config.defaultData;

        this.callParent(arguments);
    }
});