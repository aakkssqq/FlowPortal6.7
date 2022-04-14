
/*
config
    fileid
*/
Ext.define('YZSoft.bpm.km.file.bpa.Risk', {
    extend: 'YZSoft.bpm.km.panel.Risk',

    constructor: function (config) {
        config.params = {
            method: 'GetFileRisk',
            fileid: config.fileid
        }

        this.callParent(arguments);
    }
});