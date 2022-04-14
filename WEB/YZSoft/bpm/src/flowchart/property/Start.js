/*
config
sprite
drawContainer
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Start', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Start'
    },
    staticData: {
        ElementTypeName: 'StartNode'
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
                'Abort',
                'Public',
                'InviteIndicate',
                'Inform',
                'MobileApprove'
            ],
            PickBackUnProcessedStepOnly: true
        }, 'DataControl,Message,Links,Events');

        Ext.apply(this.defaultData, config.defaultData);
        delete config.defaultData;

        this.callParent(arguments);
    }
});