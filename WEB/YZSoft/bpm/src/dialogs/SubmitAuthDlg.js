/*
config:
    actionName
*/
Ext.define('YZSoft.bpm.src.dialogs.SubmitAuthDlg', {
    extend: 'Ext.window.Window', //222222
    requires: [
    ],
    title: RS.$('All_SubmitAuth_Title'),
    cls: 'yz-window-prompt',
    layout: {
        type: 'vbox',
        align:'stretch'
    },
    width: 410,
    modal: true,
    resizable: false,
    bodyPadding: '15 26 5 26',
    buttonAlign:'right',
    referenceHolder: true,
    defaultFocus: 'pwd',  //*****defaultFocus

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
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

        me.informPanel = Ext.create('Ext.Component', {
            cls: 'yz-window-info',
            padding: '0 20 20 26',
            tpl: [
                '<div class="text">{info:text}</div>'
            ],
            data: {
                info: Ext.String.format(RS.$('All_SubmitAuth_Msg'), config.actionName)
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            dockedItems: [me.informPanel],
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_SubmitAuth_EnterPwd'),
                itemId: 'pwd',  //*****defaultFocus
                labelAlign: 'top',
                reference: 'edtPassword',
                inputType: 'password',
                listeners1: {
                    scope: me,
                    specialkey: function (f, e) {
                        if (e.getKey() == e.ENTER)
                            me.onOK();
                    }
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onOK: function () {
        var me = this,
            refs = me.getReferences(),
            pwd = refs.edtPassword.getValue();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Form.ashx'),
            params: {
                Method: 'SubmitAuth',
                Password: pwd
            },
            success: function (action) {
                if (!action.result.pass) {
                    refs.edtPassword.focus(true, 10); //***** focus and select text
                    me.shake({
                        direction: 'x',
                        shakes: 3,
                        excitement: 1
                    });
                    return;
                }

                me.closeDialog();
            }
        });
    }
});