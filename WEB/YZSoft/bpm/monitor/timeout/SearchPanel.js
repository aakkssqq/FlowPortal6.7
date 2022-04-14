
Ext.define('YZSoft.bpm.monitor.timeout.SearchPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.form.field.ProcessNameComboBox',
        'YZSoft.src.form.field.User',
        'YZSoft.src.form.field.PeriodPicker'
    ],
    height: 'auto',
    border: false,
    cls: 'yz-bg-transparent yz-pnl-search',
    bodyPadding: '10 20 10 20',
    layout: {
        type: 'vbox',
        align:'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.chkProgress = Ext.create('Ext.button.Segmented', {
            margin: '0 30 0 0',
            allowMultiple: false,
            defaults: {
                padding: '7 10'
            },
            items: [{
                text: RS.$('Monitor_Timeout'),
                value: '1',
                pressed: true
            }, {
                text: Ext.String.format(RS.$('Monitor_Progress'), 90),
                value: '0.9'
            }, {
                text: Ext.String.format(RS.$('Monitor_Progress'), 80),
                value: '0.8'
            }, {
                text: Ext.String.format(RS.$('Monitor_Progress'), 70),
                value: '0.7'
            }, {
                text: Ext.String.format(RS.$('Monitor_Progress'), 60),
                value: '0.6'
            }, {
                text: Ext.String.format(RS.$('Monitor_Progress'), 50),
                value: '0.5'
            }]
        });

        me.btnSearch1 = Ext.create('Ext.button.Button', {
            text: RS.$('All_Report_Statistic'),
            padding: '7 15',
            margin: 0,
            //cls: 'yz-btn-submit yz-btn-round3',
            handler: function () {
                me.onSearch1Click();
            }
        });

        me.edtDate = Ext.create('YZSoft.src.form.field.DateTimeField', {
            margin: '0 30 0 0',
            value: new Date()
        });

        me.btnSearch2 = Ext.create('Ext.button.Button', {
            text: RS.$('All_Report_Statistic'),
            padding: '7 15',
            margin: 0,
            //cls: 'yz-btn-submit yz-btn-round3',
            handler: function () {
                me.onSearch2Click();
            }
        });

        me.chkSegment = Ext.create('Ext.button.Segmented', {
            margin: '0 5 0 0',
            defaults: {
                padding:'7 10'
            },
            items: [{
                text: RS.$('All_AllProcess'),
                value: 'all',
                pressed: true,
                handler: function () {
                    me.onAllClick();
                }
            }, {
                text: RS.$('All_SpecProcess'),
                value: 'spec',
                handler: function () {
                    me.onSpecClick();
                }
            }]
        });

        me.edtProcessName = Ext.create('YZSoft.bpm.src.form.field.ProcessNameField', {
            margin: '0 5 0 0',
            emptyText: RS.$('All_SearchAllProcess'),
            width: 180,
            listeners: {
                scope: me,
                specialkey: function (f, e) {
                    if (e.getKey() == e.ENTER)
                        me.onProcessNameChanged();
                },
                select: 'onProcessNameChanged'
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: config.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('Timeout{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            fileName: 'TimeoutTasks',
            allowExportAll: true,
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date()
                }
            }
        });

        cfg = {
            margin: 0,
            padding: 0,
            defaults: {
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                border: false,
                align: 'bottom'
            },
            items: [{
                items: [{ xtype: 'displayfield', value: RS.$('Monitor_ByProgress'), width: 160 }, me.chkProgress, me.btnSearch1]
            }, {
                margin: '3 0 0 0',
                items: [{ xtype: 'displayfield', value: RS.$('Monitor_ByDeadline'), width: 157 }, me.edtDate, me.btnSearch2, { xtype: 'tbfill' }, me.chkSegment, me.edtProcessName, me.btnExcelExport]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSearch1Click: function () {
        var me = this,
            grid = me.grid,
            store = grid.getStore(),
            params = store.getProxy().getExtraParams(),
            value = me.chkProgress.getValue();

        Ext.apply(params, {
            searchType: 'AdvancedSearch',
            SearchBy: 'Progress',
            minProgress: value,
            maxProgress: value == 1 ? -1:1
        });

        store.loadPage(1);
    },

    onSearch2Click: function () {
        var me = this,
            grid = me.grid,
            store = grid.getStore(),
            params = store.getProxy().getExtraParams(),
            value = me.edtDate.getValue();

        Ext.apply(params, {
            searchType: 'AdvancedSearch',
            SearchBy: 'Deadline',
            Deadline: value
        });

        store.loadPage(1);
    },

    onAllClick: function () {
        var me = this,
            grid = me.grid,
            store = grid.getStore(),
            params = store.getProxy().getExtraParams();

        delete params.ProcessName;
        store.loadPage(1);
    },

    onSpecClick: function () {
        var me = this,
            grid = me.grid,
            store = grid.getStore(),
            params = store.getProxy().getExtraParams(),
            value = me.edtProcessName.getValue();

        Ext.apply(params, {
            ProcessName: value
        });

        store.loadPage(1);
    },

    onProcessNameChanged: function () {
        var me = this,
            grid = me.grid,
            store = grid.getStore(),
            params = store.getProxy().getExtraParams(),
            value = me.edtProcessName.getValue();

        me.chkSegment.setValue('spec');

        Ext.apply(params, {
            ProcessName: value
        });

        store.loadPage(1);
    }
});