/*
config
fullname  member全名(编辑)
parentou  父OU全名(编辑、新建)
readOnly
*/

Ext.define('YZSoft.bpm.org.admin.MemberDlg', {
    extend: 'Ext.window.Window', //33333
    requires: [
        'YZSoft.src.ux.OUProviderManager'
    ],
    cls: 'yz-window-size-s',
    width: 990,
    height: 650,
    modal: true,
    resizable: true,
    bodyPadding: 0,
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = me.mode = config.fullname ? 'edit' : 'new',
            provider = YZSoft.src.ux.OUProviderManager.getProviderInfo(mode == 'edit' ? config.fullname : 'BPMOU'),
            cfg;

        me.pnlUser = Ext.create('YZSoft.bpm.propertypages.User', {
            readOnly: config.readOnly,
            mode: mode,
            padding: '15 26 0 26'
        });

        if (mode == 'edit')
            me.pnlUser.applyStatus(config.readOnly, provider.Editable);

        me.pnlUserExt = Ext.create('YZSoft.bpm.propertypages.ExtAttrs', {
            title: RS.$('Org_MemberTab_ExtAttr'),
            padding: '25 26 5 26'
        });

        me.pnlMember = Ext.create('YZSoft.bpm.propertypages.Member', {
            padding: '20 26 5 26'
        });

        if (mode == 'edit')
            me.pnlMember.applyStatus(config.readOnly, provider.Editable);

        me.pnlSupervisor = Ext.create('YZSoft.bpm.propertypages.Supervisor', {
            padding: '20 26 5 26'
        });

        if (mode == 'edit')
            me.pnlSupervisor.applyStatus(config.readOnly, provider.Editable);

        me.pnlLeaving = Ext.create('YZSoft.bpm.propertypages.Leaving', {
            padding: '26 26 0 26'
        });

        if (mode == 'edit')
            me.pnlLeaving.applyStatus(config.readOnly, true);

        me.pnlTaskRule = Ext.create('YZSoft.bpm.propertypages.TaskRule', {
            padding: '20 26 5 26'
        });

        if (mode == 'edit')
            me.pnlTaskRule.applyStatus(config.readOnly, true);

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlUser,
                me.pnlUserExt,
                me.pnlMember,
                me.pnlSupervisor,
                me.pnlLeaving,
                me.pnlTaskRule
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                me.submit(function (group) {
                    me.closeDialog(group);
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
            layout: 'fit',
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlUser.edtAccount.focus();
        me.pnlUser.edtAccount.on({
            change: function () {
                me.updateStatus();
            }
        });

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                params: { method: 'GetMemberDefine', fullname: config.fullname, parentou: me.parentou },
                success: function (action) {
                    Ext.apply(action.result.User, {
                        Password: 'Abc123#96',
                        PasswordCfm: 'Abc123#96'
                    });

                    me.pnlUser.applyStatus(config.readOnly, action.result.User.Permision.Edit);
                    me.pnlUserExt.applyStatus(config.readOnly, action.result.User.Permision.Edit);

                    me.fill(action.result);
                }
            });
        }
        else {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                params: { method: 'GetNewMemberDefaults', parentou: me.parentou },
                success: function (action) {
                    me.fill(Ext.apply({
                        User: {
                            ExtAttributes: {},
                            LogonProviderName: 'Local'
                        },
                        UserCommonInfo: {
                            OutOfOfficeState: 'InOffice'
                        }
                    }, action.result));
                }
            });
        }
    },

    fill: function (data) {
        var me = this,
            mode = me.mode;

        me.temporaryUid = data.temporaryUid;

        me.pnlUser.fill(Ext.apply({
            temporaryUid: data.temporaryUid
        }, data.User));

        me.pnlUserExt.fill({
            ExtAttributes: data.User.ExtAttributes,
            ExtAttrsSchema: data.UserExtAttrsSchema
        });

        me.pnlMember.fill(Ext.apply({
            FGOUs: {
                list: data.ChildOUs,
                value: data.FGOUs
            },
            FGYWs: data.FGYWs
        }, data.Member));

        me.pnlSupervisor.fill({
            Supervisors: data.Supervisors,
            DirectXSs: data.DirectXSs
        });

        me.pnlLeaving.fill({
            State: data.UserCommonInfo.OutOfOfficeState,
            From: data.UserCommonInfo.OutOfOfficeFrom,
            To: data.UserCommonInfo.OutOfOfficeTo
        });

        me.pnlTaskRule.fill(
            data.TaskRules
        );

        me.updateStatus();
    },

    save: function () {
        var me = this,
            value = {};

        value.User = me.pnlUser.save();
        value.User.ExtAttributes = me.pnlUserExt.save();
        value.Member = me.pnlMember.save();
        value.Supervisors = me.pnlSupervisor.save();

        var leaving = me.pnlLeaving.save();
        value.UserCommonInfo = {
            OutOfOfficeState: leaving.State,
            OutOfOfficeFrom: leaving.From,
            OutOfOfficeTo: leaving.To
        };

        value.TaskRules = me.pnlTaskRule.save();

        return value;
    },

    submit: function (fn, scope) {
        var me = this,
            data = me.save(),
            params;

        if (me.validate(data) === false)
            return;

        delete data.User.PasswordCfm;
        if (me.mode == 'edit')
            delete data.User.Password;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'SaveMember',
                mode: me.mode,
                fullname: me.fullname,
                parentou: me.parentou
            },
            jsonData: data,
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
                        fn && fn.call(scope, action.result);
                    }
                });
            }
        });
    },

    validate: function (value) {
        var me = this;

        try {
            var err = $objname(value.Name);
            if (err !== true) {
                Ext.Error.raise({
                    msg: err,
                    before: function () {
                        me.tabMain.setActiveItem(me.pnlUser);
                    },
                    fn: function () {
                        me.pnlUser.edtAccount.focus();
                    }
                });
            }

            if (me.mode == 'new') {
                if (value.User.Password != value.User.PasswordCfm) {
                    Ext.Error.raise({
                        msg: RS.$('All_PwdCfm_Diff'),
                        before: function () {
                            me.tabMain.setActiveItem(me.pnlUser);
                        },
                        fn: function () {
                            me.pnlUser.edtPassword.focus();
                        }
                    });
                }
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
        var me = this;

        me.btnOK.setDisabled(me.readOnly || !Ext.String.trim(me.pnlUser.edtAccount.getValue()));
    }
});