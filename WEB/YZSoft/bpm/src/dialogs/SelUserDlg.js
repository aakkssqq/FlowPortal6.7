
Ext.define('YZSoft.bpm.src.dialogs.SelUserDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.panel.SelUserPanel',
        'YZSoft.bpm.src.panel.RecentlyUserPanel',
        'YZSoft.src.button.Button'
    ],
    title: RS.$('All_SelUser'),
    layout: 'fit',
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.srcPanel = Ext.create('YZSoft.bpm.src.panel.SelUserPanel', {
            title: RS.$('All_Org'),
            border: true,
            grid: {
                listeners: {
                    selectionchange: function () {
                        me.updateStatus()
                    },
                    itemdblclick: function (grid, record, item, index, e, eOpts) {
                        me.onOK();
                    }
                }
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                me.onOK();
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            layout: 'fit',
            items: [me.srcPanel],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onOK: function () {
        var me = this,
            recs = me.srcPanel.grid.getSelectionModel().getSelection(),
            users = [];

        if (recs.length != 1)
            return;

        user = recs[0].data;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Employee.ashx'),
            params: {
                method: 'CheckUser',
                count: 1,
                addtoRecently:true,
                uid0: user.Account,
                member0: user.MemberFullName
            },
            success: function (action) {
                me.closeDialog(user);
            },
            failure: function (action) {
                alert(action.result.errorMessage);
            }
        });
    },

    show: function (config) {
        var me = this,
            config = config || {};

        if (config.title)
            me.setTitle(config.title);

        if (config.fn) {
            me.fn = config.fn;
            me.scope = config.scope;
        }

        me.callParent();
    },

    updateStatus: function () {
        var me = this,
            recs = me.srcPanel.grid.getSelectionModel().getSelection();

        me.btnOK.setDisabled(recs.length != 1);
    }
});
