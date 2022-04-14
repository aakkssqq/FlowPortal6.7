
Ext.define('YZSoft.src.datasource.field.ProcedureComboBox', {
    extend: 'Ext.form.field.ComboBox',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'value',
    editable: true,
    forceSelection: false,
    typeAhead: true,
    typeAheadDelay: 0,
    minChars: 1,
    emptyText:RS.$('Designer_DataSource_Procedure_EmptyText_SelectProcedure'),
    config: {
        datasourceName:'Default'
    },
    loadConfig:null,

    initComponent: function () {
        var me = this,
            value = me.value;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: []
        });

        me.callParent();
    },

    updateDatasourceName: function (newValue) {
        var me = this,
            data = [],
            dsNames;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DB/Core.ashx'),
            params: {
                method: 'GetProcedures',
                datasource: newValue,
                view: true
            },
            success: function (action) {
                dsNames = me.dataSourceNames = action.result;

                Ext.each(dsNames, function (dsName) {
                    data.push({
                        value: dsName,
                        name: dsName
                    });
                });

                me.store.setData(data);
            }
        }, me.loadConfig));
    }
});