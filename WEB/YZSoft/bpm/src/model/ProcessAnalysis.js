Ext.define('YZSoft.bpm.src.model.ProcessAnalysis', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'category',
            calculate: function (data) {
                if ('Month' in data)
                    return data.Month + RS.$('All_UnitMonth');

                if ('DAY' in data)
                    return data.DAY + RS.$('All_UnitDay');
            }
        },
        { name: 'Month' },
        { name: 'DAY' },
        { name: 'Approved' },
        { name: 'Rejected' },
        { name: 'Running' },
        { name: 'Aborted' },
        { name: 'Deleted' }
    ]
});