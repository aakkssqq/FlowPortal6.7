
Ext.define('YZSoft.src.form.field.ESBFlowCombo', {
    extend: 'Ext.form.field.ComboBox',
    queryMode: 'local',
    displayField: 'Name',
    valueField: 'Name',
    forceSelection: true,
    typeAhead: true,
    typeAheadDelay: 0,
    minChars: 1,
    emptyText:RS.$('All_ESB_SelectESB_EmptyText'),

    initComponent: function () {
        var me = this,
            value = me.value,
            data = [];

        me.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/ESB/Flow/Service.ashx'),
                extraParams: {
                    method: 'GetAllFlows'
                }
            }
        });

        me.callParent();
    }
});