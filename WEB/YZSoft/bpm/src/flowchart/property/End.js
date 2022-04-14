/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.End', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.End'
    },
    staticData: {
        ElementTypeName: 'EndNode'
    },
    defaultData: {
        EndType: 'Approve'
    }
});