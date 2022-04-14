/*
config:
contentType
data
*/
Ext.define('YZSoft.bpm.src.dialogs.MessagePreviewDlg', {
    extend: 'Ext.window.Window', //222222
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 870,
    height: 596,
    minWidth: 870,
    minHeight: 596,
    modal: true,
    maximizable:true,
    bodyPadding: '10 20 5 20',
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnClose = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            cls: 'yz-btn-default',
            handler: function () {
                me.closeDialog();
            }
        });

        cfg = {
            buttons: [me.btnClose],
            defaults: {
                readOnly: false,
                labelAlign: 'top'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_Title'),
                value: config.data.Title,
                hidden: !Ext.Array.contains(config.contentType, 'Title')
            }, {
                xtype: 'textarea',
                fieldLabel: RS.$('All_Content'),
                value: config.data.Message,
                hidden: !Ext.Array.contains(config.contentType, 'MessageOnly') && !Ext.Array.contains(config.contentType, 'Message'),
                flex: 1
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_Attachment'),
                value: config.data.AttachmentsCode,
                hidden: !Ext.Array.contains(config.contentType, 'Attachment')
            }]
        };

        //config.dada会引起画面混乱（如活动节点消息预览）
        delete config.data;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});