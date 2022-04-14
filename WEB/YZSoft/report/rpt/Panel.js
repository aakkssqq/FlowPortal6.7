/*
config
    path - path of report,
    collapseSearchPanel,
    period
    params,
    titleTpl,
    pnlSearch
*/
Ext.define('YZSoft.report.rpt.Panel', {
    extend: 'Ext.panel.Panel',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    border: false,

    constructor: function (config) {
        var me = this,
            url = 'YZSoft.Services.REST/Reports/Report.ashx',
            btns, periodParam, periodValue, cfg;

        //获得报表定义
        YZSoft.Ajax.request({
            method: 'GET',
            async: false,
            params: {
                method: 'GetReportDefine',
                path: config.path
            },
            url: url,
            scope: me,
            success: function (action) {
                me.reportDefine = action.result;
            }
        });

        config.title = config.title || Ext.String.format(config.titleTpl || '{0}', me.reportDefine.name);

        //创建视图按钮
        btns = [];
        Ext.each(me.reportDefine.views, function (viewInfo) {
            btns.push({
                text: viewInfo.ViewName,
                value: viewInfo,
                pressed: btns.length == 0,
                ui: 'default'
            });
        });

        me.segViewButtons = Ext.create('Ext.button.Segmented', {
            items: btns,
            listeners: {
                scope: me,
                toggle: function () {
                    me.onToggleView();
                }
            }
        });

        //导出到Excel按钮
        me.btnExcelExport = Ext.create('Ext.button.Button', {
            text: RS.$('All_ExportToExcel'),
            glyph: 0xeb2a,
            disabled: true,
            handler: function () {
                var view = me.viewContainer.getLayout().getActiveItem(),
                    template = Ext.String.trim(me.reportDefine.ExportTemplate);

                view.$export(template ? YZSoft.$url(template):null);
            },
            listeners: {
                scope: this,
                beforeload: function () {
                    params.ReportDate = new Date()
                }
            }
        });

        me.labPeriod = Ext.create('Ext.toolbar.TextItem', {
            cls: 'yz-report-period-display',
            hidden: me.reportDefine.MonthOffset == 0 && me.reportDefine.MonthDay == 1
        });

        me.spPeriod = Ext.create('Ext.toolbar.Separator', {
            hidden: me.labPeriod.isHidden()
        });

        periodParam = Ext.Array.findBy(me.reportDefine.queryParams, function (param) {
            if (param.ParameterUIBindType == 'StartDate' || param.ParameterUIBindType == 'EndDate')
                return true;
        });

        //日期选择
        periodValue = config.period || { Type: periodParam ? 'month' : 'all' };
        me.periodPicker = Ext.create('YZSoft.src.form.field.PeriodPicker', {
            types: periodParam ? ['all', 'month', 'quator', 'year', 'day', 'period'] : ['all'],
            showType: true,
            disabled: !periodParam,
            value: periodValue,
            MonthOffset: me.reportDefine.MonthOffset,
            MonthDay: me.reportDefine.MonthDay
        });

        //更新按钮
        me.btnUpdate = Ext.create('Ext.button.Button', {
            text: RS.$('All_UpdateReport'),
            ui: 'default',
            scope: me,
            handler: 'onSearch'
        });

        //准备查询参数
        var params = [],
            initParams = config.params || {},
            date1,
            date2;

        Ext.each(me.reportDefine.queryParams, function (param) {
            if (param.Name in initParams) {
                param.DefaultValue = initParams[param.Name];

                if (param.ParameterUIBindType == 'StartDate')
                    date1 = Ext.Date.parse(initParams[param.Name], 'Y-m-d H:i:s');

                if (param.ParameterUIBindType == 'EndDate')
                    date2 = Ext.Date.parse(initParams[param.Name], 'Y-m-d H:i:s');
            }

            if (param.ParameterUIBindType == 'Normal') {
                params.push({
                    name: param.Name,
                    displayName: param.DisplayName || param.Name,
                    dataType: param.DataType,
                    value: param.DefaultValue
                });
            }
        });

        if (date1 || date2)
            me.periodPicker.setPeriod(me.periodPicker.regularPeriod(date1, date2));

        if (config.pnlSearch) {
            me.pnlSearch = Ext.create(config.pnlSearch);
            delete config.pnlSearch;
        }
        else {
            me.pnlSearch = Ext.create('YZSoft.bpm.src.panel.ParamsPanel', {
                params: params,
                border: false,
                bodyPadding:'0 0 0 8',
                hidden: params.length == 0 || config.collapseSearchPanel === true,
                listeners: {
                    scope: me,
                    searchClicked: 'onSearch'
                }
            });
        }

        me.btnSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$('All_Search'),
            disabled: params.length == 0,
            expandPanel: me.pnlSearch
        });

        me.viewContainer = Ext.create('Ext.container.Container', {
            style: 'background-color:#f5f5f5',
            flex: 1,
            layout: 'card',
            items: []
        });

        cfg = {
            tbar: [
                me.segViewButtons,
                '-',
                me.btnExcelExport,
                '->',
                me.labPeriod,
                me.spPeriod,
                RS.$('All_Report_Period'),
                me.periodPicker,
                me.btnUpdate,
                me.btnSearch
            ],
            items: [me.pnlSearch, me.viewContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updatePeriodDisplay();

        me.periodPicker.on({
            scope: me,
            change: 'updatePeriodDisplay'
        });

        if (btns.length != 0)
            me.onToggleView(btns[0].value);
    },

    onToggleView: function (viewInfo) {
        var me = this,
            viewInfo = viewInfo || me.segViewButtons.getValue(),
            panel;

        me.views = me.views || [];
        panel = me.views[viewInfo.ViewName];
        if (!panel) {
            var cfg = {
                path: me.path,
                viewName: viewInfo.ViewName,
                params: me.getParams(),
                paging:me.reportDefine.Paging,
                pageItems:me.reportDefine.PageItems,
                listeners: {
                    scope: me,
                    activate: 'updateStatus',
                    datachanged: 'updateStatus'
                }
            };

            switch (viewInfo.ViewType) {
                case 'Grid':
                    panel = Ext.create('YZSoft.report.rpt.GridViewPanel', Ext.apply({
                    }, cfg));

                    me.viewContainer.add(panel);
                    break;
                case 'MSChart':
                    panel = Ext.create('YZSoft.report.rpt.MSChartViewPanel', Ext.apply({
                    }, cfg));

                    me.viewContainer.add(panel);
                    break;
                case 'Excel':
                    panel = Ext.create('YZSoft.report.rpt.ExcelViewPanel', Ext.apply({
                    }, cfg));

                    me.viewContainer.add(panel);
                    break;
            }
        }

        if (panel) {
            me.views[viewInfo.ViewName] = panel;
            me.viewContainer.getLayout().setActiveItem(panel);
        }
    },

    onSearch: function () {
        var me = this,
            panel = me.viewContainer.getLayout().getActiveItem(),
            store = panel.store,
            extraParams = store.getProxy().getExtraParams();

        extraParams.params = Ext.util.Base64.encode(Ext.encode(me.getParams()));
        store.loadPage(1, {
            loadMask: {
                start: 0,
                stay:300
            }
        });
    },

    updateStatus: function () {
        var me = this,
            newView = me.viewContainer.getLayout().getActiveItem();

        me.btnExcelExport.setDisabled(newView.canExport() === false);
    },

    updatePeriodDisplay: function () {
        if (!this.labPeriod.isHidden()) {
            var text = this.periodPicker.getDisplayText();
            this.labPeriod.setText(text);
            this.spPeriod.setVisible(text);
        }
    },

    getParams: function () {
        var me = this,
            runtimeParams = me.pnlSearch.getParams(),
            period = me.periodPicker.getPeriod(),
            params = [];

        Ext.each(me.reportDefine.queryParams, function (param) {
            if (param.ParameterUIBindType == 'Hidden') {
                params.push({
                    name: param.Name,
                    dataType: param.DataType,
                    value: param.DefaultValue
                });
            }
            else if (param.ParameterUIBindType == 'StartDate') {
                params.push({
                    name: param.Name,
                    dataType: param.DataType,
                    value: period.Date1
                });
            }
            else if (param.ParameterUIBindType == 'EndDate') {
                params.push({
                    name: param.Name,
                    dataType: param.DataType,
                    value: period.Date2
                });
            }
        });

        Ext.each(runtimeParams, function (param) {
            var existParam = Ext.Array.findBy(params, function (item) {
                return item.name == param.name;
            });

            if (existParam)
                existParam.value = param.value;
            else
                params.push(param);

        });

        return params;
    }
});