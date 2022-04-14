Ext.define('YZSoft.src.model.DeletedFolderObject', {
    extend: 'Ext.data.Model',
    idProperty: 'ObjectID',
    fields: [
    ],

    isFolder: function () {
        return this.data.FileID ? false : true;
    },

    isFile: function () {
        return this.data.FileID ? true : false;
    }
});