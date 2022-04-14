/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.CallProcess', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.CallProcessGeneral', {
            padding: '26 26 0 26',
            tables: tables
        });

        me.pnlOwner = Ext.create('YZSoft.bpm.propertypages.CallProcessOwner', {
            padding: '15 20 5 20',
            tables:tables,
            stepNames: config.property.sprite.drawContainer.getAllHumanStepNames(config.property.sprite)
        });

        me.pnlCall = Ext.create('YZSoft.bpm.propertypages.CallProcessCall', {
            padding: '23 20 5 20',
            tables: tables
        });

        me.pnlReturn = Ext.create('YZSoft.bpm.propertypages.CallProcessReturn', {
            padding: '23 20 5 20'
        });

        me.pnlRules = Ext.create('YZSoft.bpm.propertypages.Rules', {
            padding: '20 20 0 20',
            navBar: {
                width: 246
            },
            tables: config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            rules: ['RowFilterRule']
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlOwner,
                me.pnlCall,
                me.pnlReturn,
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

        me.pnlGeneral.relayEvents(me.pnlCall, ['getCallProcess']);
        me.pnlGeneral.relayEvents(me.pnlReturn, ['getCallProcess']);

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(data);
        me.pnlOwner.fill(Ext.copyTo({}, data, 'Participants,ParticipantPolicy,JumpIfNoParticipants'));
        me.pnlCall.fill(Ext.copyTo({}, data, 'ServerName,CallProcess,CallDataMap'));
        me.pnlReturn.fill({
            tables: me.property.sprite.drawContainer.process.GlobalTableIdentitys,
            ReturnDataMap: data.ReturnDataMap
        });
        me.pnlRules.fill(data.Rules);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        Ext.apply(data, me.pnlOwner.save());
        data.CallDataMap = me.pnlCall.save();
        data.ReturnDataMap = me.pnlReturn.save();
        data.Rules = me.pnlRules.save();

        return data;
    }
});