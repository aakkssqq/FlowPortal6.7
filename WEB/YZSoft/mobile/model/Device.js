Ext.define('YZSoft.mobile.model.Device', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'Account' },
        { name: 'UUID' },
        { name: 'Name' },
        { name: 'Model' },
        { name: 'Description' },
        { name: 'RegisterAt' },
        { name: 'Disabled' },
        { name: 'LastLogin' }
    ],
    getId: function() {
        return Ext.String.format('{0}&{1}', this.data.Account, this.data.UUID);
    }
});
