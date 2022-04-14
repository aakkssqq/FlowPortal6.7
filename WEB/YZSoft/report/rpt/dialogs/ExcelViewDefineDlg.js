/*
config
property
    columns
*/

Ext.define('YZSoft.report.rpt.dialogs.ExcelViewDefineDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 698,
    height: 400,
    modal: true,
    resizable: false,
    bodyPadding: '50 26 20 26',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Report_ViewName'),
            name: 'ViewName',
            width: 300
        });

        me.edtTemplateFile = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_ExcelTemplate'),
            name: 'TemplateFile'
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog(me.save());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        me.form = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'vbox'
            },
            defaults: {
                width: '100%'
            },
            items: [
                me.edtName,
                me.edtTemplateFile
            ]
        });

        cfg = {
            items: [me.form],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.value)
            me.fill(config.value);

        me.relayEvents(me.edtName, ['change'], 'item');
        me.relayEvents(me.edtTemplateFile, ['change'], 'item');

        me.on({
            scope: me,
            itemChange: 'updateStatus'
        });

        me.updateStatus();
    },

    fill: function (data) {
        this.form.getForm().setValues(data);
    },

    save: function () {
        return this.form.getValuesSubmit();
    },

    updateStatus: function () {
        var me = this,
            value = me.save();

        me.btnOK.setDisabled(
            !value.ViewName ||
            !value.TemplateFile
        );
    }
});