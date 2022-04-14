
Ext.define('YZSoft.src.datasource.field.ESBDSObjectComboBox', {
    extend: 'Ext.form.field.ComboBox',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'value',
    editable: true,
    forceSelection: false,
    typeAhead: true,
    typeAheadDelay: 0,
    minChars: 1,
    emptyText:RS.$('Designer_DataSource_ESB_EmptyText_SelectObject'),

    initComponent: function () {
        var me = this,
            value = me.value,
            data = [];

        if (value) {
            data.push({
                value: value,
                name: value
            });
        }

        me.store = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: data
        });

        me.callParent();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
            params: {
                method: 'GetESBObjects'
            },
            success: function (action) {
                var data = [];

                Ext.each(action.result, function (objectName) {
                    data.push({
                        value: objectName,
                        name: objectName
                    });
                });

                me.store.setData(data);
            }
        });
    }
});