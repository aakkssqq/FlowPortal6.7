Ext.define('YZSoft.connection.model.ConnectionInfo', {
    extend: 'Ext.data.Model',
    idProperty: 'Name',
    fields: [
        { name: 'Name' },
        { name: 'Type' },
        { name: 'Cn' },
        {
            name: 'icon',
            calculate: function (data) {
                if (data.$$$isObject)
                    return YZSoft.$url(Ext.String.format('YZSoft/connection/connections/{0}/icon.png', data.Type));
            }
        }
    ]
});
