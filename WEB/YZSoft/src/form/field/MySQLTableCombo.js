
Ext.define('YZSoft.src.form.field.MySQLTableCombo', {
    extend:'Ext.form.field.ComboBox',
    config: {
        connectionName: null
    },
    queryMode: 'local',
    editable: false,
    valueField: 'name',
    displayField: 'name',

    initComponent: function () {
        this.store = this.ensureStore();
        this.callParent(arguments);
    },

    ensureStore: function () {
        var me = this;

        if (!me.store) {
            me.store = Ext.create('Ext.data.Store', {
                autoLoad: false,
                idProperty: 'name',
                fields: ['name'],
                proxy: {
                    type: 'ajax',
                    url: YZSoft.$url('YZSoft.Services.REST/DesignTime/MySQL.ashx'),
                    extraParams: {
                        method: 'GetTables'
                    }
                },
                listeners: {
                    load: function (store, records, successful, operation, eOpts) {
                        if (!successful) {
                            store.removeAll();
                            me.setValue(null);
                            me.fireEvent('loadexception', operation.getErrorMessage(), operation);
                        }
                    }
                }
            });
        }

        return me.store;
    },

    updateConnectionName: function (newValue) {
        var me = this,
            store = me.ensureStore(),
            params = store.getProxy().getExtraParams();

        if (!newValue)
            return;

        Ext.apply(params, {
            connectionName: newValue
        });

        me.store.load(Ext.apply({},me.loadCfg));
    },

    getRecord: function (value) {
        return this.store.findRecord('name', value);
    }
});