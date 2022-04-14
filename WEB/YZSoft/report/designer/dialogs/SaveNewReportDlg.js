/*
config:
*/
Ext.define('YZSoft.report.designer.dialogs.SaveNewReportDlg', {
    extend: 'Ext.window.Window',
    title: RS.$('ReportDesigner_Save'),
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
            text: RS.$('All_Save'),
            cls: 'yz-btn-default',
            flex:1,
            handler: function () {
                var reportName = me.getReportName();

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
                fieldLabel: RS.$('ReportDesigner_Warn_ReportName_Empty'),
                labelAlign: 'top',
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

    getReportName: function () {
        return Ext.String.trim(this.getReferences().edtName.getValue() || '');
    },

    updateStatus: function () {
        this.btnOK.setDisabled(!this.getReportName());
    }
});