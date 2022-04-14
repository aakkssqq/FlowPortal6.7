
/*
config
    fileid
*/
Ext.define('YZSoft.bpm.km.file.bpa.KPI', {
    extend: 'YZSoft.bpm.km.panel.KPI',

    constructor: function (config) {
        config.params = {
            method: 'GetFileKPI',
            fileid: config.fileid
        }

        this.callParent(arguments);
    }
});