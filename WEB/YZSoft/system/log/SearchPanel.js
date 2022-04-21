
Ext.define('YZSoft.system.log.SearchPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.form.field.User'
    ],
    height: 'auto',
    border: false,
    cls: 'yz-bg-transparent yz-pnl-search',
    bodyPadding: '6 10 5 12',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtUser = Ext.create('YZSoft.src.form.field.User', {
            fieldLabel: RS.$('Log_FormField_User')
        });

        me.actionStore = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'value'],
            data: [
                { name: RS.$('All_SearchAll'), value: 'all' },
                { name: "Post", value: 'Post' },
                { name: "Process", value: 'Process' },
                { name: "Login", value: 'Login' },
                { name: "Logout", value: 'Logout' }
            ]
        });

        me.cmdAction = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_Operate'),
            queryMode: 'local',
            store: me.actionStore,
            displayField: 'name',
            valueField: 'value',
            value: 'all',
            editable: false,
            forceSelection: true,
            triggerAction: 'all'
        });

        me.resultStore = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'value'],
            data: [
                { name: RS.$('All_SearchAll'), value: 'all' },
                { name: RS.$('Log_Result_Success'), value: 'Success' },
                { name: RS.$('Log_Result_Fail'), value: 'Failed' }
            ]
        });

        me.cmbResult = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('Log_Result'),
            queryMode: 'local',
            store: me.resultStore,
            displayField: 'name',
            valueField: 'value',
            value: 'all',
            editable: false,
            forceSelection: true,
            triggerAction: 'all'
        });

        me.edtIP = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_FromIP'),
            allowBlank: true
        });

        me.edtKeyword = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Keyword'),
            allowBlank: true
        });

        me.btnSearch = Ext.create('Ext.button.Button', {
            text: RS.$('All_Search'),
            cls: 'yz-btn-submit yz-btn-round3',
            handler: function () {
                me.onSearchClick();
            }
        });

        me.btnClear = Ext.create('Ext.button.Button', {
            text: RS.$('All_Reset'),
            cls: 'yz-btn-round3',
            handler: function () {
                me.onResetClick();
            }
        });

        cfg = {
            border: false,
            defaults: {
                border: false,
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                defaults: {
                    margin: '1 0',
                    border: false,
                    maxWidth: 300,
                    minWidth: 180,
                    layout: {
                        type: 'fit'
                    },
                    defaults: {
                        labelWidth: YZSoft.os.isMobile ? 80 : 100,
                        margin: '3 0 3 10'
                    }
                }
            },
            items: [{
                items: [{
                    flex: 1,
                    items: [me.edtUser]
                }, {
                    flex: 1,
                    items: [me.cmdAction]
                }, {
                    flex: 2,
                    maxWidth: 'auto'
                }]
            }, {
                items: [{
                    flex: 1,
                    items: [me.cmbResult]
                }, {
                    flex: 1,
                    items: [me.edtIP]
                }, {
                    flex: 1,
                    items: [me.edtKeyword]
                }, {
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align:'middle'
                    },
                    defaults: {
                        padding: '6 16',
                        margin: '0 0 0 8',
                        ui: 'default-toolbar'
                    },
                    items: [me.btnSearch, me.btnClear]
                }]
            }]
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);

        me.relayEvents(me.edtUser, ['specialkey']);
        me.relayEvents(me.edtIP, ['specialkey']);
        me.relayEvents(me.edtKeyword, ['specialkey']);

        me.on('specialkey', function (f, e) {
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
        });
    },

    onSearchClick: function () {
        var me = this,
            store = me.store,
            params = me.store.getProxy().getExtraParams();

        Ext.apply(params, {
            searchType: 'AdvancedSearch',
            Account: me.edtUser.getValue(),
            Action: me.cmdAction.getValue(),
            Result: me.cmbResult.getValue(),
            ClientIP: me.edtIP.getValue(),
            kwd: me.edtKeyword.getValue()
        });

        me.store.loadPage(1);
    },

    onResetClick: function () {
        var me = this,
            store = me.store,
            params = me.store.getProxy().getExtraParams();

        me.edtUser.setValue('');
        me.cmdAction.setValue('all');
        me.cmbResult.setValue('all');
        me.edtIP.setValue('');
        me.edtKeyword.setValue('');

        Ext.apply(params, {
            searchType: ''
        });

        me.store.loadPage(1);
    }
});