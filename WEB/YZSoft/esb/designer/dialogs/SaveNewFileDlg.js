/*
config:
*/
Ext.define('YZSoft.esb.designer.dialogs.SaveNewFileDlg', {
    extend: 'Ext.window.Window',
    title: RS.$('ESB_NewFileName'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    cls:'yz-window-frame',
    width: 308,
    modal: true,
    resizable: false,
    bodyPadding: '10 26',
    referenceHolder: true,
    defaultFocus: '[defaultfocusfield=true]',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_Save'),
            cls: 'yz-btn-default',
            flex:1,
            handler: function () {
                var reportName = me.getFileName();

                if (!reportName)
                    return;

                var err = $objname(reportName);
                if (err !== true) {
                    YZSoft.alert(err);
                    return;
                }

                me.closeDialog(reportName);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            flex: 1,
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('ESB_SaveDlg_EnterFileName'),
                labelAlign: 'top',
                defaultfocusfield:true,
                reference: 'edtName',
                itemId: 'edtName',
                listeners: {
                    scope: me,
                    change: 'updateStatus'
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    getFileName: function () {
        return Ext.String.trim(this.getReferences().edtName.getValue() || '');
    },

    updateStatus: function () {
        this.btnOK.setDisabled(!this.getFileName());
    }
});