/*
config:
processName
version
*/
Ext.define('YZSoft.bpm.process.admin.SaveProcessDlg', {
    extend: 'Ext.window.Window', //222222
    title: RS.$('Process_PublishDlg_Title'),
    layout: {
        type: 'vbox',
        align: 'middle'
    },
    width: 308,
    modal: true,
    resizable: false,
    bodyPadding: '10 26',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnSave = Ext.create('Ext.button.Button', {
            text: RS.$('Process_Publish_Overwrite'),
            cls: 'yz-btn-default',
            flex: 1,
            handler: function () {
                me.closeDialog('Save');
            }
        });

        me.btnSaveAsNewVersion = Ext.create('Ext.button.Button', {
            text: RS.$('Process_Publish_NewVersion'),
            flex: 1,
            handler: function () {
                me.closeDialog('SaveAsNewVersion');
            }
        });

        cfg = {
            buttons: [me.btnSave, me.btnSaveAsNewVersion],
            items: [{
                xtype: 'component',
                style:'font-size:1.6em;font-weight:bold',
                html: config.processName,
                margin:'0 0 12 0'
            }, {
                xtype: 'component',
                html: Ext.String.format('{0} : {1}', RS.$('All_Version'), config.version)
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});