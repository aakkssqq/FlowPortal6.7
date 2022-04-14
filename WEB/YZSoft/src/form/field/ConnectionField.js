/*
config
    createButton:true
    connectionType:null
    comboConfig
    buttonConfig
*/

Ext.define('YZSoft.src.form.field.ConnectionField', {
    extend: 'YZSoft.src.form.FieldContainer',
    createButton: true,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    constructor: function (config) {
        config = config || {};

        var me = this,
            createButton = 'createButton' in config ? config.createButton : me.createButton,
            connectionType = config.connectionType,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/Connections/Service.ashx'),
                extraParams: {
                    method: 'GetConnectionsOfType',
                    type: connectionType
                }
            }
        });

        me.combo = Ext.create('Ext.form.field.ComboBox', Ext.apply({
            editable: false,
            queryMode: 'local',
            store: me.store,
            valueField: 'name',
            displayField: 'name',
            flex: 1,
            value: config.value,
            submitValue: false
        }, config.comboConfig));

        me.button = Ext.create('Ext.button.Button', Ext.apply({
            text: RS.$('All_CreateNewConnection'),
            padding: '0 10',
            margin: '0 0 0 3',
            hidden: !createButton,
            handler: function () {
                Ext.create('YZSoft.connection.connections.' + connectionType + '.Dlg', {
                    autoShow: true,
                    fn: function (data) {
                        me.store.reload({
                            callback: function (records, operation, success) {
                                if (!success)
                                    return;

                                var rec = me.store.findRecord('name', data.name);
                                if (rec) {
                                    me.setValue(data.name);
                                    me.fireEvent('select', me, rec);
                                }
                            }
                        });
                    }
                });
            }
        }, config.buttonConfig));

        cfg = {
            items: [me.combo, me.button]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.combo, ['select','change']);
    },

    setDisabled: function (value) {
        var me = this;

        me.combo.setDisabled(value);
        me.button.setDisabled(value);
    },

    setValue: function (value) {
        this.combo.setValue(value);
    },

    getValue: function () {
        return this.combo.getValue();
    }
});