/*
config
libid
acl
*/

Ext.define('YZSoft.app.library.LibDlg', {
    extend: 'Ext.window.Window', //333333
    layout: 'fit',
    width: 580,
    height: 628,
    modal: true,
    resizable: false,
    bodyPadding: 0,
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            libid = config.libid,
            rsid = libid ? 'Library://' + libid : '',
            acl = rsid ? undefined : config.acl,
            perm,
            cfg;

        perm = config.perm || {
            Write: true,
            AssignPermision: true
        };

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.LibraryGeneral', {
            hidden: !perm.Write,
            padding: '15 26 80 26',
            logoConfig: config.logoConfig
        });

        me.pnlSecurity = Ext.create('YZSoft.bpm.propertypages.Security', {
            hidden: !perm.AssignPermision,
            padding: '15 26 5 26',
            rsid: rsid,
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
                PermName: 'AssignPermision',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_AssignPermision')
            }],
            acl: acl
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
            cls: 'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                var data = me.save();

                if (me.validate(data.data) === false)
                    return;

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

        me.pnlGeneral.edtName.focus();
        me.pnlGeneral.edtName.on({
            change: function () {
                me.updateStatus();
            }
        })

        if (config.libid) {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/Library.ashx'),
                params: {
                    method: 'GetLibrary',
                    libid: config.libid
                },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }

        me.updateStatus();
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(data);
        me.updateStatus();
    },

    save: function () {
        var me = this;

        return {
            data: me.pnlGeneral.save(),
            acl: me.pnlSecurity.save()
        };
    },

    validate: function (value) {
        var me = this;

        try {
            var err = $objname(value.Name);
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