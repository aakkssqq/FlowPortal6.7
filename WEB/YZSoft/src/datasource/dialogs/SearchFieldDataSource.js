/*
config
fullname  member全名(编辑)
parentou  父OU全名(编辑、新建)
readOnly
*/

Ext.define('YZSoft.src.datasource.dialogs.SearchFieldDataSource', {
    extend: 'Ext.window.Window',
    requires: [
        'YZSoft.src.datasource.DataSource'
    ],
    cls: 'yz-window-size-s',
    width: 990,
    height: 650,
    modal: true,
    maximizable: true,
    bodyPadding: 0,
    buttonAlign: 'right',
    referenceHolder: true,
    tabIndex: {
        'table': 0,
        'procedure': 1,
        'esb':2
    },

    constructor: function (config) {
        var me = this,
            ds = config.ds || {},
            dsType = ds && ds.type,
            activeTab, cfg;

        me.pnlTable = Ext.create('YZSoft.src.datasource.table.SearchFieldDSSettingPanel', {
            padding: '25 26 25 26',
            readOnly: config.readOnly,
            ds: dsType == 'table' ? ds : null,

        });

        me.pnlProcedure = Ext.create('YZSoft.src.datasource.procedure.SearchFieldDSSettingPanel', {
            padding: '25 26 25 26',
            readOnly: config.readOnly,
            ds: dsType == 'procedure' ? ds : null
        });

        me.pnlESB = Ext.create('YZSoft.src.datasource.esb.SearchFieldDSSettingPanel', {
            padding: '25 26 25 26',
            readOnly: config.readOnly,
            ds: dsType == 'esb' ? ds : null
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            activeTab: me.tabIndex[dsType] || 0,
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            defaults: {
                listeners: {
                    okClick: function () {
                        var ds = me.save();

                        ds && me.closeDialog(ds);
                    },
                    cancelClick: function () {
                        me.close();
                    }
                }
            },
            items: [
                me.pnlTable,
                me.pnlProcedure,
                me.pnlESB
            ]
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: config.readOnly,
            handler: function () {
                var ds = me.save();

                //dd = Ext.encode(ds);
                //alert(dd);
                if (ds)
                    me.closeDialog(ds);
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
            //buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        //me.pnlUser.edtAccount.focus();
        //me.pnlUser.edtAccount.on({
        //    change: function () {
        //        me.updateStatus();
        //    }
        //});
    },

    //fill: function (data) {
    //    var me = this;

    //    m

    //    me.temporaryUid = data.temporaryUid;

    //    me.pnlUser.fill(Ext.apply({
    //        temporaryUid: data.temporaryUid
    //    }, data.User));

    //    me.pnlUserExt.fill({
    //        ExtAttributes: data.User.ExtAttributes,
    //        ExtAttrsSchema: data.UserExtAttrsSchema
    //    });

    //    me.pnlMember.fill(Ext.apply({
    //        FGOUs: {
    //            list: data.ChildOUs,
    //            value: data.FGOUs
    //        },
    //        FGYWs: data.FGYWs
    //    }, data.Member));

    //    me.pnlSupervisor.fill({
    //        Supervisors: data.Supervisors,
    //        DirectXSs: data.DirectXSs
    //    });

    //    me.pnlLeaving.fill({
    //        State: data.UserCommonInfo.OutOfOfficeState,
    //        From: data.UserCommonInfo.OutOfOfficeFrom,
    //        To: data.UserCommonInfo.OutOfOfficeTo
    //    });

    //    me.pnlTaskRule.fill(
    //        data.TaskRules
    //    );

    //    me.updateStatus();
    //},

    save: function () {
        return this.tabMain.getActiveTab().save();
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

        //me.btnOK.setDisabled(me.readOnly || !Ext.String.trim(me.pnlUser.edtAccount.getValue()));
    }
});