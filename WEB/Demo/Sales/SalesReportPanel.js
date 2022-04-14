
Ext.define('Demo.Sales.SalesReportPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnExport = Ext.create('Ext.button.Button', {
            text: "导出到Excel",
            iconCls: 'yz-glyph yz-glyph-e603',
            handler: function () {
                me.excelPanel.$export();
            }
        });

        me.yearField = Ext.create('Ext.form.field.Number', {
            minValue: 0,
            width: 100,
            maxValue: 9999,
            value:(new Date()).getFullYear()
        });

        me.btnUpdate = Ext.create('Ext.button.Button', {
            text: RS.$('All_UpdateReport'),
            cls:'yz-btn-submit yz-btn-round3',
            handler: function () {
                me.excelPanel.store.reload({
                    loadMask: {
                        msg:'正在更新报表...',
                        start: 0,
                        stay:300
                    }
                });
            }
        });

        me.excelPanel = Ext.create('YZSoft.report.ExcelReportPanel', {
            excelFile: config.multiSheet ? '~/Demo/Sales/SalesReportMultiSheet.xls' : '~/Demo/Sales/SalesReport.xls',
            bodyCls: 'yz-border-t',
            tbar: {
                cls: 'yz-tbar-module',
                items: [
                    me.btnExport,
                    '->',
                    '年度',
                    me.yearField,
                    me.btnUpdate
                ]
            },
            listeners: {
                beforereportload: function (store, extraParams) {
                    extraParams.Year = me.yearField.getValue();
                    extraParams.ReportDate = new Date();
                },
                reportload: function () {
                    me.updateStatus();
                }
            }
        });

        cfg = {
            items: [me.excelPanel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    updateStatus: function () {
        this.btnExport.setDisabled(!this.excelPanel.containsReport);
    }
});