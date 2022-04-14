/*
config:
caption
value
*/
Ext.define('YZSoft.src.dialogs.UrlDlg', {
    extend: 'Ext.window.Window', //222222
    cls: 'yz-window-frame',
    layout: 'fit',
    width: 360,
    modal: true,
    resizable: false,
    bodyPadding: '20 20 30 20',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var url = Ext.String.trim(me.edtUrl.getValue() || '');
                me.closeDialog(url);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.edtUrl = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Url'),
            labelAlign: 'top',
            value: 'http://',
            listeners: {
                scope: me,
                change: 'updateStatus'
            }
        });

        cfg = {
            buttons: [me.btnCancel, me.btnOK],
            items: [me.edtUrl],
            defaultFocus: me.edtUrl
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var len = me.edtUrl.getValue().length;
        me.edtUrl.selectText(len, len);
    },

    updateStatus: function () {
        var me = this,
            name = Ext.String.trim(me.edtUrl.getValue() || '');

        me.btnOK.setDisabled(!name);
    }
});