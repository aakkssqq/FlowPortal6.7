Ext.define('YZSoft.bpm.report.ProcessAnalysis', {
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

        me.chartMain = Ext.create('YZSoft.bpm.src.chart.ProcessAnalysis', {
            ui: 'yzdashboard'
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
                var processName = Ext.String.trim(me.edtProcessName.getValue()),
                    period = me.periodPicker.getPeriod(),
                    store, extParams;

                if (!processName) {
                    YZSoft.alert(RS.$('Analysis_SelectProcessBeforeAnalysis'));
                    return;
                }

                //主报表
                YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.chartMain.store, processName, null);

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
                YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(me.pnlKpi.store, processName, null);
                //}

                store = me.pnlKpi.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                store.load();

                //关卡占比报表
                store = me.chartStepProportion.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                extParams.ProcessName = processName;
                store.load();

                //关卡Top20
                store = me.chartStepTop20.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                extParams.ProcessName = processName;
                store.load();

                //员工占比报表
                store = me.chartUserProportion.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                extParams.ProcessName = processName;
                delete extParams.include;
                delete extParams.exclude;
                store.load();

                //员工Top20
                store = me.chartUserTop20.store;
                extParams = store.getProxy().getExtraParams(),
                Ext.apply(extParams, period.RawValue);
                extParams.ProcessName = processName;
                delete extParams.include;
                delete extParams.exclude;
                store.load();
            }
        });

        me.chartStepProportion = Ext.create('YZSoft.bpm.src.chart.ProcessAnalysisStepProportion', {
            ui: 'yzdashboard'
        });

        me.chartStepProportion.on({
            itemhighlight: function (chart, newItem, oldItem, eOpts) {
                var data = newItem.record.data;

                Ext.each([me.chartUserProportion.store, me.chartUserTop20.store], function (store) {
                    if (data.isOther)
                        YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(store, null, data.displayedNames);
                    else
                        YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(store, data.NodeName, null);

                    store.load({
                        callback: function () {
                            me.setSelectedNode(data.isOther ? data.otherNames : data.NodeName);
                        }
                    });
                });
            }
        });

        me.chartStepProportion.store.on({
            load: function (store, recs) {
                var btnDatas = [];

                btnDatas.push({
                    NodeName: '',
                    Text: RS.$('All_All'),
                    pressed: true
                });
                Ext.each(recs, function (rec) {
                    btnDatas.push({
                        NodeName: rec.data.NodeName,
                        Text: Ext.String.format('{0}({1}%)', rec.data.NodeDisplayName, Math.round(rec.data.Per / 10) / 10),
                        pressed: false
                    })
                });

                var btns = [];
                Ext.each(btnDatas, function (data) {
                    btn = Ext.create('Ext.button.Button', {
                        text: data.Text,
                        pressed: data.pressed,
                        enableToggle: true,
                        nodeName: data.NodeName,
                        padding: '5 10',
                        margin: '0 3 3 0'
                    });

                    me.relayEvents(btn, ['toggle'], 'btn');
                    btns.push(btn);
                });
                me.pnlNodesInner.removeAll(true);
                me.pnlNodesInner.add(btns);
                me.pnlNodes.show();
            }
        });

        me.chartStepTop20 = Ext.create('YZSoft.bpm.src.chart.ProcessAnalysisStepTop20', {
            ui: 'yzdashboard'
        });

        me.chartStepTop20.on({
            itemhighlight: function (chart, newItem, oldItem, eOpts) {
                var data = newItem.record.data;

                Ext.each([me.chartUserProportion.store, me.chartUserTop20.store], function (store) {
                    YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(store, data.NodeName);
                    store.load({
                        callback: function () {
                            me.setSelectedNode(data.isOther ? data.otherNames : data.NodeName);
                        }
                    });
                });
            }
        });

        me.chartUserProportion = Ext.create('YZSoft.bpm.src.chart.ProcessAnalysisUserProportion', {
            ui: 'yzdashboard'
        });

        me.chartUserTop20 = Ext.create('YZSoft.bpm.src.chart.ProcessAnalysisUserTop20', {
            ui: 'yzdashboard'
        });

        me.pnlNodesInner = Ext.create('Ext.container.Container', {
        });

        me.pnlNodes = Ext.create('Ext.container.Container', {
            padding: '0 20 10 20',
            hidden: true,
            items: [me.pnlNodesInner]
        });

        me.items = [me.pnlKpi, {
            xtype: 'panel',
            margin: '25 20 20 20',
            ui: 'yzdashboard-container',
            layout: 'fit',
            height: 360,
            tbar: {
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                padding: '15 10 0 11',
                defaultButtonUI: 'default',
                items: [me.txtReportTitle, '->', RS.$('Analysis_ProcessWantAnalysis'), me.edtProcessName, '|', me.periodPicker, me.btnUpdate]
            },
            items: [me.chartMain]
        }, {
            xtype: 'container',
            margin: '0 20 20 20',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bodyStyle: 'background-color:transparent',
            height: 360,
            items: [{
                xtype: 'panel',
                title: RS.$('Analysis_StepTimeSumCostProportion'),
                ui: 'yzdashboard-container',
                margin: '0 20 0 0',
                width: 400,
                layout: 'fit',
                items: [me.chartStepProportion]
            }, {
                xtype: 'panel',
                title: Ext.String.format('{0}(Top 20)',RS.$('Analysis_StepTimeAvgCostBlueList')),
                ui: 'yzdashboard-container',
                flex: 1,
                layout: 'fit',
                items: [me.chartStepTop20]
            }]
        }, me.pnlNodes, {
            xtype: 'container',
            margin: '0 20 10 20',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bodyStyle: 'background-color:transparent',
            height: 390,
            items: [{
                xtype: 'panel',
                title: RS.$('Analysis_EmployeeTimeSumCostProportion'),
                ui: 'yzdashboard-container',
                margin: '0 20 0 0px',
                width: 400,
                layout: 'fit',
                items: [me.chartUserProportion]
            }, {
                xtype: 'panel',
                title: Ext.String.format('{0}(Top 20)',RS.$('Analysis_EmployeeTimeAvgBlueList')),
                ui: 'yzdashboard-container',
                flex: 1,
                layout: 'fit',
                items: [me.chartUserTop20]
            }]
        }];

        me.callParent();

        me.on({
            scope: me,
            btnToggle: 'btnToggle'
        });
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
    },

    btnToggle: function (firebtn, pressed, eOpts) {
        var me = this;

        if (pressed) {
            Ext.each(me.pnlNodesInner.items.items, function (btn) {
                if (btn != firebtn)
                    btn.toggle(false, true);
            });
        }

        var nodeNames = [];
        Ext.each(me.pnlNodesInner.items.items, function (btn) {
            if (btn.pressed && btn.nodeName)
                nodeNames.push(btn.nodeName);
        });

        Ext.each([me.chartUserProportion.store, me.chartUserTop20.store], function (store) {
            YZSoft.bpm.src.ux.StoreParamsUtility.setIncludeExclude(store, nodeNames);
            store.load();
        });
    },

    setSelectedNode: function (nodeNames) {
        var me = this;

        nodeNames = Ext.isArray(nodeNames) ? nodeNames : [nodeNames];
        Ext.each(me.pnlNodesInner.items.items, function (btn) {
            btn.toggle(Ext.Array.contains(nodeNames, btn.nodeName), true);
        });
    }
});
