/*
config
    params
    value
*/

Ext.define('YZSoft.src.datasource.dialogs.ExecuteParamsDialog', {
    extend: 'Ext.window.Window',
    title: RS.$('All_Parameter'),
    layout: 'fit',
    width: 540,
    height: 380,
    minWidth: 400,
    minHeight: 300,
    modal: true,
    bodyPadding: '20 20 10 20',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.editor = Ext.create('YZSoft.src.datasource.field.ExecuteParams', {
            params: config.params,
            value: config.value
        });

        me.btnExecute = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Run'),
            cls:'yz-btn-default',
            handler: function () {
                me.closeDialog(me.editor.getValue());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.editor],
            buttons: [me.btnCancel, me.btnExecute]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});