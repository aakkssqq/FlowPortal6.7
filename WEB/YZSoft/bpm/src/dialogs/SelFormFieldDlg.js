/*
config
tables
*/

Ext.define('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
    extend: 'Ext.window.Window', //111111
    title: RS.$('All_SelFormField'),
    layout: 'fit',
    width: 525,
    height: 580,
    minWidth: 525,
    minHeight: 580,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            tables = [],
            cfg;

        Ext.each(config.tables || [], function (table) {
            tables.push([
                table.DataSourceName,
                table.TableName
            ]);
        });

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'Ext.data.TreeModel',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
                extraParams: {
                    method: 'GetTreeOfTables',
                    tables: Ext.encode(tables)
                }
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            title: RS.$('All_FormField'),
            hideHeaders: true,
            border: true,
            store: me.store,
            rootVisible: false,
            useArrows: true,
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
                    if (record.isLeaf())
                        me.closeDialog(record.data.data);
                }
            }
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
                this.setDisabled(recs.length != 1 || !recs[0].isLeaf());
            },
            handler: function () {
                var recs = me.tree.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.closeDialog(recs[0].data.data);
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
