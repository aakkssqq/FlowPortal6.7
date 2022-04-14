Ext.define('YZSoft.esb.model.DSFlow', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'Name' },
        {
            name: 'icon',
            calculate: function (data) {
                if (data.$$$isObject)
                    return 'YZSoft/esb/admin/dsflow.png';
            }
        }
    ]
});
