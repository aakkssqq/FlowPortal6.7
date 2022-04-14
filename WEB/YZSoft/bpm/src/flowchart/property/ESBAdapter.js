/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.ESBAdapter', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass:'YZSoft.bpm.src.flowchart.dialogs.ESBAdapter'
    },
    staticData: {
        ElementTypeName: 'ESBAdapterNode'
    },
    defaultData: {
        UseQueue: false,
        QueueName: 'ESB'
    }
});