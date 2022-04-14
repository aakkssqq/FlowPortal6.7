Ext.define('YZSoft.esb.model.Flow', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'Name' },
        {
            name: 'icon',
            calculate: function (data) {
                if (data.$$$isObject)
                    return 'YZSoft/esb/admin/flow.png';
            }
        }
    ]
});
