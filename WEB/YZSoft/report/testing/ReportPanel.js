/*
config
reportDefine
*/
Ext.define('YZSoft.report.testing.ReportPanel', {
    extend: 'YZSoft.report.Panel',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    openReport: function (path, config) {
        var me = this,
            reportDefine = me.reportDefine;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/Reports/ReportX.ashx'),
            params: {
                method: 'ExecuteTestingReport'
            },
            jsonData: {
                data: reportDefine
            },
            waitMsg: {
                msg: RS.$('All_Loading'),
                target: me
            },
            success: function (action) {
                var data = action.result;

                me.doc = Ext.create('YZSoft.src.designer.doc.Document', {
                    src: data
                });
                me.fill(me.doc);
            }
        });
    }
});