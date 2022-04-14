Ext.define('YZSoft.bpm.report.ProcessPerformance', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.ux.StoreParamsUtility'
    ],
    bodyCls: 'yz-yzdashboard-main-body',
    border: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    overflowY: 'auto',
    updateKpi: false,

    initComponent: function () {
        var me = this;

        me.kpiStore = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: [],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemReport.ashx'),
                extraParams: {
                    method: 'GetProcessPerformanceKPI'
                }
            }
        });

        me.pnlKpi = Ext.create('YZSoft.bpm.src.panel.KPI', {
            store: me.kpiStore
        });

        me.txtReportTitle = Ext.create('Ext.toolbar.TextItem', {
            cls: 'yz-yzdashboard-tbar-title',
            html: me.getReportTitle()
        });

        me.chartMain = Ext.create('YZSoft.bpm.src.chart.ProcessPerformance', {
            ui: 'yzdashboard'
        });

        me.chkSegment = Ext.create('Ext.button.Segmented', {
            margin: '0 5 0 0',
            defaults: {
                padding: '7 10 7 10'
            },
            items: [{
                text: RS.$('All_AllProcess'),
                value: 'all',
                pressed: true
            }, {
                text: RS.$('All_SpecProcess'),
                value: 'spec'
            }]
        });

        me.edtProcessName = Ext.create('YZSoft.bpm.src.form.field.ProcessNameField', {
            width: 160,
            emptyText: RS.$('All_SearchAllProcess'),
            disabled: me.specProcessName ? true : false,
            value: me.specProcessName
        });

        me.periodPicker = Ext.create('YZSoft.src.form.field.PeriodPicker', {
            types: ['year', 'month']
        });

        me.btnUpdate = Ext.create('Ext.button.Button', {
            text: RS.$('All_UpdateReport'),
            padding: '7 10 7 10',
            handler: function () {
                var type = me.chkSegment.getValue(),
                    processName = Ext.String.trim(me.edtProcessName.getValue()),
                    period = me.periodPicker.getPeriod(),
                    store, extParams;

                //主报表
                if (type == 'spec' && processName)
                    YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.chartMain.store,processName, null);
                else
                    YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.chartMain.store,null, null);

                store = me.chartMain.store;
                extParams = store.getProxy().getExtraParams();

                Ext.apply(extParams, period.RawValue);
                store.load({
                    callback: function () {
                        me.txtReportTitle.update(me.getReportTitle(period.RawValue));
                    }
                });

                //KPI
                //if (me.updateKpi) {
                    if (type == 'spec' && processName)
                        YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.pnlKpi.store,processName, null);
                    else
                        YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.pnlKpi.store,null, null);
                //}

                store = me.pnlKpi.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                store.load();

                //占比报表
                store = me.chartProportion.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                store.load();

                //Top20
                store = me.chartTop20.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                store.load();
            }
        });

        me.chartProportion = Ext.create('YZSoft.bpm.src.chart.ProcessPerformanceProportion', {
            ui: 'yzdashboard'
        });

        me.chartProportion.on({
            itemhighlight: function (chart, newItem, oldItem, eOpts) {
                var data = newItem.record.data;
                if (data.isOther)
                    YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.chartMain.store,null, data.displayedNames);
                else
                    YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.chartMain.store,data.ProcessName, null);

                me.chartMain.store.load();

                if (me.updateKpi) {
                    if (data.isOther)
                        YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.pnlKpi.store,null, data.displayedNames);
                    else
                        YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.pnlKpi.store,data.ProcessName, null);

                    me.pnlKpi.store.load();
                }
            }
        });

        me.chartTop20 = Ext.create('YZSoft.bpm.src.chart.ProcessPerformanceTop20', {
            ui: 'yzdashboard'
        });

        me.chartTop20.on({
            itemhighlight: function (chart, newItem, oldItem, eOpts) {
                YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.chartMain.store, newItem.record.data.ProcessName);
                me.chartMain.store.load();

                if (me.updateKpi) {
                    YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.pnlKpi.store, newItem.record.data.ProcessName);
                    me.pnlKpi.store.load();
                }
            }
        });

        me.items = [me.pnlKpi, {
            xtype: 'panel',
            margin: '25 20 20 20',
            layout: 'fit',
            height: 390,
            tbar: {
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                padding: '15 10 0 11',
                defaultButtonUI: 'default',
                items: [me.txtReportTitle, '->', me.chkSegment, me.edtProcessName, '|', me.periodPicker, me.btnUpdate]
            },
            items: [me.chartMain]
        }, {
            xtype: 'container',
            margin: '0 20 10 20',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bodyStyle: 'background-color:transparent',
            height: 360,
            items: [{
                xtype: 'panel',
                title: RS.$('Analysis_TimeSumCostProportion'),
                ui: 'yzdashboard-container',
                margin: '0 20 0 0',
                width: 400,
                layout: 'fit',
                items: [me.chartProportion]
            }, {
                xtype: 'panel',
                title: Ext.String.format('{0}(Top 20)',RS.$('Analysis_PerformanceBlueList')),
                ui: 'yzdashboard-container',
                flex: 1,
                layout: 'fit',
                items: [me.chartTop20]
            }]
        }];

        me.callParent();
    },

    getReportTitle: function (periodRawValue) {
        periodRawValue = periodRawValue || {
            Type: 'year',
            Year: (new Date()).getFullYear()
        };

        if (periodRawValue.Type == 'year')
            return Ext.String.format(RS.$('Analysis_ProcessPerformance_YearTendencyChart'), periodRawValue.Year);
        else
            return Ext.String.format(RS.$('Analysis_ProcessPerformance_MonthTendencyChart'), periodRawValue.Year, Ext.Date.getShortMonthName(periodRawValue.Month));
    }
});
