/*
config
tables
data
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Process', {
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
    buttonAlign:'right',
    referenceHolder: true,
    bodyPadding: 0,

    constructor: function (config) {
        var me = this,
            tables = config.tables,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.ProcessGeneral', {
            padding: '15 26 5 26',
            tables: tables
        });

        me.pnlAdv = Ext.create('YZSoft.bpm.propertypages.ProcessAdvanced', {
            padding: '10 26 0 26'
        });

        me.pnlDotNetEnv = Ext.create('YZSoft.bpm.propertypages.DotNetEnv', {
            padding: '15 26 5 26'
        });

        me.pnlMessage = Ext.create('YZSoft.bpm.propertypages.MessageGroups', {
            padding: '15 26 5 26',
            tables: tables,
            messageCats: [
                'NewTaskNormal',
                'IndicateTask',
                'InformTask',
                'RecedeBack',
                'TimeoutNotify',
                'Approved',
                'Rejected',
                'Aborted',
                'Deleted',
                'StepStopHumanOpt',
                'StepStopVoteFinished',
                'ManualRemind',
                'NoParticipantException'
            ],
            inheriable: true,
            inheri: {
                parent: YZSoft.bpm.src.ux.Server
            }
        });

        me.pnlEvents = Ext.create('YZSoft.bpm.propertypages.Events', {
            padding: '15 15 5 15',
            events: [
                'OnFiltering',
                'OnFormDataPrepared',
                'OnTaskApproved',
                'OnTaskRejected',
                'OnTaskAborted',
                'OnTaskDeleted',
                'OnTimeoutNotify',
                'OnTimeoutDeadline',
                'OnHumanStepCreated',
                'OnHumanStepEnded',
                'OnReturnToInitiator',
                'OnCurrentStepChanged'
            ]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlDotNetEnv,
                me.pnlMessage,
                me.pnlEvents,
                me.pnlAdv
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
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
        var me = this,
            panelData;

        panelData = Ext.copyTo({}, data.Property, 'FormDataRelationshipType,DefaultForm,Description,TaskDescTemplate');
        panelData.SNDefine = Ext.copyTo({}, data.Property, 'SNTableName,SNColumnName,SNPrefix,SNColumns,SNFrom,SNIncrement,SNDesc');
        me.pnlGeneral.fill(panelData);

        panelData = Ext.copyTo({}, data.Property, 'ReadForm,BizType,RelatedFile,ShortName,Color,DefaultMobileForm,MobileInitiation');
        me.pnlAdv.fill(panelData);

        me.pnlDotNetEnv.fill(data.Property.DotNetEnv);
        me.pnlMessage.fill(data.MessageGroups);
        me.pnlEvents.fill(data.Events);
    },

    save: function () {
        var me = this,
            value = {};

        value.Property = me.pnlGeneral.save();
        Ext.apply(value.Property, value.Property.SNDefine);
        delete value.Property.SNDefine;

        Ext.apply(value.Property, me.pnlAdv.save());

        value.Property.DotNetEnv = me.pnlDotNetEnv.save();
        value.MessageGroups = me.pnlMessage.save();
        value.Events = me.pnlEvents.save();

        return value;
    }
});