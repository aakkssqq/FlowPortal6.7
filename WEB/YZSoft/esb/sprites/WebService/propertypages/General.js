/*
config:
relatedFile
*/
Ext.define('YZSoft.esb.sprites.WebService.propertypages.General', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.form.field.ConnectionField'
    ],
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },

    initComponent: function () {
        var me = this,
            designer = me.designer,
            sprite = me.sprite,
            properties = sprite.properties,
            dcnt = designer.drawContainer;

        me.storeService = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'ports']
        });

        me.storePort = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'soapVersion', 'location', 'operations']
        });

        me.storeOperations = Ext.create('Ext.data.JsonStore', {
            fields: ['id', 'name', 'messageName']
        });

        if (properties.connectionName) {
            me.updateOptions(properties.connectionName, properties.wsdlOffsetUrl, {
                async: false
            });
        }

        me.edtName = Ext.create('Ext.form.field.Text', {
            fieldLabel: RS.$('ESB_NodeName'),
            value: sprite.sprites.text.attr.text,
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                sprite.sprites.text.setAttributes({
                    text: value
                });

                dcnt.renderFrame();
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.mon(sprite, {
            rename: function (sprite, newName) {
                me.edtName.setValue(newName);
            }
        });

        me.cmbConnection = Ext.create('YZSoft.src.form.field.ConnectionField', {
            fieldLabel: RS.$('ESB_NodeConnectionName'),
            connectionType: 'WebService',
            value: properties.connectionName,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.connectionName = value;
            },
            listeners: {
                change: 'applySetting'
            }
        });

        me.edtWsdlOffsetUrl = Ext.create('Ext.form.field.Text', {
            name: 'wsdlOffsetUrl',
            flex: 1,
            emptyText: Ext.String.format(RS.$('ESB_WebService_wsdlOffsetUrl_EmptyText'), 'ormrpc/services/WSExportMaterialFacade'),
            value: properties.wsdlOffsetUrl
        });

        me.cmbService = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_CallWebService_service'),
            store: me.storeService,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            editable: false,
            forceSelection: true,
            value: properties.service,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.service = value;
            },
            listeners: {
                select: 'applySetting',
                change: 'applySetting'
            }
        });

        me.cmbPort = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_CallWebService_port'),
            store: me.storePort,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'name',
            editable: false,
            forceSelection: true,
            value: properties.port,
            applySetting: function (combo, rec, eOpts) {
                properties.port = rec.data.name;
                properties.soapVersion = rec.data.soapVersion;
            },
            listeners: {
                select: function (combo, rec, eOpts) {
                    this.applySetting(combo, rec, eOpts);
                    if (rec.data.location)
                        me.edtLocation.setValue(rec.data.location);
                }
            }
        });

        me.edtLocation = Ext.create('Ext.form.field.Text', {
            value: properties.location,
            flex: 1,
            margin: '0 0 0 10',
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());
                properties.location = value;
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.locationType = Ext.create('Ext.button.Segmented', {
            items: [{
                text: RS.$('ESB_WebService_LocationType_SameAsWsdl'),
                value: 'SameAsWsdl'
            }, {
                text: RS.$('ESB_WebService_LocationType_Absolute'),
                value: 'Absolute'
            }],
            value: properties.locationType,
            listeners: {
                change: function () {
                    var value = this.getValue();

                    properties.locationType = value;
                    switch (value) {
                        case 'SameAsWsdl':
                            me.edtLocation.hide();
                            break;
                        case 'Absolute':
                            me.edtLocation.show();
                            break;
                    }
                }
            }
        });

        me.cmbOperations = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('ESB_WebService_operationName'),
            store: me.storeOperations,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'id',
            editable: false,
            forceSelection: true,
            value: properties.messageName ? (properties.operationName + ":" + properties.messageName) : properties.operationName,
            applySetting: function (combo, rec, eOpts) {
                properties.operationName = rec.data.name;
                properties.messageName = rec.data.messageName;
            },
            listeners: {
                select: 'applySetting'
            }
        });

        me.items = [me.edtName, me.cmbConnection, {
            xtype: 'fieldcontainer',
            fieldLabel: RS.$('ESB_WebService_wsdlOffsetUrl'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.edtWsdlOffsetUrl, {
                xtype: 'button',
                text: RS.$('All_CallWebService_Goto'),
                margin: '0 0 0 3',
                scope: me,
                handler: 'onGoClick'
            }]
        }, me.cmbService, me.cmbPort, {
            xtype: 'fieldcontainer',
            fieldLabel: RS.$('All_CallWebService_location'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.locationType, me.edtLocation]
        }, me.cmbOperations];

        me.callParent();

        me.relayEvents(me.cmbConnection, ['select'], 'cn');
        me.relayEvents(me.cmbPort, ['select'], 'port');
        me.relayEvents(me.cmbOperations, ['select'], 'op');
    },

    onGoClick: function () {
        var me = this,
            sprite = me.sprite,
            properties = sprite.properties,
            connectionName = me.cmbConnection.getValue(),
            wsdlOffsetUrl = Ext.String.trim(me.edtWsdlOffsetUrl.getValue());

        if (!connectionName)
            return;

        properties.wsdlOffsetUrl = wsdlOffsetUrl;

        me.updateOptions(connectionName, wsdlOffsetUrl, {
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

                    me.fireEvent('wsdloffseturlchange', wsdlOffsetUrl);
                    portRecord && me.cmbPort.fireEvent('select', me.cmbPort, portRecord);
                }
            }
        });
    },

    updateOptions: function (connectionName, wsdlOffsetUrl, cfg) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/WebService.ashx'),
            params: {
                method: 'GetServiceDescption',
                connectionName: connectionName,
                wsdlOffsetUrl: wsdlOffsetUrl,
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
    }
});