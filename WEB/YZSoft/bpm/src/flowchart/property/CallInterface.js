/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.CallInterface', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.CallInterface'
    },
    staticData: {
        ElementTypeName: 'CallInterfaceNode'
    },
    defaultData: {
        CallDataMap: {
            Tables: []
        }
    }
});