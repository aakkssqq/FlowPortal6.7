
/*
config
    libInfo
*/
Ext.define('YZSoft.bpa.library.FilePanel', {
    extend: 'YZSoft.bpa.library.lib.Panel',

    constructor: function (config) {
        config.folderid = config.libInfo.FolderID;
        config.foldername = config.libInfo.Name;

        this.callParent(arguments);
    }
});