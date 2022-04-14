
/*
config
    fileid
*/
Ext.define('YZSoft.bpm.km.file.bpa.Activities', {
    extend: 'YZSoft.bpm.km.panel.Activities',

    constructor: function (config) {
        config.params = {
            method: 'GetFileActivities',
            fileid: config.fileid
        }

        this.callParent(arguments);
    }
});