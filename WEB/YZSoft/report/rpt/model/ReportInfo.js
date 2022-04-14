Ext.define('YZSoft.report.rpt.model.ReportInfo', {
    extend: 'Ext.data.Model',
    idProperty: 'name',
    fields: [
        { name: 'name' },
        { name: 'ext' },
        { name: 'fullname' },
        { name: 'rsid' },
        { name: 'info' }
    ]
});
