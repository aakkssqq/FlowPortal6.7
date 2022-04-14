/*
title:
inform:{
    title
    msg
}
label:
validateEmpty
*/
Ext.define('YZSoft.bpm.src.dialogs.ConfirmDlg', {
    extend: 'Ext.window.Window', //111111
    requires: [
        'YZSoft.bpm.src.ux.Render'
    ],
    cls: 'yz-window-prompt',
    layout: {
        type:'vbox',
        align:'stretch'
    },
    width: 460,
    modal: true,
    resizable: false,
    border: true,
    bodyPadding: '20 26 0 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.label = Ext.create('Ext.form.Label', {
            padding:'0 0 6px 0',
            text: config.label || 'label'
        });

        me.edtComments = Ext.create('Ext.form.field.TextArea', {
            grow: true,
            growMin: 80,
            growMax: 160,
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.validateEmpty,
            handler: function () {
                me.closeDialog('ok', me.edtComments.getValue());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.informPanel = Ext.create('Ext.Component', {
            cls: 'yz-window-info',
            padding: '0 20 20 26',
            tpl: [
                '<div class="text">{info:text}</div>'
            ],
            data: {
                info: config.info
            }
        });

        cfg = {
            defaultFocus: me.edtComments,
            dockedItems: [me.informPanel],
            items: [me.label, me.edtComments],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    updateStatus: function () {
        if (this.validateEmpty) {
            var comments = Ext.String.trim(this.edtComments.getValue() || '');
            this.btnOK.setDisabled(!comments);
        }
    }
});