/*
config
rsid
path
perms,
securityResType
readOnly
*/

Ext.define('YZSoft.report.admin.PropertyDlg', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 580,
    height: 628,
    minWidth: 580,
    minHeight: 628,
    modal: true,
    resizable: false,
    buttonAlign: 'right',
    bodyPadding:0,

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.report.propertypages.ReportGeneral', {
            padding: '26 26 0 26'
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
            }, {
                PermName: 'Execute',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Report_Perm_Execute')
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
            cls: 'yz-btn-default',
            disabled:config.readOnly,
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

        me.pnlGeneral.edtName.focus();
        me.pnlGeneral.edtName.on({
            change: function () {
                me.updateStatus();
            }
        })

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportXAdmin.ashx'),
            params: {
                method: 'GetReportProperty',
                path: config.path
            },
            success: function (action) {
                me.fill(action.result);
            }
        });
    },

    fill: function (data) {
        var me = this;

        me.orgName = data.name;
        me.pnlGeneral.fill(Ext.copyTo({
            name: data.name
        }, data.property, 'hidden'));

        me.updateStatus();
    },

    save: function () {
        var me = this,
            value = {};

        value.property = me.pnlGeneral.save();
        value.name = Ext.String.trim(value.property.name);
        delete value.property.name;

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
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportXAdmin.ashx'),
            params: {
                method: 'SaveProperty',
                path: me.path,
                name: me.orgName
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
        var me = this;

        try {
            var err = $objname(value.name);
            if (err !== true) {
                Ext.Error.raise({
                    msg: err,
                    before: function () {
                        me.tabMain.setActiveItem(me.pnlGeneral);
                    },
                    fn: function () {
                        me.pnlGeneral.edtName.focus();
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
        var me = this;

        me.btnOK.setDisabled(me.readOnly || !Ext.String.trim(me.pnlGeneral.edtName.getValue()));
    }
});