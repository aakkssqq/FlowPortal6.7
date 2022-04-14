
Ext.define('YZSoft.personal.NotificationSettingPanel', {
    extend: 'Ext.panel.Panel',
    referenceHolder: true,
    border: false,
    bodyPadding: '15px 40px',
    ui: 'light',
    icon: YZSoft.$url('YZSoft/theme/images/icon/notify.png'),
    header: {
        cls:'yz-header-module'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnSave = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_Save'),
            handler: function () {
                me.submit();
            }
        });

        cfg = {
            tools: [{
                glyph: 0xe60f,
                handler: function () {
                    me.load({
                        waitMsg: {
                            msg: RS.$('All_Loading'),
                            target: me,
                            start: 0
                        }
                    });
                }
            }],
            tbar: {
                padding:'5 0 10 40',
                items: [me.btnSave]
            },
            items: [{
                xtype: 'checkboxgroup',
                fieldLabel: RS.$('Org_RecvNoritys'),
                labelStyle:'font-weight:bold;font-size:1.2em;line-height:40px;',
                labelAlign:'top',
                reference: 'chkTypes',
                columns: 1,
                items: []
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.load({
                waitMsg: {
                    msg: RS.$('All_Loading'),
                    target: this
                }
            });
        else {
            this.load();
        }
    },

    fill: function (data) {
        var me = this,
            ref = me.getReferences(),
            providers = data.providers,
            items = [];

        ref.chkTypes.removeAll();
        Ext.each(providers, function (provider) {
            items.push({ boxLabel: provider.ProviderName, name: provider.ProviderName, inputValue: true, value: provider.Enabled });
        });
        ref.chkTypes.add(items);
    },

    save: function () {
        var me = this,
            ref = me.getReferences(),
            rv = {
                rejectedNotifys: []
            };

        Ext.each(ref.chkTypes.items.items, function (chkType) {
            if (chkType.getValue() !== true)
                rv.rejectedNotifys.push(chkType.getName())
        });

        return rv;
    },

    load: function (config) {
        var me = this;
        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Personal.ashx'),
            params: { method: 'GetCurrentNotificationSetting' },
            success: function (action) {
                me.fill(action.result);
            }
        },config));
    },

    submit: function () {
        var me = this,
            data = me.save();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Personal.ashx'),
            params: {
                method: 'SaveNotificationSetting',
                rejectedNotifys: data.rejectedNotifys.join(';')
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
                    autoClose:'xx'
                });
            }
        });
    }
});