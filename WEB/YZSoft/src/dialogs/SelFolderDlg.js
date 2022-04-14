/*
storeConfig
folderid
excludeFolderIds
*/
Ext.define('YZSoft.src.dialogs.SelFolderDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpa.src.model.Folder'
    ],
    title: RS.$('All_SelOU'),
    layout: 'fit',
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',
    excludeModel: 'moveFolderExclude',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', Ext.apply({
            autoLoad: false,
            model: 'YZSoft.bpa.src.model.Folder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/FileSystem.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    expand: false
                }
            },
            root: {
                text: 'root',
                path: config.folderid
            }
        }, config.storeConfig));

        me.tree = Ext.create('Ext.tree.Panel', {
            title: RS.$('All_Category'),
            border: true,
            store: me.store,
            rootVisible: true,
            useArrows: true,
            hideHeaders: true,
            viewConfig: {
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.store.load({
                        loadMask: true
                    });
                }
            }]
        });

        me.tree.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    store = this.getStore(),
                    sm = this.getSelectionModel();

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
                this.setDisabled(recs.length != 1 || me[me.excludeModel](recs));
            },
            handler: function () {
                var recs = me.tree.getSelectionModel().getSelection();

                if (recs.length != 1 || me[me.excludeModel](recs))
                    return;

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
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    moveFolderExclude: function (recs) {
        return recs[0].isChildOfFolder(this.excludeFolderIds || []);
    },

    moveFileExclude: function (recs) {
        return Ext.Array.contains(this.excludeFolderIds || [], recs[0].getId());
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
