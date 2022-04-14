
/*
config
    groupInfo
*/
Ext.define('YZSoft.bpa.group.FilePanel', {
    extend: 'YZSoft.bpa.group.lib.Panel',

    constructor: function (config) {
        config.folderid = config.groupInfo.Group.FolderID,
        config.perm = config.groupInfo.Perm

        this.callParent(arguments);
    }
});