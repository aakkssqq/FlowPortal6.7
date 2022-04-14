/*
config
    params
    srcParams
    fill
*/

Ext.define('YZSoft.report.rpt.dialogs.ParamsFillDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('All_ParamsTranslate'),
    layout: 'fit',
    width: 625,
    height: 465,
    minWidth: 625,
    minHeight: 465,
    modal: true,
    maximizable: true,
    bodyPadding: '20 20 10 20',
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.editor = Ext.create('YZSoft.report.rpt.editor.ParamsFillField', {
            params: config.params,
            srcParams: config.srcParams,
            value: config.fill
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            handler: function () {
                me.closeDialog(me.editor.getValue());
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.editor],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});