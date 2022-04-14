/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Decision', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Decision'
    },
    staticData: {
        ElementTypeName: 'DecisionNode'
    },
    link: {
        configConfirm: true
    },
    defaultData: {
        Permision: [
            'Transfer',
            'Inform',
            'InviteIndicate',
            'Public',
            'MobileApprove'
        ],
        BizTypeInheri: true,
        Rules: [],
        Events: []
    },

    getHumanStepNames: function () {
        var me = this,
            rv = [];

        Ext.each(me.data.Steps, function (step) {
            rv.push(me.data.Name + '\\' + step.StepName);
        });

        return rv;
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
            BizTypeInheri: true,
            Steps:[]
        }, 'Message,Links,Timeout,Events');

        Ext.apply(this.defaultData, config.defaultData);
        delete config.defaultData;

        this.callParent(arguments);
    }
});