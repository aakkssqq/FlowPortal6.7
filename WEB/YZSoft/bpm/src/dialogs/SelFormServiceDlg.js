/*
config
treePerm
listPerm
*/

Ext.define('YZSoft.bpm.src.dialogs.SelFormServiceDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.Folder',
        'YZSoft.bpm.src.model.FormServiceInfo'
    ],
    title: RS.$('All_SelFormService'),
    layout: 'border',
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    modal: true,
    buttonAlign: 'right',
    treePerm: 'Read',
    listPerm: 'Read',

    constructor: function (config) {
        var me = this,
            config = config || {},
            treePerm = config.treePerm || me.treePerm,
            listPerm = config.listPerm || me.listPerm,
            cfg;

        me.treestore = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.Folder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/FormService.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    perm: treePerm,
                    expand: true
                }
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            title: RS.$('All_Category'),
            region: 'center',
            border: true,
            hideHeaders: true,
            rootVisible: true,
            useArrows: true,
            store: me.treestore,
            root: {
                text: RS.$('All_FormApplicationLib'),
                path: 'root',
                expanded: false
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.treestore.load({
                        loadMask: true
                    });
                }
            }],
            listeners: {
                selectionchange: function (sm, selected, eOpts) {
                    var rec = selected[0];
                    if (selected.length >= 1) {
                        me.grid.setTitle(selected[0].data.text);
                        me.store.load({
                            params: {
                                path: rec.isRoot() ? '' : rec.data.path
                            }
                        });
                    }
                }
            }
        });

        me.tree.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    store = this.getStore(),
                    sm = this.getSelectionModel();

                sm.select(root);
                store.load({
                    loadMask: $S.loadMask.first.loadMask,
                    callback: function () {
                        root.expand(false);
                    }
                });
            }
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.FormServiceInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/FormService.ashx'),
                extraParams: {
                    method: 'GetAppsInFolder',
                    perm: listPerm
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            title: RS.$('All_FormApplicationLib'),
            region: 'east',
            border: true,
            hideHeaders: true,
            width: 270,
            store: me.store,
            split: { size: 6 },
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: false,
                loadMask: false
            },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: '', dataIndex: 'Name', flex: 1 }
                ]
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.closeDialog(record.data);
                }
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.closeDialog(recs[0].data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.tree, me.grid],
            buttons: [me.btnCancel, me.btnOK]
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