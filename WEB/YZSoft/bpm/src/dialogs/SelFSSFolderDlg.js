/*
config
serverName
*/

Ext.define('YZSoft.bpm.src.dialogs.SelFSSFolderDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.Folder'
    ],
    title: RS.$('All_SelFolder'),
    layout: 'fit',
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.Folder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/FileStoreServer.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    serverName: config.serverName
                }
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            title: RS.$('All_Category'),
            hideHeaders: true,
            border: true,
            store: me.store,
            useArrows: true,
            root: {
                text: config.serverName,
                path: 'root',
                glyph: 0xeaf2,
                expanded: false
            },
            viewConfig: {
                loadMask: false
            },
            listeners: {
                scope: me,
                itemdblclick: function (tree, record, item, index, e, eOpts) {
                    if (!record.isRoot())
                        me.closeDialog(record);
                }
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.store.load({});
                }
            }]
        });

        me.tree.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    store = this.getStore();

                store.load({
                    loadMask: $S.loadMask.first.loadMask,
                    callback: function () {
                        root.expand(false);
                    }
                });
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.tree.store,
            sm: me.tree.getSelectionModel(),
            updateStatus: function () {
                var recs = me.tree.getSelectionModel().getSelection();
                this.setDisabled(!(recs.length == 1 && !recs[0].isRoot()));
            },
            handler: function () {
                var recs = me.tree.getSelectionModel().getSelection();

                if (recs.length != 1)
                    return;

                if (!recs[0].isRoot())
                    me.closeDialog(recs[0]);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.tree],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    show: function (config) {
        config = config || {};

        if (config.title)
            this.setTitle(config.title);

        if (config.fn) {
            this.fn = config.fn;
            this.scope = config.scope;
        }

        this.callParent();
    }
});
