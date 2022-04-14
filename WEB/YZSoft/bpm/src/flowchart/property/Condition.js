/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Condition', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass:'YZSoft.bpm.src.flowchart.dialogs.Condition'
    },
    staticData: {
        ElementTypeName: 'ConditionNode'
    },
    link: {
        configCondition: true
    },
    defaultData: {
        ExpressMean:RS.$('All_BPM_ConditionExpressMeanSample')
    }
});