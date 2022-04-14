/*
config:
tables,
interfaceStepNames
events:
dataSchemaChanged
*/
Ext.define('YZSoft.bpm.propertypages.CallInterfaceGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                margin:'0 68 10 0',
                name: 'Name',
                reference: 'edtName'
            }, {
                xclass: 'YZSoft.bpm.src.editor.CallInterfaceTargetField',
                flex: 1,
                fieldLabel: RS.$('All_CallServer'),
                name: 'RemoteServers',
                interfaceStepNames:config.interfaceStepNames,
                labelAlign: 'top'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Process_Call_Param_Schema'),
                labelAlign: 'top',
                layout: 'hbox',
                items: [{
                    xclass: 'YZSoft.src.form.field.OpenFile',
                    margin: 0,
                    flex: 1,
                    reference: 'edtXSDFile',
                    upload: {
                        fileTypes: '*.xsd',
                        typesDesc: RS.$('Process_XSD_File'),
                        fileSizeLimit: '10 MB',
                        params: {
                            Method: 'XSD2DataSetSchema'
                        }
                    },
                    listeners: {
                        uploadSuccess: function (file, data) {
                            me.fireEvent('dataSchemaChanged', data.Tables);
                        }
                    }
                }, {
                    xtype: 'button',
                    text: RS.$('Process_XSD_CreateNew'),
                    margin:'0 0 0 2',
                    handler: function () {
                        Ext.create('YZSoft.bpm.src.dialogs.XSDFromDataSetMapDlg', {
                            autoShow:true,
                            tables: me.tables,
                            fn: function (dataSetSchema) {
                                me.fireEvent('dataSchemaChanged', dataSetSchema.Tables);                                
                            }
                        });
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    updateStatus: function () {
    }
});