/*
selection - 结果列表初始值
groupid,
folderType
ext
*/

Ext.define('YZSoft.bpa.src.dialogs.SelFileDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpa.src.model.Folder',
        'YZSoft.bpa.src.model.FolderObject',
        'YZSoft.src.ux.File'
    ],
    layout: 'border',
    width: 818,
    height: 515,
    minWidth: 818,
    minHeight: 515,
    modal: true,

    constructor: function (config) {
        var me = this,
            config = config || {},
            root = [],
            folders, clearButton;


        clearButton = config.clearButton || { hidden: true };

        if (clearButton === true) {
            clearButton = {
                text: RS.$('All_ClearEmpty')
            };
        }
        else if (Ext.isString(clearButton)) {
            clearButton = {
                text: clearButton
            };
        }

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

        me.treeStore = Ext.create('Ext.data.TreeStore', Ext.apply({
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
            region: 'west',
            width: 320,
            cls: 'yz-border',
            store: me.treeStore,
            useArrows: true,
            hideHeaders: true,
            split: {
                size: 4
            },
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

        me.fileStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoload: false,
            model: 'YZSoft.bpa.src.model.FolderObject',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolderObjects',
                    ext: config.ext,
                    folder: false,
                    file: true,
                    userName: true
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.fileGrid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'center',
            store: me.fileStore,
            border: true,
            hideHeaders: false,
            viewConfig: {
                stripeRows: false
            },
            columns: {
                items: [
                    { text: RS.$('All_FileName'), dataIndex: 'Name', flex: 1, renderer: me.renderFileName },
                    { text: RS.$('All_Creator'), dataIndex: 'OwnerDisplayName', width: 100, renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_CreateAt'), dataIndex: 'AddAt', width: 100, renderer: YZSoft.Render.renderDateYMD }
                ]
            }
        }, config.fileGridConfig));

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var sm = me.fileGrid.getSelectionModel(),
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

        me.btnClear = Ext.create('YZSoft.src.button.Button', Ext.apply({
            handler: function () {
                me.closeDialog({
                    FileID:'',
                    Name:''
                });
            }},clearButton)
        );

        cfg = {
            items: [me.pnlTree, me.fileGrid, me.tagGrid],
            buttons: [me.btnClear, '->', me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlTree.on({
            scope: me,
            selectionchange: 'onTreeSelectionChange'
        });

        //无子目录时，根目录不显示的问题
        Ext.Array.each(me.pnlTree.getRootNode().childNodes, function (node) {
            node.expand(false);
        });

        me.fileGrid.on({
            scope: me,
            selectionchange: 'updateStatus',
            itemdblclick: function (grid, record, item, index, e, eOpts) {
                me.closeDialog(Ext.apply({}, record.data));
            }
        });
    },

    renderFileName: function (value, metaData, record) {
        return Ext.String.format('<image src="{0}" class="yz-grid-img-filetype-small" /><span class="text">{1}</span>',
            YZSoft.src.ux.File.getIconByExt(record.data.Ext),
            YZSoft.HttpUtility.htmlEncode(value));
    },

    onTreeSelectionChange: function (sm, selected, eOpts) {
        var me = this;

        if (selected.length >= 1) {
            var record = selected[0];

            me.fileStore.load({
                loadMask: false,
                params: {
                    folderid: record.getId()
                }
            });
        }
    },

    show: function (config) {
        var me = this;

        config = config || {};

        if (config.title)
            this.setTitle(config.title);

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
        var me = this,
            sm = me.fileGrid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnOK.setDisabled(recs.length == 0);
    }
});