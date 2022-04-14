/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.SQLPlugin', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass:'YZSoft.bpm.src.flowchart.dialogs.SQLPlugin'
    },
    staticData: {
        ElementTypeName: 'SQLPluginNode'
    },
    defaultData: {
        DataSourceName: 'Default'
    }
});