Ext.define('YZSoft.report.rpt.model.MSChartSeries', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    identifier: {
        type: 'sequential',
        prefix: RS.$('All_Series'),
        seed: 1,
        increment: 1
    },
    fields: [
        { name: 'Name' },
        { name: 'Unit', defaultValue: '' },
        { name: 'DataColumnName',defaultValue:'' },
        { name: 'Color',defaultValue:'#ff0000' }
    ]
});
