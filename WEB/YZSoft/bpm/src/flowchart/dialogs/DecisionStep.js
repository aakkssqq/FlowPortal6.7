/*
config
relatedFile
stepNames
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.DecisionStep', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            humanStepNames = config.property.sprite.drawContainer.getAllHumanStepNames(config.property.sprite),
            cfg;
            
        Ext.each (config.stepNames,function(name){
            if (!Ext.Array.contains(humanStepNames, name))
                humanStepNames.push(name);
        });
        
        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.DecisionStepGeneral', {
            padding: '26 26 0 26',
            relatedFile: config.relatedFile
        });

        me.pnlParticipant = Ext.create('YZSoft.bpm.propertypages.Participant', {
            padding: '17 26 0 26',
            stepNames: humanStepNames
        });

        me.pnlDataControl = Ext.create('YZSoft.bpm.propertypages.DataControl', {
            padding: '15 20 0 20',
        });

        me.pnlTimeout = Ext.create('YZSoft.bpm.propertypages.Timeout', {
            padding: '15 20 0 20',
            drawContainer: config.property.sprite.drawContainer,
            links: config.property.sprite.drawContainer.getOutLinksOfSprite(config.property.sprite, true),
            humanStepNames: humanStepNames
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
        me.pnlTimeout.relayEvents(me.pnlDataControl, ['tablesChanged']);
        me.pnlGeneral.relayEvents(me.pnlDataControl, ['tablesChanged']);

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlParticipant,
                me.pnlDataControl,
                me.pnlTimeout,
                me.pnlRules
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data, me.pnlDataControl.grid.getTableIdentitys());
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

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'StepName,Condition,RelatiedSprite'));
        me.pnlParticipant.fill(Ext.copyTo({}, data, 'Participants,ParticipantPolicy,NoParticipantsAction,JumpIfSameOwnerWithInitiator,JumpIfSameOwnerWithPrevStep,JumpIfProcessed'));

        me.pnlDataControl.fill({
            tables: me.tables,
            InitCreateRecordSet: data.InitCreateRecordSet,
            ControlDataSet: data.ControlDataSet
        });

        me.pnlTimeout.fill(data.TimeoutRule);
        me.pnlRules.fill(data.Rules);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        Ext.apply(data, me.pnlParticipant.save());
        data.ControlDataSet = me.pnlDataControl.save();
        data.InitCreateRecordSet = me.pnlDataControl.grid.getInitCreateRecordSet();
        data.TimeoutRule = me.pnlTimeout.save();
        data.Rules = me.pnlRules.save();

        return data;
    }
});