
Ext.define('YZSoft.bpm.src.panel.TaskSearchPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.form.field.ProcessNameComboBox',
        'YZSoft.src.form.field.User',
        'YZSoft.src.form.field.PeriodPicker'
    ],
    height: 'auto',
    border: false,
    cls: 'yz-bg-transparent yz-pnl-search',
    bodyPadding: '6 10 5 12',

    constructor: function (config) {
        var me = this,
            cfg;

        me.taskStateStore = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'value'],
            data: [
                { name: RS.$('All_SearchAll'), value: 'all' },
                { name: RS.$('All_Running'), value: 'Running' },
                { name: RS.$('All_Approved'), value: 'Approved' },
                { name: RS.$('All_Rejected'), value: 'Rejected' },
                { name: RS.$('All_Aborted'), value: 'Aborted' }
            ]
        });

        me.edtProcessName = Ext.create('YZSoft.bpm.src.form.field.ProcessNameField', {
            fieldLabel: RS.$('All_TaskSearch_ProcessName'),
            emptyText: RS.$('All_SearchAllProcess'),
            disabled: config.specProcessName ? true : false,
            value: config.specProcessName
        });

        me.edtInitiator = Ext.create('YZSoft.src.form.field.User', {
            fieldLabel: RS.$('All_TaskSearch_Initiator'),
            disabled: config && config.disablePostUserAccount
        });

        me.periodPicker = Ext.create('YZSoft.src.form.field.PeriodPicker', {
            fieldLabel: RS.$('All_TaskSearch_PostDate'),
            types: config.byYear ? ['year', 'month', 'quator', 'day'] : null
        });

        me.defaultPeriod = me.periodPicker.getPeriod();

        me.cmbTaskStatus = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_TaskSearch_TaskStatus'),
            disabled: config && config.disableTaskState,
            queryMode: 'local',
            store: me.taskStateStore,
            displayField: 'name',
            valueField: 'value',
            value: 'all',
            editable: false,
            forceSelection: true,
            triggerAction: 'all',
            listeners: {
                scope: this,
                change: this.onTaskStateTypeChanged
            }
        });

        me.edtRecipient = Ext.create('YZSoft.src.form.field.User', {
            fieldLabel: RS.$('All_TaskSearch_Recipient'),
            disabled: true
        });

        me.edtTaskID = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_TaskID'),
            allowBlank: true
        });

        me.edtSN = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_SN'),
            allowBlank: true
        });

        me.edtKeyword = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_Keyword'),
            allowBlank: true,
            value: config.store.getProxy().getExtraParams().kwd || ''
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
                    maxWidth: 320,
                    minWidth: 180,
                    layout: {
                        type: 'fit'
                    },
                    defaults: {
                        labelWidth: YZSoft.os.isMobile ? 80 : 100,
                        margin:'3 0 3 10'
                    }
                }
            },
            items: [{
                items: [{
                    flex: 1,
                    items: [me.edtProcessName]
                }, {
                    flex: 1,
                    items: [me.edtInitiator]
                }, {
                    flex: 2,
                    maxWidth: 'auto',
                    items: [me.periodPicker]
                }]
            }, {
                hidden: config && config.disableTaskState,
                items: [{
                    flex: 1,
                    items: [me.cmbTaskStatus]
                }, {
                    flex: 1,
                    items: [me.edtRecipient]
                }, {
                    flex: 2,
                    maxWidth: 'auto'
                }]
            }, {
                items: [{
                    flex: 1,
                    items: [me.edtTaskID]
                }, {
                    flex: 1,
                    items: [me.edtSN]
                }, {
                    flex: 1,
                    items: [me.edtKeyword]
                }, {
                    flex: 1,
                    minWidth: 100,
                    layout: {
                        type: 'hbox',
                        align: 'middle'
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

        me.relayEvents(me.edtProcessName, ['specialkey']);
        me.relayEvents(me.edtInitiator, ['specialkey']);
        me.relayEvents(me.edtRecipient, ['specialkey']);
        me.relayEvents(me.edtTaskID, ['specialkey']);
        me.relayEvents(me.edtSN, ['specialkey']);
        me.relayEvents(me.edtKeyword, ['specialkey']);

        me.on('specialkey', function (f, e) {
            if (e.getKey() == e.ENTER) {
                me.onSearchClick();
            }
        });

        me.store.on({
            load: function (store, records, successful, operation, eOpts) {
                if (!successful)
                    return;

                var params = operation.request.getParams();

                if (params.searchType)
                    me.edtKeyword.setValue(params.kwd);
            }
        });
    },

    onTaskStateTypeChanged: function () {
        this.edtRecipient.setDisabled(this.cmbTaskStatus.getValue() != 'Running');
    },

    onSearchClick: function () {
        var me = this,
            store = me.store,
            period = me.periodPicker.getPeriod(),
            params = me.store.getProxy().getExtraParams();

        Ext.apply(params, {
            searchType: 'AdvancedSearch',
            Year: me.periodPicker.getYear(),
            ProcessName: me.edtProcessName.getValue(),
            PostUserAccount: me.edtInitiator.getValue(),
            PostDateType: period.PeriodType,
            PostDate1: period.Date1,
            PostDate2: period.Date2,
            TaskStatus: me.cmbTaskStatus.getValue(),
            RecipientUserAccount: me.edtRecipient.getValue(),
            kwd: me.edtKeyword.getValue(),
            TaskID: me.edtTaskID.getValue(),
            SerialNum: me.edtSN.getValue()
        });

        me.store.loadPage(1);
    },

    onResetClick: function () {
        var me = this,
            store = me.store,
            params = me.store.getProxy().getExtraParams();

        if (!me.edtProcessName.isDisabled())
            me.edtProcessName.setValue('');

        me.edtInitiator.setValue('');
        me.periodPicker.setPeriod(me.defaultPeriod.Define);
        me.cmbTaskStatus.setValue('all');
        me.edtRecipient.setValue('');
        me.edtTaskID.setValue('');
        me.edtSN.setValue('');
        me.edtKeyword.setValue('');

        Ext.apply(params, {
            searchType: '',
            Year: me.periodPicker.getYear()
        });

        me.store.loadPage(1);
    }
});