/*
config:
caption
value
*/
Ext.define('YZSoft.src.dialogs.JsonDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 590,
    height: 440,
    minWidth: 590,
    minHeight: 440,
    modal: true,
    maximizable: true,
    bodyPadding: '10 20',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnCheck = Ext.create('Ext.button.Button', {
            text: RS.$('All_Check'),
            handler: function () {
                var json = Ext.String.trim(me.edtJson.getValue());

                //check
                try {
                    Ext.decode(json);
                    YZSoft.alert(RS.$('All_JsonCheckSuccess'), function () {
                        me.edtJson.focus();
                    });
                }
                catch (e) {
                    YZSoft.alert(RS.$('All_JsonCheckFial'), function () {
                        me.edtJson.focus();
                    });
                }
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                var json = Ext.String.trim(me.edtJson.getValue());

                //check
                try {
                    Ext.decode(json);
                    me.closeDialog(json);
                }
                catch (e) {
                    YZSoft.alert(RS.$('All_JsonCheckFial'), function () {
                        me.edtJson.focus();
                    });
                }
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.edtJson = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: config.caption,
            labelAlign: 'top',
            value: config.value || '{\n}'
        });

        cfg = {
            buttons: [me.btnCheck, '->', me.btnCancel, me.btnOK],
            items: [me.edtJson]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.edtJson.focus();
    }
});