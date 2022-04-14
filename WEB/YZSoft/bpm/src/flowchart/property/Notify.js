/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Notify', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog:{
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.Notify'
    },
    staticData: {
        ElementTypeName: 'NotifyNode'
    },
    constructor: function (config) {
        this.defaultData = YZSoft.bpm.src.flowchart.property.Defaultes.copy({
            Recipients: []
        }, 'Message');

        Ext.apply(this.defaultData, config.defaultData);
        delete config.defaultData;

        this.callParent(arguments);
    }
});