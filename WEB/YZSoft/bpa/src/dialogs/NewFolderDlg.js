/*
config:
caption
value
*/
Ext.define('YZSoft.bpa.src.dialogs.NewFolderDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('All_NewFolder'),
    layout: 'fit',
    cls:'yz-window-frame',
    width: 300,
    modal: true,
    resizable: false,
    bodyPadding: '20 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var name = Ext.String.trim(me.edtName.getValue() || '');
                me.closeDialog(name);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_FolderName'),
            labelAlign:'top',
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        });

        cfg = {
            defaultFocus: me.edtName,
            buttons: [me.btnOK, me.btnCancel],
            items: [me.edtName]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.edtName.selectText();
    },

    updateStatus: function () {
        var me = this,
            name = Ext.String.trim(me.edtName.getValue() || '');

        me.btnOK.setDisabled(!name);
    }
});