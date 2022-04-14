
Ext.define('YZSoft.src.library.pathbased.Panel', {
    extend: 'YZSoft.src.library.base.Panel',

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope: me,
            treefolderrenamed: 'onTreeFolderRenamed'
        });
    },

    getFolderPath: function (folderId, fn) {
        fn && fn(folderId);
    },

    combileChildFolderId: function (parentFolderId, viewRecord) {
        var rv = [];

        if (parentFolderId)
            rv.push(parentFolderId);

        rv.push(viewRecord.getId());

        return rv.join('/');
    },

    treeGetFolderId: function (record) {
        return record.isRoot() ? null : record.getId()
    },

    treeUpdatePath: function (rec, newName) {
        var me = this,
            path = me.treeGetRecordPyhPath(rec, 'text');

        rec.set('id', path);
        rec.set('rsid', rec.data.rsid.substring(0, rec.data.rsid.indexOf('://') + 3) + path);

        Ext.Array.each(rec.childNodes, function (rec) {
            me.treeUpdatePath(rec);
        });
    },

    onTreeFolderRenamed: function (folderId, newName) {
        var me = this,
            rec = me.treeStore.getNodeById(folderId);

        if (rec)
            me.treeUpdatePath(rec);

        if (me.view.folderId == folderId) {
            var paths = folderId.split('/');
            paths[paths.length - 1] = newName;
            me.view.setFolderId(paths.join('/'));
        }
    }
});