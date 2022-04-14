Ext.define('YZSoft.mobile.model.FormSettingItem', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'TableName' },
        { name: 'ColumnName' },
        //重要，新加表，未设置以下项，值会是undefined,在cellEdit中会自动变成空字符串''
        { name: 'DefaultValue', defaultValue: null },
        { name: 'SaveValue', defaultValue: null },
        { name: 'FilterValue', defaultValue: null },
        { name: 'MapTo', defaultValue: null },
        { name: 'WriteColumnDisabled', calculate: function (data) {
            return data.MapTo == 'Ext.field.Field';
        } 
        }
    ]
});
