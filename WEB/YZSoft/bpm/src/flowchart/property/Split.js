/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Split', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass:'YZSoft.bpm.src.flowchart.dialogs.Split'
    },
    staticData: {
        ElementTypeName: 'SplitNode'
    },
    defaultData:{
    }
});