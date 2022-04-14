/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.XMLAdapter', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.XMLAdapter'
    },
    staticData: {
        ElementTypeName: 'XMLAdapterNode'
    },
    defaultData: {
        BySchema: true,
        FileName: 'TaskID_<%=CurStep.ParentTask.TaskID%>.xml',
        EncodeType: 'UTF8',
        Overwrite: false,
        ExportDataSet: {
            Tables: []
        }
    }
});