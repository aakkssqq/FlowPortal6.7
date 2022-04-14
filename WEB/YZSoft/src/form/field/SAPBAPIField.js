
Ext.define('YZSoft.src.form.field.SAPBAPIField', {
    extend: 'YZSoft.src.form.FieldContainer',
    config: {
        connectionName: null
    },
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    constructor: function (config) {
        config = config || {};

        var me = this,
            cfg;

        me.edtBAPI = Ext.create('Ext.form.field.Text', Ext.apply({
            flex: 1,
            value: config.value
        }, config.edtBAPIConfig));

        me.button = Ext.create('Ext.button.Button', Ext.apply({
            text: RS.$('All_SearchQuery'),
            glyph: 0xe986,
            padding: '0 17',
            margin: '0 0 0 3',
            handler: function () {
                if (me.fireEvent('beforeshowdlg', me) === false)
                    return;

                Ext.create('YZSoft.src.dialogs.SelBAPIDlg', {
                    autoShow: true,
                    connectionName: me.getConnectionName(),
                    limit: 100,
                    fn: function (data) {
                        me.setValue(data.name);
                    }
                });
            }
        }, config.buttonConfig));

        cfg = {
            items: [me.edtBAPI, me.button]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.edtBAPI, ['change']);
    },

    setDisabled: function (value) {
        var me = this;

        me.edtBAPI.setDisabled(value);
        me.button.setDisabled(value);
    },

    setValue: function (value) {
        this.edtBAPI.setValue(value);
    },

    getValue: function () {
        return this.edtBAPI.getValue();
    }
});