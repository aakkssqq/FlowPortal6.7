/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Inform', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Inform'
    },
    staticData: {
        ElementTypeName: 'InformNode'
    },
    constructor: function (config) {
        this.defaultData = YZSoft.bpm.src.flowchart.property.Defaultes.copy({
            InformType: 'Inform',
            Recipients: []
        }, 'Message');

        Ext.apply(this.defaultData, config.defaultData);
        delete config.defaultData;

        this.callParent(arguments);
    }
});