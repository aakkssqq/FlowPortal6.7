/*
selection - 结果列表初始值
groupid,
folderType
*/

Ext.define('YZSoft.bpa.src.dialogs.SelSpritesDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpa.src.model.Folder',
        'YZSoft.bpa.src.model.Sprite'
    ],
    title: RS.$('BPA_Title_SelectResponsibility'),
    layout: 'border',
    width: 870,
    height: 530,
    minWidth: 870,
    minHeight: 530,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            root = [],
            folders, cfg;

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

        me.srcStore = Ext.create('Ext.data.JsonStore', {
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

        me.srcGrid = Ext.create('Ext.grid.Panel', Ext.apply({
            title:RS.$('BPA__SelectModule'),
            region: 'east',
            width: 230,
            store: me.srcStore,
            hideHeaders: true,
            split: {
                size: 1
            },
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
            viewConfig: {
                stripeRows: false,
                selectedItemCls: 'yz-grid-item-select-flat'
            },
            columns: {
                items: [
                    { text: '', dataIndex: 'SpriteName', flex: 1, renderer: YZSoft.Render.renderString }
                ]
            }
        }, config.srcGridConfig));

        me.srcPanel = Ext.create('Ext.container.Container', {
            region: 'center',
            cls: 'yz-border',
            layout:'border',
            items: [me.pnlTree, me.srcGrid]
        });

        me.tagStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoload: false,
            model: 'YZSoft.bpa.src.model.Sprite',
            data: config.selection || [],
            listeners: {
                datachanged: function () {
                    me.updateStatus();
                }
            }
        });

        me.tagGrid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-grid-actioncol-hidden',
            store: me.tagStore,
            hideHeaders: true,
            split: {
                size: 4
            },
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true,
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: '', dataIndex: 'SpriteName', flex: 1 },
                    {
                        xtype: 'actioncolumn',
                        width: 38,
                        align: 'center',
                        items: [{
                            glyph: 0xe62b,
                            iconCls: 'yz-action-delete-msel',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.tagGrid.getStore().remove(record);
                            }
                        }]
                    }
                ]
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.tagStore.remove(record);
                },
                selectionchange: function () {
                    me.updateStatus();
                }
            }
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xea4f,
            sm: me.tagGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.tagGrid.canMoveUp());
            },
            handler: function () {
                me.tagGrid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xe601,
            sm: me.tagGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.tagGrid.canMoveDown());
            },
            handler: function () {
                me.tagGrid.moveSelectionDown();
            }
        });

        me.tagPanel = Ext.create('Ext.panel.Panel', {
            title: RS.$('BPA__PreSelections'),
            region: 'east',
            layout: 'fit',
            border: true,
            width: 230,
            header: {
                defaults: {
                    cls: ['yz-btn-flat', 'yz-btn-tool-hot'],
                },
                items: [me.btnMoveUp, me.btnMoveDown]
            },
            items: [me.tagGrid]
        });

        me.optBar = Ext.create('YZSoft.src.toolbar.SelectionOptBar', {
            region: 'east'
        });

        me.selectionManager = Ext.create('YZSoft.src.ux.RecordSelection', {
            srcGrid: me.srcGrid,
            tagGrid: me.tagGrid,
            dragGroup: 'ProcessNode',
            getDragText: function (record) {
                return record.data.SpriteName;
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: true,
            handler: function () {
                var rv = [],
                    store = me.tagStore;

                store.each(function (rec) {
                    rv.push(Ext.apply({}, rec.data));
                });

                me.closeDialog(rv);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.srcPanel, me.optBar, me.tagPanel],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlTree.on({
            scope: me,
            afterrender: 'onTreeAfterRender',
            selectionchange: 'onTreeSelectionChange'
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
                me.srcStore.load({
                    loadMask: false,
                    params: {
                        fileid: record.getId()
                    },
                    callback: function () {
                        me.srcGrid.setTitle(record.data.text);
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

        if (config.selection) {
            me.tagStore.removeAll();
            me.tagGrid.addRecords(config.selection, false);
        }

        me.callParent(arguments);
    },

    updateStatus: function () {
        var me = this;

        me.btnOK.setDisabled(me.tagStore.getCount() == 0);
    }
});