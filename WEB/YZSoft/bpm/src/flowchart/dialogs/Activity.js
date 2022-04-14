/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Activity', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.ActivityGeneral', {
            padding: '15 26 0 26',
            relatedFile: config.property.sprite.drawContainer.process.Property.RelatedFile
        });

        me.pnlParticipant = Ext.create('YZSoft.bpm.propertypages.Participant', {
            padding: '17 26 0 26',
            stepNames: config.property.sprite.drawContainer.getAllHumanStepNames(config.property.sprite)
        });

        me.pnlDataControl = Ext.create('YZSoft.bpm.propertypages.DataControl', {
            padding: '15 20 0 20',
        });

        me.pnlMessage = Ext.create('YZSoft.bpm.propertypages.NotifyMessage', {
            padding: '20 20 0 20',
            messageCatFieldConfig: {
                messageFieldConfig: {
                    messageCat: 'NewTaskNormal',
                    inheri: {
                        parent: config.property.sprite.drawContainer
                    }
                }
            }
        });

        me.pnlLinks = Ext.create('YZSoft.bpm.propertypages.OutLinks', {
            padding: '10 20 0 20',
            groups: config.property.sprite.drawContainer.getAllRecedeBackGroup(config.property.sprite),
            systemLinksFieldConfig: {
                supportedTypes: ['DirectSend']
            }
        });

        me.pnlTimeout = Ext.create('YZSoft.bpm.propertypages.Timeout', {
            padding: '15 20 0 20',
            drawContainer: config.property.sprite.drawContainer,
            links: config.property.sprite.drawContainer.getOutLinksOfSprite(config.property.sprite, true),
            humanStepNames: config.property.sprite.drawContainer.getAllHumanStepNames(config.property.sprite)
        });

        me.pnlEvents = Ext.create('YZSoft.bpm.propertypages.Events', {
            padding: '20 20 0 20',
            navBar: {
                width: 246
            },
            events: [
                'OnFiltering',
                'OnFormDataPrepared',
                'OnBeforePostMergeIn',
                'OnSameRecipientAutoApproved',
                'OnTimeOutAutoProcessed',
                'OnBatchApproved',
                'OnTimeoutNotify',
                'OnTimeoutDeadline',
                'OnHumanStepCreated',
                'OnHumanStepEnded',
                'OnPickupShareTask'
            ]
        });

        me.pnlRules = Ext.create('YZSoft.bpm.propertypages.Rules', {
            padding: '20 20 0 20',
            navBar: {
                width: 246
            },
            rules: [
                'AutoApproveRule'
            ]
        });

        me.pnlParticipant.relayEvents(me.pnlDataControl, ['tablesChanged']);
        me.pnlMessage.relayEvents(me.pnlDataControl, ['tablesChanged']);
        me.pnlTimeout.relayEvents(me.pnlDataControl, ['tablesChanged']);

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlParticipant,
                me.pnlDataControl,
                me.pnlMessage,
                me.pnlLinks,
                me.pnlTimeout,
                me.pnlEvents,
                me.pnlRules
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

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,Form,MobileForm,Permision,BizTypeInheri,BizType,RelatiedSprite'));
        me.pnlParticipant.fill(Ext.copyTo({}, data, 'Participants,ParticipantPolicy,NoParticipantsAction,JumpIfSameOwnerWithInitiator,JumpIfSameOwnerWithPrevStep,JumpIfProcessed'));

        me.pnlDataControl.fill({
            tables: me.property.sprite.drawContainer.process.GlobalTableIdentitys,
            InitCreateRecordSet:data.InitCreateRecordSet,
            ControlDataSet: data.ControlDataSet
        });

        me.pnlMessage.fill(data.MessageItems);

        me.pnlLinks.fill({
            links: me.pnlLinks.getOutLinksSource(me.property.sprite.drawContainer.getOutLinksOfSprite(me.property.sprite, true)),
            SystemLinks: data.SystemLinks,
            RecedeBackGroup: data.RecedeBackGroup,
            RecedeBackExtGroups: data.RecedeBackExtGroups
        });

        me.pnlTimeout.fill(data.TimeoutRule);
        me.pnlEvents.fill(data.Events);
        me.pnlRules.fill(data.Rules);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();

        Ext.apply(data, me.pnlParticipant.save());

        data.ControlDataSet = me.pnlDataControl.save();

        me.property.sprite.drawContainer.process.GlobalTableIdentitys = me.pnlDataControl.grid.getTableIdentitys();
        data.InitCreateRecordSet = me.pnlDataControl.grid.getInitCreateRecordSet();

        data.MessageItems = me.pnlMessage.save();
        Ext.apply(data, me.pnlLinks.save(true));
        data.TimeoutRule = me.pnlTimeout.save();
        data.Events = me.pnlEvents.save();
        data.Rules = me.pnlRules.save();

        return data;
    }
});