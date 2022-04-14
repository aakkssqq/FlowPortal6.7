﻿/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Inform', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.InformGeneral', {
            padding: '26 26 0 26',
            relatedFile: config.property.sprite.drawContainer.process.Property.RelatedFile
        });

        me.pnlRecipients = Ext.create('YZSoft.bpm.propertypages.InformRecipients', {
            padding: '10 20 5 20',
            tables: config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            stepNames: config.property.sprite.drawContainer.getAllHumanStepNames(config.property.sprite)
        });

        me.pnlMessage = Ext.create('YZSoft.bpm.propertypages.NotifyMessage', {
            padding: '20 20 0 20',
            messageCatFieldConfig: {
                messageFieldConfig: {
                    tables: config.property.sprite.drawContainer.process.GlobalTableIdentitys,
                    messageCat: 'InformTask',
                    inheri: {
                        parent: config.property.sprite.drawContainer
                    }
                }
            }
        });

        me.pnlMessage.relayEvents(me.pnlGeneral, ['informTypeChanged']);

        me.pnlGeneral.on({
            informTypeChanged: function (newType) {
                me.pnlMessage.edtMessageCat.edtMessage.messageCat = newType == 'Inform' ? 'InformTask' : 'IndicateTask';
            }
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlRecipients,
                me.pnlMessage
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
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(data);
        me.pnlRecipients.fill(data.Recipients);
        me.pnlMessage.fill(data.MessageItems);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        data.Recipients = me.pnlRecipients.save();
        data.MessageItems = me.pnlMessage.save();

        return data;
    }
});