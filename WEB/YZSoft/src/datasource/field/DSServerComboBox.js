
Ext.define('YZSoft.src.datasource.field.DSServerComboBox', {
    extend: 'Ext.form.field.ComboBox',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'value',
    editable: false,
    forceSelection: true,
    value: 'Default',

    initComponent: function () {
        var me = this,
            value = me.value;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: [{
                value: value,
                name: value
            }]
        });

        me.callParent();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
            params: {
                method: 'GetDataSourceNames'
            },
            success: function (action) {
                var data = [];

                Ext.each(action.result, function (dsName) {
                    data.push({
                        value: dsName,
                        name: dsName
                    });
                });

                me.store.setData(data);
            }
        });
    }
});