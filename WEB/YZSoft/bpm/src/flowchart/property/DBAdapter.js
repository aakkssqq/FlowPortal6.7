/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.DBAdapter', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.DBAdapter'
    },
    staticData: {
        ElementTypeName: 'DBAdapterNode'
    },
    defaultData: {
        UpdateType: 'Insert',
        ExportDataSet: {
            Tables: []
        }
    }
});