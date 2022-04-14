/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.CodePlugin', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.CodePlugin'
    },
    staticData: {
        ElementTypeName: 'CodePluginNode'
    },
    defaultData: {
    }
});