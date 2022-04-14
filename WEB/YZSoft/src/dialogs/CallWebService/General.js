/*
config:
*/
Ext.define('YZSoft.src.dialogs.CallWebService.General', {
    extend: 'Ext.form.Panel',
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtWsdl = Ext.create('Ext.form.field.Text', {
            name: 'wsdl',
            flex: 1
        });

        me.storeService = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'ports']
        });

        me.cmbService = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_CallWebService_service'),
            store: me.storeService,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            editable: false,
            forceSelection: true,
            name: 'service'
        });

        me.storePort = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'soapVersion', 'location', 'operations']
        });

        me.cmbPort = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_CallWebService_port'),
            store: me.storePort,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            editable: false,
            forceSelection: true,
            name: 'port',
            listeners: {
                select: function (combo, record, eOpts) {
                    if (record.data.location)
                        me.edtLocation.setValue(record.data.location);
                }
            }
        });

        me.edtLocation = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('All_CallWebService_location'),
            name: 'location'
        });

        me.storeOperations = Ext.create('Ext.data.JsonStore', {
            fields: ['id', 'name', 'messageName']
        });

        me.cmbOperations = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_CallWebService_operationName'),
            store: me.storeOperations,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            editable: false,
            forceSelection: true,
            name: 'operationId'
        });

        cfg = {
            defaults: {
                anchor: '100%',
                msgTarget: 'under'
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: config.labelWsdl,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [me.edtWsdl, {
                    xtype: 'button',
                    text: RS.$('All_CallWebService_Goto'),
                    margin: '0 0 0 3',
                    scope: me,
                    handler: 'onGoClick'
                }]
            }, me.cmbService, me.cmbPort, me.edtLocation, me.cmbOperations]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.cmbPort, ['select'], 'port');
        me.relayEvents(me.cmbOperations, ['select'], 'op');
    },

    onGoClick: function () {
        var me = this,
            value = me.save();

        if (!value.wsdl)
            return;

        me.updateOptions(value.wsdl, {
            waitMsg: {
                target: me,
                msg: RS.$('All_Loading')
            },
            fn: function (services, ports) {
                if (services.length) {
                    me.cmbService.setValue(services[0].name);

                    var portRecord;
                    me.storePort.each(function (record) {
                        if (!portRecord || record.data.soapVersion > portRecord.data.soapVersion)
                            portRecord = record;
                    });

                    if (portRecord) {
                        me.cmbPort.setValue(portRecord.data.name);
                        me.edtLocation.setValue(portRecord.data.location);
                    }

                    me.fireEvent('wsdlchange', value.wsdl);
                    portRecord && me.cmbPort.fireEvent('select', me.cmbPort, portRecord);
                }
            }
        });
    },

    updateOptions: function (wsdl, cfg) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/WebService.ashx'),
            params: {
                method: 'GetServiceDescptionWSDL',
                wsdl: wsdl,
                operations: true
            },
            success: function (action) {
                var services = action.result,
                    ports = (services[0] && services[0].ports) || [],
                    operations = (ports[0] && ports[0].operations) || [];

                me.storeService.setData(services);
                me.storePort.setData(ports);
                me.storeOperations.setData(operations);

                cfg && cfg.fn && cfg.fn(services, ports, operations);
            }
        }, cfg));
    },

    fill: function (data) {
        var me = this;

        if (data.wsdl) {
            me.updateOptions(data.wsdl, {
                async: false
            });
        }

        data.operationId = data.messageName ? (data.operationName + ":" + data.messageName) : data.operationName;
        me.getForm().setValues(data);
        me.updateStatus();
    },

    save: function () {
        var me = this,
            rv = me.getValuesSubmit(),
            recPort = me.storePort.findRecord('name', rv.port),
            recOperation = me.storeOperations.findRecord('id', rv.operationId);

        if (recPort)
            rv.soapVersion = recPort.data.soapVersion;

        if (recOperation) {
            rv.operationName = recOperation.data.name;
            rv.messageName = recOperation.data.messageName;
        }
        delete rv.operationId;

        return rv;
    },

    updateStatus: function () {
    }
});