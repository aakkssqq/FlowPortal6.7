/*
config
    serverTypes: BPMServer/FTPServer/DataSourceServer
    createButton:true
    cmbServerConfig
    btnCreateConfig
*/

Ext.define('YZSoft.bpm.src.form.field.ExtServerField', {
    extend: 'YZSoft.src.form.FieldContainer',
    createButton: true,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            createButton = 'createButton' in config ? config.createButton : me.createButton,
            serverTypes = config.serverTypes = Ext.isString(config.serverTypes) ? [config.serverTypes] : config.serverTypes,
            cfg;

        me.createServerTypes = [];
        Ext.each(serverTypes, function (serverType) {
            if (serverType != 'Local')
                me.createServerTypes.push(serverType);
        });

        me.store = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: ['Name'],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/ExtServer.ashx'),
                extraParams: {
                    method: 'GetExtServerOfType',
                    serverTypes: config.serverTypes.join(';')
                }
            }
        });

        me.cmbServer = Ext.create('Ext.form.field.ComboBox', Ext.apply({
            editable: false,
            queryMode: 'local',
            store: me.store,
            valueField: 'Name',
            displayField: 'Name',
            flex: 1,
            submitValue: false
        }, config.cmbServerConfig));

        me.btnCreate = Ext.create('Ext.button.Button', Ext.apply({
            text: RS.$('All_CreateNewConnection'),
            padding: '0 10',
            margin: '0 0 0 3',
            hidden: !createButton,
            handler: function () {
                var serverType = me.createServerTypes[me.createServerTypes.length-1];
                Ext.create('YZSoft.extserver.' + serverType + 'Dlg', {
                    autoShow: true,
                    fn: function (data) {
                        me.store.reload({
                            callback: function () {
                                me.setValue(data.Name);
                            }
                        });
                    }
                });
            }
        }, config.btnCreateConfig));

        cfg = {
            items: [me.cmbServer, me.btnCreate]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setDisabled: function (value) {
        var me = this;
        me.cmbServer.setDisabled(value);
        me.btnCreate.setDisabled(value);
    },

    setValue: function (value) {
        this.cmbServer.setValue(value);
    },

    getValue: function () {
        return this.cmbServer.getValue();
    }
});