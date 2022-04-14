Ext.define('YZSoft.src.model.Folder', {
    extend: 'Ext.data.TreeModel',
    idProperty: 'path',
    fields: [
        { name: 'isFile' }
    ],

    getRsid: function () {
        return 'FileSystemFolder://' + this.getId();
    },

    isPreventDrag: function () {
        return this.isRoot();
    },

    isPreventDrop: function (records, position, dragData, e, eOpts) {
        if (this.isRoot() && position != 'append')
            return true;
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