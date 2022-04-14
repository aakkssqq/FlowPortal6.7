
/*
config
    libInfo
*/
Ext.define('YZSoft.bpa.document.DocumentPanel', {
    extend: 'YZSoft.src.lib.panel.DocumentPanel',

    constructor: function (config) {
        config.folderid = config.libInfo.FolderID;
        config.foldername = config.libInfo.Name;

        this.callParent(arguments);
    }
});