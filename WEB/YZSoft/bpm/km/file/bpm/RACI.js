
/*
config
    processName
    version
*/
Ext.define('YZSoft.bpm.km.file.bpm.RACI', {
    extend: 'YZSoft.bpm.km.panel.RACI',
    activeNameField: 'NodeName',

    constructor: function (config) {
        config.params = {
            method: 'GetBPMProcessRACI',
            processName: config.processName,
            version: config.version
        }

        this.callParent(arguments);
    }
});