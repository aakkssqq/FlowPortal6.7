
/*
messageCatFieldConfig
*/

Ext.define('YZSoft.bpm.src.dialogs.MessageSettingDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 917,
    height: 612,
    minWidth: 917,
    minHeight: 612,
    modal: true,
    maximizable: true,
    bodyPadding: '5 20 8 20',
    buttonAlign:'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            messageItems = config.messageItems,
            cfg;

        me.edtMessageCat = Ext.create('YZSoft.bpm.src.editor.MessageCatField', Ext.apply({
        }, config.messageCatFieldConfig));

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: config.btnText || RS.$('All_OK'),
            cls:'yz-btn-default',
            handler: function () {
                var data = me.edtMessageCat.getValue();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            scope: this,
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.edtMessageCat],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.edtMessageCat.setValue(messageItems);
    }
});