/*
getRootOUsType
srcoupath
*/
Ext.define('YZSoft.bpm.src.dialogs.SelOUDlg', {
    extend: 'Ext.window.Window', //111111
    title: RS.$('All_SelOU'),
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

        me.tree = Ext.create('YZSoft.bpm.src.tree.OrgTree', {
            title: RS.$('All_SelOU'),
            getRootOUsType: config.getRootOUsType,
            srcoupath: config.srcoupath,
            margins: '0 0 0 0',
            border: true,
            viewConfig: {
                toggleOnDblClick: false
            },
            listeners: {
                itemdblclick: function (tree, record, item, index, e, eOpts) {
                    me.closeDialog(record);
                }
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            store: me.tree.store,
            sm: me.tree.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(me.tree.getSelectionModel().getSelection().length != 1);
            },
            handler: function () {
                var recs = me.tree.getSelectionModel().getSelection();

                if (recs.length != 1)
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

    closeDialog: function (rec) {
        var data = rec.data.data;
        data.phyPath = rec.getPath('text');
        this.callParent([data]);
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
