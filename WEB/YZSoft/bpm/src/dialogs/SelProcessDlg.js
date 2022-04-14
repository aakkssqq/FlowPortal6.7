/*
bpmServer
*/

Ext.define('YZSoft.bpm.src.dialogs.SelProcessDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.model.ProcessInfo'
    ],
    layout: 'fit',
    width: 750,
    height: 500,
    minWidth: 750,
    minHeight: 500,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.srcPanel = Ext.create('YZSoft.bpm.src.panel.SelProcessPanel', {
            title: RS.$('All_ProcessLib'),
            border: true,
            bpmServer: config.bpmServer,
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
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            title: RS.$('All_SelProcess') + (config.bpmServer ? ' - ' + config.bpmServer : ''),
            items: [me.srcPanel],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onOK: function () {
        var me = this,
            recs = me.srcPanel.grid.getSelectionModel().getSelection();

        if (recs.length != 1)
            return;

        me.closeDialog(recs[0].data);
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

        me.btnOK.setDisabled(recs.length == 0);
    }
});