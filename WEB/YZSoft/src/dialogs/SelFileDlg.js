/*
    libType
*/

Ext.define('YZSoft.src.dialogs.SelFileDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.src.model.Folder',
        'YZSoft.src.model.Document',
        'YZSoft.src.ux.File'
    ],
    layout: 'border',
    width: 818,
    height: 515,
    minWidth: 818,
    minHeight: 515,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},        
            root = [],
            folders,cfg;


        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
            params: {
                method: 'GetRootFolders',
                libType: config.libType
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
            model: 'YZSoft.src.model.Folder',
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
            model: 'YZSoft.src.model.Document',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolderDocuments',
                    file: true
                }
            }
        });

        me.fileGrid = Ext.create('Ext.grid.Panel', Ext.apply({
            region: 'center',
            border: true,
            store: me.fileStore,
            viewConfig: {
                stripeRows: false
            },
            columns: {
                items: [
                    { text: RS.$('All_Title'), dataIndex: 'Name', flex: 1, renderer: me.renderFileName },
                    { text: RS.$('All_Creator'), dataIndex: 'CreatorShortName', width: 100, align: 'center', renderer: YZSoft.Render.renderString },
                    { text: RS.$('All_CreateAt'), dataIndex: 'AddAt', width: 100, align: 'center', renderer: YZSoft.Render.renderDateYMD },
                    { text: RS.$('All_FileSize'), hidden:true, dataIndex: 'Size', width: 60, align: 'right', scope: me, renderer: me.renderFileSize },
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

        cfg = {
            items: [me.pnlTree, me.fileGrid],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlTree.on({
            scope: me,
            selectionchange: 'onTreeSelectionChange'
        });

        me.fileGrid.on({
            scope: me,
            selectionchange: 'updateStatus',
            itemdblclick: function (grid, record, item, index, e, eOpts) {
                me.closeDialog(Ext.apply({}, record.data));
            }
        });
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

    renderFileName: function (value, metaData, record) {
        return Ext.String.format('<image src="{0}" class="yz-grid-img-filetype-small" /><span class="text">{1}</span>',
            YZSoft.src.ux.File.getIconByExt(record.data.Ext),
            YZSoft.HttpUtility.htmlEncode(value));
    },

    renderFileSize: function (value, metaData, record) {
        return value.toFileSize();
    },

    updateStatus: function () {
        var me = this,
            sm = me.fileGrid.getSelectionModel(),
            recs = sm.getSelection();

        me.btnOK.setDisabled(recs.length == 0);
    }
});