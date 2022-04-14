/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Snapshot', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    requires: ['YZSoft.bpm.src.flowchart.property.Defaultes'],
    dialog:{
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Snapshot'
    },
    staticData: {
        ElementTypeName: 'SnapshotNode'
    },
    defaultData: {
    }
});