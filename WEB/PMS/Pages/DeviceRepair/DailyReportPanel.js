
Ext.define('Demo.DeviceRepair.DailyReportPanel', {
    extend: 'Ext.panel.Panel',

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnExport = Ext.create('Ext.button.Button', {
            text: '导出到Excel',
            iconCls: 'yz-glyph yz-glyph-e603',
            handler: function () {
                me.excelPanel.$export();
            }
        });

        me.dateField = Ext.create('Ext.form.field.Date', {
            width: 130,
            value: new Date()
        });

        me.btnUpdate = Ext.create('Ext.button.Button', {
            text: RS.$('All_UpdateReport'),
            cls: 'yz-btn-submit yz-btn-round3',
            handler: function () {
                me.excelPanel.store.reload({
                    loadMask: {
                        msg: '正在更新报表...',
                        start: 0,
                        stay: 300
                    }
                });
            }
        });

        me.excelPanel = Ext.create('YZSoft.report.ExcelReportPanel', {
            excelFile: '~/Demo/DeviceRepair/DailyReport.xls',
            bodyCls: 'yz-border-t',
            tbar: {
                cls: 'yz-tbar-module',
                items: [
                    me.btnExport,
                    '->',
                    '日期',
                    me.dateField,
                    me.btnUpdate
                ]
            },
            listeners: {
                beforereportload: function (store, extraParams) {
                    extraParams.Date = me.dateField.getValue();
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