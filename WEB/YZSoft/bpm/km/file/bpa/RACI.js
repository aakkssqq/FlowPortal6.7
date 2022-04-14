
/*
config
    fileid
*/
Ext.define('YZSoft.bpm.km.file.bpa.RACI', {
    extend: 'YZSoft.bpm.km.panel.RACI',

    constructor: function (config) {
        config.params = {
            method: 'GetFileRACI',
            fileid: config.fileid
        }

        this.callParent(arguments);
    }
});