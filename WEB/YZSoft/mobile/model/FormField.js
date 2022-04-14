Ext.define('YZSoft.mobile.model.FormField', {
    extend: 'Ext.data.Model',
    idProperty: 'XClass',
    fields: [
        { name: 'XClass' },
        { name: 'Desc' },
        {
            name: 'DisplayName',
            calculate: function (data) {
                return RS.$('All_Enum_MobileFormField_' + (data.XClass || '').replace(/\.|\$/g, '_'), '');
            }
        }
    ]
});