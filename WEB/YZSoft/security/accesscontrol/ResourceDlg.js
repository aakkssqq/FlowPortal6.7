/*
config:
rsid
parentRsid
readOnly
*/
Ext.define('YZSoft.security.accesscontrol.ResourceDlg', {
    extend: 'Ext.window.Window', //222222
    layout: 'fit',
    width: 786,
    height: 553,
    minWidth: 786,
    minHeight: 553,
    modal: true,
    bodyPadding: 0,
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            mode = me.mode = 'rsid' in config ? 'edit' : 'new',
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.security.accesscontrol.UserResourceGeneral', {
            padding: '25 26 5 26',
            mode: mode
        });

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            title: RS.$('All_Administrators'),
            padding: '15 26 5 26',
            rsid: config.rsid,
            parentRsid: config.parentRsid || YZSoft.WellKnownRSID.SecurityResourceRoot,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            perms: [{
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_AccessControl_Perm_Write')
            }, {
                PermName: 'UserResourceAssignPermision',
                PermType: 'Module',
                PermDisplayName: RS.$('All_AccessControl_Perm_AssignPermision')
            }]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlSecurity
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
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
        refs.edtResourceName.focus();

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
                params: { method: 'GetResourceDefine', rsid: config.rsid },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
                params: { method: 'GetNewResource', parentRsid: config.parentRsid },
                success: function (action) {
                    me.fill({
                        resource: action.result
                    });
                }
            });
        }
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(data);
        //me.updateStatus();
    },

    save: function () {
        var me = this,
            value;

        value = me.pnlGeneral.save();

        return value;
    },

    submit: function (fn, scope) {
        var me = this,
            data = me.save(),
            acl = me.pnlSecurity.save();

        if (me.validate(data) === false)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
            params: {
                method: 'SaveResource',
                mode: me.mode,
                rsid: me.rsid,
                parentRsid: me.parentRsid
            },
            jsonData: {
                resource: data.resource,
                perms: data.perms,
                acl: acl
            },
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                fn && fn.call(scope, data);
            }
        });
    },

    validate: function (data) {
        var me = this,
            refs = me.pnlGeneral.getReferences(),
            tempPerms = [];

        try {
            if (Ext.isEmpty(data.resource.ResourceName)) {
                Ext.Error.raise({
                    msg: RS.$('Security_Validation_EmptyRSName'),
                    before: function () {
                        me.tabMain.setActiveItem(me.pnlGeneral);
                    },
                    fn: function () {
                        refs.edtResourceName.focus()
                    }
                });
            }

            for (var i = 0; i < data.perms.length; i++) {
                var perm = data.perms[i];

                if (Ext.isEmpty(perm.PermName)) {
                    Ext.Error.raise({
                        msg: RS.$('Security_Validation_EmptyPermName'),
                        before: function () {
                            me.tabMain.setActiveItem(me.pnlGeneral);
                        },
                        fn: function () {
                            refs.edtPerms.cellEditing.startEdit(i, 1)
                        }
                    });
                }

                if (Ext.isEmpty(perm.PermDisplayName)) {
                    Ext.Error.raise({
                        msg: Ext.String.format(RS.$('Security_Validation_EmptyPermDisplayName'), perm.PermName),
                        before: function () {
                            me.tabMain.setActiveItem(me.pnlGeneral);
                        },
                        fn: function () {
                            refs.edtPerms.cellEditing.startEdit(i, 2)
                        }
                    });
                }

                if (Ext.Array.contains(tempPerms, perm.PermName.toLowerCase())) {
                    Ext.Error.raise({
                        msg: Ext.String.format(RS.$('Security_Validation_DuplicatePermName'), perm.PermName),
                        before: function () {
                            me.tabMain.setActiveItem(me.pnlGeneral);
                        },
                        fn: function () {
                            refs.edtPerms.cellEditing.startEdit(i, 1)
                        }
                    });
                }

                tempPerms.push(perm.PermName.toLowerCase());
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