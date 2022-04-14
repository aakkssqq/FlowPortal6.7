/*
config
rsid        部门rsid(编辑模式)
fullname ou 的全名（编辑模式）

parentRsid  父部门rsid(新增模式)
parentou    父OU全名(新增模式)

readOnly
*/

Ext.define('YZSoft.bpm.org.admin.OUDlg', {
    extend: 'Ext.window.Window', //333333
    requires: [
        'YZSoft.src.ux.OUProviderManager'
    ],
    layout: 'fit',
    width: 580,
    height: 628,
    modal: true,
    resizable: false,
    referenceHolder: true,
    bodyPadding:0,
    defaultData: {
    },

    constructor: function (config) {
        var me = this,
            mode = me.mode = config.fullname ? 'edit' : 'new',
            provider = YZSoft.src.ux.OUProviderManager.getProviderInfo(mode == 'edit' ? config.fullname : 'BPMOU'),
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.OUGeneral', {
            padding: '15 26 5 26'
        });

        if (mode == 'edit')
            me.pnlGeneral.applyStatus(config.readOnly, provider.Editable);

        me.pnlExtAttrs = Ext.create('YZSoft.bpm.propertypages.ExtAttrs', {
            padding: '25 26 5 26'
        });

        if (mode == 'edit')
            me.pnlExtAttrs.applyStatus(config.readOnly, provider.Editable);

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
            }, {
                PermName: 'OnlineMonitor',
                PermType: 'Module',
                PermDisplayName: RS.$('All_OnlineMonitor')
            }, {
                PermName: 'ActivityMonitor',
                PermType: 'Module',
                PermDisplayName: RS.$('All_ActivityMonitor')
            }]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlExtAttrs,
                me.pnlSecurity
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
        });

        if (mode == 'edit') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                params: { method: 'GetOUDefine', fullname: config.fullname },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                params: { method: 'GetOUExtAttrs', namespace: 'BPMOU://' },
                success: function (action) {
                    me.fill({
                        FullName: me.parentou,
                        ExtAttrsSchema: action.result
                    });
                }
            });
        }

        if (mode == 'new') {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                method: 'Get',
                params: {
                    method: 'GetNewOrderIndex',
                    parentou: me.parentou
                },
                success: function (action) {
                    me.pnlGeneral.fill({
                        OrderIndex: action.result.OrderIndex
                    });
                }
            });
        }
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(data);
        me.pnlExtAttrs.fill({
            ExtAttributes: data.ExtAttributes,
            ExtAttrsSchema: data.ExtAttrsSchema
        });

        me.updateStatus();
    },

    save: function () {
        var me = this,
            value;

        value = me.pnlGeneral.save();
        value.ExtAttributes = me.pnlExtAttrs.save();

        return value;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            data = me.save(),
            acl = me.pnlSecurity.save(),
            params;

        if (me.validate(data) === false)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'SaveOU',
                mode: me.mode, fullname:
                me.fullname, parentou:
                me.parentou
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
                        fn && fn.call(scope, action.result);
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