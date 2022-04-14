/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Decision', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.ActivityGeneral', {
            padding: '26 26 0 26',
            RelatiedSpriteConfig: {
                hidden:true
            }
        });

        me.pnlSteps = Ext.create('YZSoft.bpm.propertypages.DecisionSteps', {
            padding: '20 20 0 20',
            property: config.property,
            tables: tables,
            relatedFile: config.property.sprite.drawContainer.process.Property.RelatedFile
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
                'OnHumanStepEnded'
            ]
        });

        me.pnlMessage.relayEvents(me.pnlSteps, ['tablesChanged']);

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlSteps,
                me.pnlMessage,
                me.pnlLinks,
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

        me.pnlMessage.fireEvent('tablesChanged', tables);
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,Form,MobileForm,Permision,BizTypeInheri,BizType'));
        me.pnlSteps.fill(data.Steps);
        me.pnlMessage.fill(data.MessageItems);
        me.pnlLinks.fill({
            links: me.pnlLinks.getOutLinksSource(me.property.sprite.drawContainer.getOutLinksOfSprite(me.property.sprite, true)),
            SystemLinks: data.SystemLinks,
            RecedeBackGroup: data.RecedeBackGroup,
            RecedeBackExtGroups: data.RecedeBackExtGroups
        });
        me.pnlEvents.fill(data.Events);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        data.Steps = me.pnlSteps.save();
        me.property.sprite.drawContainer.process.GlobalTableIdentitys = me.pnlSteps.tables;

        data.MessageItems = me.pnlMessage.save();
        Ext.apply(data, me.pnlLinks.save(true));
        data.Events = me.pnlEvents.save();

        return data;
    }
});