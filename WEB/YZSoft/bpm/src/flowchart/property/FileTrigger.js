/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.FileTrigger', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.FileTrigger'
    },
    staticData: {
        ElementTypeName: 'FileTriggerNode'
    },
    defaultData: {
        FileFilter: '*.*',
        TriggerType: 'ImportData',
        ArchiveAfterExecute: true,
        ControlDataSet: {
            Tables: []
        }
    }
});