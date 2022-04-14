
Ext.define('YZSoft.system.server.AccountSelfServicesSettingPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    properties: [
        { Property: 'DisplayName', DisplayName: RS.$('All_UserDisplayName') },
        { Property: 'Description', DisplayName: RS.$('All_UserDesc') },
        { Property: 'Sex', DisplayName: RS.$('All_Sex') },
        { Property: 'Birthday', DisplayName: RS.$('All_Birthday') },
        { Property: 'HRID', DisplayName: RS.$('All_HRID') },
        { Property: 'DateHired', DisplayName: RS.$('All_DateHired') },
        { Property: 'Office', DisplayName: RS.$('All_Office') },
        { Property: 'CostCenter', DisplayName: RS.$('All_CostCenter') },
        { Property: 'OfficePhone', DisplayName: RS.$('All_OfficePhone') },
        { Property: 'HomePhone', DisplayName: RS.$('All_HomePhone') },
        { Property: 'Mobile', DisplayName: RS.$('All_Mobile') },
        { Property: 'EMail', DisplayName: RS.$('All_EMail') },
        { Property: 'WWWHomePage', DisplayName: RS.$('All_HomePage') }
    ],

    constructor: function (config) {
        var me = this,
            properties = config.properties || me.properties,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            fields: ['Property', 'DisplayName'],
            data: properties
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            selModel: {
                mode: 'SINGLE'
            },
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('All_AccountPropertyName'), dataIndex: 'DisplayName', width: 200 },
                    { text: RS.$('All_AllowUserSelfService'), xtype: 'checkcolumn', dataIndex: 'Editable', width: 200 },
                    { text: '', flex: 1 }
                ]
            }
        });

        me.btnSave = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_SaveSetting'),
            handler: function () {
                me.submit();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.load({
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me,
                        start: 0
                    }
                });
            }
        });

        cfg = {
            tbar: {
                cls: 'yz-tbar-module',
                items: [me.btnSave, '->', me.btnRefresh]
            },
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    load: function (config) {
        var me = this;
        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: { method: 'GetAccountSelfServiceSetting' },
            success: function (action) {
                me.fill(action.result);
            }
        }, config));
    },

    fill: function (data) {
        var me = this;
        me.store.each(function (rec) {
            rec.set('Editable', !Ext.Array.contains(data.Fields, rec.data.Property))
        });
    },

    save: function () {
        var me = this,
            rv;

        rv = {
            Fields: []
        };

        me.store.each(function (rec) {
            if (!rec.data.Editable)
                rv.Fields.push(rec.data.Property);
        });

        return rv;
    },

    submit: function () {
        var me = this,
            data = me.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: {
                method: 'SaveAccountSelfServiceSetting'
            },
            jsonData: data,
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.load({
                    waitMsg: {
                        msg: RS.$('All_Save_Succeed'),
                        msgCls: 'yz-mask-msg-success',
                        target: me,
                        start: 0
                    }
                });
            }
        });
    },

    onActivate: function (times) {
        if (times == 0)
            this.load({
                waitMsg: {
                    msg: RS.$('All_Loading'),
                    target: this,
                }
            });
    }
});
