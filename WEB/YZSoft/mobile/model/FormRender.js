Ext.define('YZSoft.mobile.model.FormRender', {
    extend: 'Ext.data.Model',
    idProperty: 'Render',
    fields: [
        { name: 'Render' },
        { name: 'Sample' },
        { name: 'Desc' },
        {
            name: 'DisplayName',
            calculate: function (data) {
                return RS.$('All_Enum_MobileFormRender_' + (data.Render || '').replace(/\.|\$/g, '_'), '');
            }
        }
    ]
});