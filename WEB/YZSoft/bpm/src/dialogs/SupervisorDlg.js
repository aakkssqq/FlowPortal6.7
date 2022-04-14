/*
config:
supervisor
*/
Ext.define('YZSoft.bpm.src.dialogs.SupervisorDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 550,
    height: 420,
    modal: true,
    resizable: false,
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            spv = config.supervisor,
            cfg;

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        me.form = Ext.create('Ext.form.Panel', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'displayfield',
                labelSeparator: null,
                value: Ext.String.format('{0}: {1}<br/>{2}',RS.$('All_Supervisor'), spv.UserFullName || spv.UserAccount, spv.MemberFullName),
                margin: '0 0 20 0'
            }, {
                xtype: 'checkbox',
                boxLabel: RS.$('All_OnlyFGBelowYW'),
                name: 'FGYWEnabled',
                margin: 0
            }, {
                xclass: 'YZSoft.bpm.src.editor.YWFGField',
                name: 'FGYWs',
                flex: 1
            }]
        });

        cfg = {
            buttons: [me.btnCancel, me.btnOK],
            items: [me.form]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.fill(spv);
    },

    fill: function (data) {
        this.form.getForm().setValues(data);
    },

    save: function () {
        var rv = this.form.getValuesSubmit();
        return rv;
    }
});