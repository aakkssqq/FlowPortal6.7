/*
config
*/

Ext.define('YZSoft.bpa.src.dialogs.SelCategoriesDlg', {
    extend: 'Ext.window.Window', //111111
    title: RS.$('BPA_Title_SelCategories'),
    layout: 'fit',
    width: 480,
    height: 580,
    modal: true,
    resizable: false,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'Ext.data.TreeModel',
            root: {
                expanded: true,
                children: config.categroies
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            store: me.store,
            cls: ['yz-border', 'yz-tree-spritecategory'],
            hideHeaders: true,
            rootVisible: false,
            scrollable: 'y',
            viewConfig: {
                loadMask: false
            },
            listeners: {
                itemclick: function (tree, record, item, index, e, eOpts) {
                    if (!e.getTarget('.x-tree-checkbox'))
                        me.checkRecord(record, !record.data.checked);

                    me.updateStatus();
                },
                beforeitemdblclick: function () {
                    return false;
                }
            }
        });

        me.setSelection(config.selection);

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: true,
            handler: function () {
                var recs = me.getSelection();
                if (recs.length != 0)
                    me.closeDialog(me.getCategories(recs));
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

        me.updateStatus();
    },

    updateStatus: function () {
        var me = this,
            recs = me.getSelection();

        me.btnOK.setDisabled(recs.length == 0);
    },

    getSelection: function () {
        var me = this,
            rv = [];

        me.tree.getRootNode().eachChild(function (level1rec) {
            if (level1rec.data.checked) {
                rv.push(level1rec);
            }
            else {
                level1rec.eachChild(function (level2rec) {
                    if (level2rec.data.checked)
                        rv.push(level2rec);
                });
            }
        });

        return rv;
    },

    setSelection: function (selection) {
        var me = this;

        me.tree.getRootNode().eachChild(function (level1rec) {
            if (Ext.Array.contains(selection, level1rec.data.category)) {
                me.checkRecord(level1rec, true);
            }
            else {
                level1rec.eachChild(function (level2rec) {
                    if (Ext.Array.contains(selection, level2rec.data.category)) {
                        me.checkRecord(level2rec, true);
                    }
                });
            }
        });
    },

    checkRecord: function (rec, checked) {
        rec.set('checked', checked);
        rec.eachChild(function (childrec) {
            childrec.set('checked', checked);
        });
    },

    getCategories: function (recs) {
        var rv = [];
        Ext.each(recs, function (rec) {
            rv.push(rec.data.category);
        });
        return rv;
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