
Ext.define('YZSoft.src.form.field.ComboBox', {
    extend:'Ext.form.field.ComboBox',
    config: {
        xdatabind: true,
        ds: null,
        options: null
    },

    initComponent: function () {
        var me = this;

        if (!me.store) {
            if (!Ext.isEmpty(me.ds)) {
                me.store = me.createStoreFromDs(me.ds);
                me.store && me.store.load();
            }

            if (!me.store && !Ext.isEmpty(me.options)) {
                me.store = me.createStoreFromOptions(me.options);
                me.valueField = 'value';
                me.displayField = 'text';
            }
        }

        me.callParent();
        me.initlized = true;
    },

    createStoreFromDs: function (ds) {
        var me = this,
            ods = YZSoft.src.datasource.DataSource.tryCreate(ds);

        return ods && ods.createStoreNoPaged();
    },

    createStoreFromOptions: function (options) {
        var me = this,
            options = Ext.clone(options),
            store;

        store = Ext.create('Ext.data.Store', {
            fields: ['text', 'value'],
            data: options,
        });

        return store;
    },

    updateDisplayField: function () {
        this.setDisplayTpl(false);
    },

    updateDs: function (newValue) {
        if (!this.initlized)
            return;

        var me = this,
            store = me.createStoreFromDs(newValue);

        if (store) {
            me.setStore(store);
            store.load();

            if (me.picker) {
                me.picker.setStore(me.store);
                me.picker.setDisplayField(me.displayField);
            }
        }
    },

    updateOptions: function (newValue) {
        if (!this.initlized)
            return;

        var me = this,
            store = me.createStoreFromOptions(newValue);

        if (store) {
            me.valueField = 'value';
            me.setDisplayField('text');
            me.setStore(store);

            if (me.picker) {
                me.picker.setStore(me.store);
                me.picker.setDisplayField(me.displayField);
            }
        }
    }
});