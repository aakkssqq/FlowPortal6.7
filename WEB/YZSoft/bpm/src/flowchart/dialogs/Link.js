/*
config
generalPanelConfig
data
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Link', {
    extend: 'Ext.window.Window', //333333
    requires: [
        'YZSoft.bpm.src.ux.Server'
    ],
    layout: 'fit',
    width: 580,
    height: 628,
    minWidth: 580,
    minHeight: 628,
    modal: true,
    maximizable: true,
    buttonAlign: 'right',
    referenceHolder: true,
    bodyPadding: 0,

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.LinkGeneral', Ext.apply({
            padding: '26 26 5 26'
        }, config.generalPanelConfig));

        me.pnlEvents = Ext.create('YZSoft.bpm.propertypages.Events', {
            padding: '15 15 5 15',
            events: [
                'OnDataValidate'
            ]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlEvents
            ]
        });

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

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.data)
            me.fill(config.data);

        me.pnlGeneral.getReferences().edtDisplayString.focus();
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'DisplayString,ValidationGroup,ProcessConfirmType,PromptMessage,ConditionType'));
        me.pnlEvents.fill(data.Events);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        data.Events = me.pnlEvents.save();

        return data;
    }
});