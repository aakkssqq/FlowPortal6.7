/*
config
folder
processName
version,
rsid
readOnly
*/

Ext.define('YZSoft.bpm.process.admin.Dialog', {
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

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.ProcessGeneral', {
            padding: '15 26 5 26'
        });

        me.pnlDotNetEnv = Ext.create('YZSoft.bpm.propertypages.DotNetEnv', {
            padding: '15 26 5 26'
        });

        me.pnlMessage = Ext.create('YZSoft.bpm.propertypages.MessageGroups', {
            padding: '15 26 5 26',
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

        me.pnlAdv = Ext.create('YZSoft.bpm.propertypages.ProcessAdvanced', {
            padding: '10 26 0 26'
        });

        //me.pnlExtAttrs = Ext.create('YZSoft.bpm.propertypages.ObjectExtAttrs', {
        //    border: false,
        //    bodyStyle: 'background-color:transparent',
        //    padding: '15 15 10 15'
        //});

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            padding: '15 26 5 26',
            rsid: config.rsid,
            advanced: true,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            perms: [{
                PermName: 'Read',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Read')
            }, {
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Write')
            }, {
                PermName: 'Execute',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Process_Perm_Execute')
            }, {
                PermName: 'TaskRead',
                PermType: 'Record',
                PermDisplayName: RS.$('All_Process_Perm_TaskRead')
            }, {
                PermName: 'TaskAdmin',
                PermType: 'Record',
                PermDisplayName: RS.$('All_Process_Perm_TaskAdmin')
            }]
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
                me.pnlAdv,
                //me.pnlExtAttrs,
                me.pnlSecurity
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (data) {
                    me.closeDialog(data);
                });
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

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/ProcessAdmin.ashx'),
            params: {
                method: 'GetProcessProperty',
                processName: config.processName,
                version: config.version
            },
            success: function (action) {
                me.pnlGeneral.tables = action.result.GlobalTableIdentitys;
                me.pnlMessage.tables = action.result.GlobalTableIdentitys;
                me.fill(action.result);
            }
        });
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
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            data = me.save(),
            acl = me.pnlSecurity.save();

        if (me.validate(data) === false)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/ProcessAdmin.ashx'),
            params: {
                method: 'SaveProcessProperty',
                folder: me.folder,
                processName: me.processName,
                version: me.version
            },
            jsonData: Ext.apply(data, {
                acl: acl
            }),
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: true,
                    fn: function () {
                        fn && fn.call(scope, data);
                    }
                });
            }
        });
    },

    validate: function (value) {
        var me = this,
            refs = me.pnlGeneral.getReferences();

        try {
            var err = $objname(value.Name);
            if (err !== true) {
                Ext.Error.raise({
                    msg: err,
                    before: function () {
                        me.tabMain.setActiveItem(me.pnlGeneral);
                    },
                    fn: function () {
                        refs.edtName.focus();
                    }
                });
            }
        }
        catch (e) {
            if (e.before)
                e.before.call(e.scope || this, e);

            YZSoft.alert(e.message, function () {
                if (e.fn)
                    e.fn.call(e.scope || this, e);
            });
            return false;
        }
    }
});