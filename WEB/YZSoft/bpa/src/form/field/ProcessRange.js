/*
groupid,
folderType
*/

Ext.define('YZSoft.bpa.src.form.field.ProcessRange', {
    extend: 'Ext.form.FieldContainer',
    requires: [
        'YZSoft.bpa.src.model.Folder'
    ],
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            folders,
            root = [];

        config = config || {};

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
            params: {
                method: 'GetRootFolders',
                groupid: config.groupid,
                folderType: config.folderType
            },
            success: function (action) {
                folders = action.result;
            }
        });

        Ext.each(folders, function (folder) {
            root.push({
                text: folder.Name,
                expandable: true,
                expanded: false,
                path: folder.FolderID
            });
        });

        me.store = Ext.create('Ext.data.TreeStore', Ext.apply({
            autoLoad: false,
            model: 'YZSoft.bpa.src.model.Folder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    file: true,
                    iconFromExt: true,
                    expand: false
                }
            },
            root: {
                expanded: false,
                children: root
            }
        }, config.storeConfig));

        me.tree = Ext.create('Ext.tree.Panel', Ext.apply({
            store: me.store,
            useArrows: true,
            border: true,
            hideHeaders: true,
            viewConfig: {
                loadMask: false,
                rootVisible: false
            },
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1
            }]
        }, config.treeConfig));

        var cfg = {
            layout: 'fit',
            items: [me.tree]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.tree.on({
            scope: me,
            afterrender: 'onTreeAfterRender',
            selectionchange: 'onTreeSelectionChange'
        });
    },

    getValue: function () {
        var me = this,
            sm = me.tree.getSelectionModel(),
            recs = sm.getSelection(),
            rec = recs[0];

        return rec && rec.data;
    },

    onTreeAfterRender: function (tree, eOpts) {
        var me = this,
            root = tree.getRootNode();

        root.expand(true);
    },

    onTreeSelectionChange: function (sm, selected, eOpts) {
        var me = this;
        me.fireEvent('change');
    }
});