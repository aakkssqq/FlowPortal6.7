
/*
config
    folderid,
    perm
*/
Ext.define('YZSoft.bpa.src.panel.LibraryPanel', {
    extend: 'YZSoft.src.lib.panel.Base',
    requires: ['YZSoft.bpa.src.model.Folder'],

    constructor: function (config) {
        var me = this;

        config.storeConfig = Ext.apply({
            model: 'YZSoft.bpa.src.model.Folder'
        }, config.storeConfig);

        me.callParent(arguments);

        me.tree.on({
            scope: me,
            single: true,
            afterrender: function () {
                var tree = me.tree,
                    root = tree.getRootNode(),
                    sm = tree.getSelectionModel();

                root.expand(false, function () {
                    tree.getView().refresh();
                    sm.select((root && root.firstChild) || root);
                });
            }
        });
    },

    getMoveExcludeFolder: function (rec) {
        return [rec.getId()];
    }
});