/*
config
path full name of form service
folder 新建的时候传入

rsid
parentRsid
readOnly

property:
orgName
*/

Ext.define('YZSoft.app.formservice.Dialog', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 580,
    height: 628,
    minWidth: 580,
    minHeight: 628,
    modal: true,
    maximizable: true,
    buttonAlign: 'right',
    bodyPadding:0,
    referenceHolder: true,

    defaultData: {
        SNDefine: {
            SNTableName: '',
            SNColumnName: '',
            SNPrefix: 'REQ<%=DateTime.Today.ToString("yyyyMM")%>',
            SNColumns: 4,
            SNFrom: 1,
            SNIncrement: 1,
            SNDesc: 'REQyyyyMM{0001}'
        },
        TableIdentitys: [],
        DataRelationship: {
            FKs: []
        },
        DotNetEnv: {
            ReferencedAssemblies: [
                'System.dll',
                'System.Transactions.dll',
                "System.Data.dll",
                'BPM.dll',
                'BPM.Server.dll'
            ],
            Using: [
                'using System;',
                'using System.IO;',
                'using System.Text;',
                'using System.Transactions;',
                'using System.Data;',
                'using BPM;',
                'using BPM.Server;',
                'using BPM.Server.OAL;',
                'using BPM.Server.Security;'
            ]
        },
        Events: [],
        FormStates: []
    },

    constructor: function (config) {
        var me = this,
            mode = me.mode = 'path' in config ? 'edit' : 'new',
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.FormServiceGeneral', {
            padding: '25 26 0 26'
        });

        me.pnlFormStates = Ext.create('YZSoft.bpm.propertypages.FormStatus', {
            padding: '15 26 5 26'
        });

        me.pnlEvents = Ext.create('YZSoft.bpm.propertypages.Events', {
            padding: '15 15 5 15',
            events: [
                'OnFormDataPrepared',
                'OnBeforeSave',
                'OnFormSaved'
            ]
        });

        me.pnlDotNetEnv = Ext.create('YZSoft.bpm.propertypages.DotNetEnv', {
            padding: '15 26 5 26'
        });

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            padding: '15 26 5 26',
            rsid: config.rsid,
            parentRsid: config.parentRsid,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            perms: [{
                PermName: 'Read',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Read')
            }, {
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Write')
            }]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlFormStates,
                me.pnlEvents,
                me.pnlDotNetEnv,
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

        var refs = me.pnlGeneral.getReferences();
        refs.edtName.focus();
        refs.edtName.on({
            change: function () {
                me.updateStatus();
            }
        })

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/FormService.ashx'),
                params: { method: 'GetFormServiceDefine', path: config.path },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else {
            me.fill(Ext.clone(me.defaultData));
        }
    },

    fill: function (data) {
        var me = this;

        me.orgName = data.Name;
        me.pnlGeneral.commondata = data;
        me.pnlFormStates.commondata = data;

        me.pnlGeneral.fill(data);
        me.pnlFormStates.fill(data.FormStates);
        me.pnlEvents.fill(data.Events);
        me.pnlDotNetEnv.fill(data.DotNetEnv);

        me.updateStatus();
    },

    save: function () {
        var me = this,
            value;

        value = me.pnlGeneral.save();
        value.FormStates = me.pnlFormStates.save();
        value.Events = me.pnlEvents.save();
        value.DotNetEnv = me.pnlDotNetEnv.save();

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
            url: YZSoft.$url('YZSoft.Services.REST/BPM/FormService.ashx'),
            params: {
                method: 'SaveFormService',
                mode: me.mode, path:
                me.path, name:
                me.orgName,
                folder: me.folder
            },
            jsonData: {
                data: data,
                acl: acl
            },
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
    },

    updateStatus: function () {
        var me = this,
            refs = me.pnlGeneral.getReferences();

        me.btnOK.setDisabled(me.readOnly || !Ext.String.trim(refs.edtName.getValue()));
    }
});