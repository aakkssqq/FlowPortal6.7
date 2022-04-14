/*
config:
*/
Ext.define('YZSoft.bpm.process.admin.SaveNewProcessDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('Process_PublishDlg_Title'),
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
    defaultFocus: 'edtName',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_Publish'),
            cls: 'yz-btn-default',
            flex:1,
            handler: function () {
                var processName = me.getProcessName();

                if (!processName)
                    return;

                var err = $objname(processName);
                if (err !== true) {
                    YZSoft.alert(err);
                    return;
                }

                me.closeDialog(processName);
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
                fieldLabel: RS.$('Process_EnterProcessName'),
                labelAlign: 'top',
                reference: 'edtName',
                itemId: 'edtName',
                value: config.processName,
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

    getProcessName: function () {
        return Ext.String.trim(this.getReferences().edtName.getValue() || '');
    },

    updateStatus: function () {
        this.btnOK.setDisabled(!this.getProcessName());
    }
});