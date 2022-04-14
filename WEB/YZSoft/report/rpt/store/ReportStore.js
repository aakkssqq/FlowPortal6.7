
Ext.define('YZSoft.report.rpt.store.ReportStore', {
    extend: 'Ext.data.Store',
    remoteSort: true,
    model: 'Ext.data.Model',
    proxy: {
        actionMethods: { read: 'POST' },
        type: 'ajax',
        url: YZSoft.$url('YZSoft.Services.REST/Reports/Report.ashx'),
        timeout: $S.timeout.loadReportData || 180000,
        extraParams: {
            Method: 'GetReportData'
        },
        reader: {
            rootProperty: 'children'
        }
    }
});