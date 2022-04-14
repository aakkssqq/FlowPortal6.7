/*
config
serverName
*/
Ext.define('YZSoft.bpm.src.form.field.FSSFolderField', {
    extend: 'Ext.form.field.Text',
    triggers: {
        browser: {
            cls: 'yz-trigger-folder',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        me.fireEvent('beforeBrowser');
        Ext.create('YZSoft.bpm.src.dialogs.SelFSSFolderDlg', {
            autoShow: true,
            serverName: me.serverName,
            fn: function (folder) {
                me.setValue(folder.data.path);
            }
        });
    }
});