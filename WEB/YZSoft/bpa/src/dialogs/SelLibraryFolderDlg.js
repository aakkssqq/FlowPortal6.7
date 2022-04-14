/*
folderType
*/

Ext.define('YZSoft.bpa.src.dialogs.SelLibraryFolderDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpa.src.model.Folder'
    ],
    layout: 'fit',
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign:'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            root = [],
            folders,cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
            params: {
                method: 'GetRootFolders',
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
                    file: false,
                    iconFromExt: true,
                    expand: false
                }
            },
            root: {
                expanded: true,
                children: root
            }
        }, config.storeConfig));

        me.pnlTree = Ext.create('Ext.tree.Panel', Ext.apply({
            title:RS.$('BPA_Title_SelLibraryTree'),
            border: true,
            store: me.store,
            useArrows: true,
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

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var sm = me.pnlTree.getSelectionModel(),
                    recs = sm.getSelection(),
                    rec = recs && recs[0];

                if (rec)
                    me.closeDialog(Ext.apply({}, rec.data));
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.pnlTree],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlTree.on({
            scope: me,
            selectionchange:'updateStatus',
            itemdblclick: function (view, record, item, index, e, eOpts) {
                me.closeDialog(Ext.apply({}, record.data));
            }
        });

        //无子目录时，根目录不显示的问题
        Ext.Array.each(me.pnlTree.getRootNode().childNodes, function (node) {
            node.expand(false);
        });
    },

    updateStatus: function () {
        var me = this,
            sm = me.pnlTree.getSelectionModel(),
            recs = sm.getSelection();

        me.btnOK.setDisabled(recs.length == 0);
    }
});