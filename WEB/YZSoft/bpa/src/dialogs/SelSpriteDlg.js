/*
selection - 结果列表初始值
groupid,
folderType
*/

Ext.define('YZSoft.bpa.src.dialogs.SelSpriteDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpa.src.model.Folder',
        'YZSoft.bpa.src.model.Sprite'
    ],
    title: RS.$('BPA__SelectSprite'),
    layout: 'border',
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    modal: true,
    buttonAlign: 'right',

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
                expanded: true,
                path: folder.FolderID
            });
        });

        me.treeStore = Ext.create('Ext.data.TreeStore', Ext.apply({
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
                expanded: true,
                children: root
            }
        }, config.storeConfig));

        me.pnlTree = Ext.create('Ext.tree.Panel', Ext.apply({
            region: 'center',
            cls: 'yz-border',
            store: me.treeStore,
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

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoload: false,
            model: 'YZSoft.bpa.src.model.Sprite',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/Library.ashx'),
                extraParams: {
                    method: 'GetFileSprites'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'east',
            cls: 'yz-border',
            width: 270,
            store: me.store,
            hideHeaders: true,
            split: {
                size: 6
            },
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: false
            },
            columns: {
                items: [
                    { text: '', dataIndex: 'SpriteName', flex: 1, renderer: YZSoft.Render.renderString }
                ]
            }
        }, config.gridConfig));

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var sm = me.grid.getSelectionModel(),
                    recs = sm.getSelection(),
                    rec = recs[0];

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
            items: [me.pnlTree, me.grid],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlTree.on({
            scope: me,
            afterrender: 'onTreeAfterRender',
            selectionchange: 'onTreeSelectionChange'
        });

        me.grid.on({
            scope: me,
            selectionchange: 'updateStatus',
            itemdblclick: function (grid, record, item, index, e, eOpts) {
                me.closeDialog(Ext.apply({}, record.data));
            }
        });
    },

    onTreeAfterRender: function (tree, eOpts) {
        var me = this,
            root = tree.getRootNode(),
            child = root.firstChild,
            sm = tree.getSelectionModel(),
            view = tree.getView();

        if (child) {
            child.expand(false, function () {
                view.refresh();

                var rec = child.findChildBy(function (rec) {
                    return rec.isLeaf() ? true : null;
                }, me, true);

                tree.expandTo(rec || child);
            });
        }
    },

    onTreeSelectionChange: function (sm, selected, eOpts) {
        var me = this;

        if (selected.length >= 1) {
            var record = selected[0];

            if (record.data.leaf && record.data.fileid) {
                me.store.load({
                    loadMask: false,
                    params: {
                        fileid: record.getId()
                    }
                });
            }
        }
    },

    show: function (config) {
        var me = this;

        config = config || {};

        if (config.title)
            me.setTitle(config.title);

        if (config.fn) {
            me.fn = config.fn;
            me.scope = config.scope;
        }

        me.callParent(arguments);
    },

    updateStatus: function () {
        var me = this,
            sm = me.grid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnOK.setDisabled(recs.length == 0);
    }
});