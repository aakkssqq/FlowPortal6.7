/*
config
tables
*/
Ext.define('YZSoft.src.form.field.CondByUserPropertyField', {
    extend: 'YZSoft.src.form.field.CondBaseField',
    compareField: {
        xtype: 'combo',
        flex: 1,
        emptyText: RS.$('Process_GenCondByProperty'),
        getField: function () {
            return this.getValue();
        },
        queryMode: 'local',
        store: {
            fields: ['name','value']
        },
        displayField: 'name',
        valueField: 'value',
        editable: false,
        forceSelection: false
    },

    constructor: function (config) {
        var me = this,
            data = [];

        Ext.each(YZSoft.UserProperties, function (prop) {
            data.push({
                name: 'Initiator.UserInfo' + prop.propName,
                value: {
                    express: 'Initiator.UserInfo' + prop.propName,
                    type: prop.type
                }
            });
        });

        Ext.each(YZSoft.MemberProperties, function (prop) {
            data.push({
                name: 'Initiato.' + prop.propName,
                value: {
                    express: 'Initiator' + prop.propName,
                    type: prop.type
                }
            });
        });

        me.compareField.store.data = data;
        me.callParent(arguments);
    }
});