/*
zone
excludefolder
perm,
cancopy
*/
Ext.define('YZSoft.bpm.src.dialogs.SelStoreFolderDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.StoreFolder'
    ],
    title: RS.$('All_SelectFolder'),
    layout: 'fit',
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',
    rootTexts: {
        Process: RS.$('All_ProcessLib'),
        Form: RS.$('All_FormLib'),
        Reports: RS.$('All_ReportLib'),
        ExtServer: RS.$('All_ExtServerLib'),
        FormService: RS.$('All_FormServiceLib')
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            excludefolder = config.excludefolder = Ext.isArray(config.excludefolder) ? config.excludefolder : [config.excludefolder || ''],
            cancopy = config.cancopy = config.cancopy === false ? false:true,
            perm = config.perm,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', Ext.apply({
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.StoreFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/StoreService.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    zone: config.zone,
                    perm: config.perm,
                    expand: false
                }
            }
        }, config.store));

        me.tree = Ext.create('Ext.tree.Panel', {
            title: RS.$('All_Category'),
            region: 'center',
            border: true,
            hideHeaders: true,
            rootVisible: true,
            useArrows: true,
            store: me.store,
            root: {
                text: me.rootTexts[config.zone] || RS.$('All_Root'),
                path: 'root',
                expanded: false
            },
            viewConfig: {
                toggleOnDblClick: false
            },
            tools: [{
                type: 'refresh',
                handler: function (event, toolEl, panel) {
                    me.store.load({
                        loadMask: true
                    });
                }
            }],
            listeners: {
                itemdblclick: function (tree, record, item, index, e, eOpts) {
                    if (!me.canSelect(record))
                        return;

                    me.closeDialog(record);
                }
            }
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

        me.chkCopy = Ext.create('Ext.form.field.Checkbox', {
            margin: '0 0 0 6px',
            hidden: !cancopy,
            boxLabel: RS.$('All_Chk_CopyFile')
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.tree.store,
            sm: me.tree.getSelectionModel(),
            updateStatus: function () {
                var recs = me.tree.getSelectionModel().getSelection(),
                    disabled = false;

                if (!disabled && recs.length != 1)
                    disabled = true;

                if (!disabled && !me.canSelect(recs[0]))
                    disabled = true;

                this.setDisabled(disabled);
            },
            handler: function () {
                var recs = me.tree.getSelectionModel().getSelection();

                if (recs.length != 1)
                    return;

                if (!me.canSelect(recs[0]))
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
            buttons: [me.chkCopy, '->', me.btnCancel, me.btnOK],
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    canSelect: function (rec) {
        var me = this,
            path = rec.data.path,
            path = path == 'root' ? '' : path;

        return !Ext.Array.contains(me.excludefolder, path);
    },

    closeDialog: function (rec) {
        this.callParent([rec, this.cancopy ? this.chkCopy.checked:false]);
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
