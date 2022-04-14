/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.FileAdapter', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.FileAdapter'
    },
    staticData: {
        ElementTypeName: 'FileAdapterNode'
    },
    defaultData: {
        Filter: '*.*',
        Postfix: '_<%=CurStep.ParentTask.TaskID%>',
        Overwrite: false
    }
});