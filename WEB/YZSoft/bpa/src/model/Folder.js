Ext.define('YZSoft.bpa.src.model.Folder', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'path',
    fields: [
        { name: 'isFile' }
    ],

    getRsid: function () {
        return 'FileSystemFolder://' + this.getId();
    },

    isCategoryFolder: function () {
        var me = this;

        if (!me.parentNode)
            return false;

        return me.parentNode.isRoot();
    },

    isPreventDrag: function () {
        var me = this;

        return me.isRoot() || me.isCategoryFolder();
    },

    isPreventDrop: function (records, position, dragData, e, eOpts) {
        var me = this;

        if (me.isCategoryFolder() && position != 'append')
            return true;

        return Ext.Array.findBy(records, function (rec) {
            return rec.data.FolderType != me.data.FolderType;
        });
    },

    getCategoryRecord: function () {
        var rec = this;

        while (!rec.isRoot() && !rec.isCategoryFolder()) {
            rec = rec.parentNode;
        }

        return rec;
    },

    isChildOfFolder: function (folderid) {
        var rec = this,
            ids = Ext.isArray(folderid) ? folderid : [folderid];

        while (true) {
            if (Ext.Array.contains(ids, rec.getId()))
                return true;

            if (rec.isRoot())
                break;

            rec = rec.parentNode;
        }

        return false;
    }
});