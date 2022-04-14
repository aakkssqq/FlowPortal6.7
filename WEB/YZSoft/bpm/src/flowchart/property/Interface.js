/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Interface', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Interface'
    },
    staticData: {
        ElementTypeName: 'InterfaceNode'
    },
    isInterface: true,
    defaultData: {
        ControlDataSet: {
            Tables: []
        }
    }
});