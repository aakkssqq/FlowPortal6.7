/*
config:
tables
events:
dataSchemaChanged
*/
Ext.define('YZSoft.bpm.propertypages.InterfaceGeneral', {
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
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_Process_InterfaceName'),
                name: 'InterfaceName'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('Process_Call_Param_Schema'),
                layout: 'hbox',
                items: [{
                    xclass: 'YZSoft.src.form.field.OpenFile',
                    flex: 1,
                    reference: 'edtXSDFile',
                    upload: {
                        fileTypes: '*.xsd',
                        typesDesc: RS.$('Process_XSD_File'),
                        fileSizeLimit: '100 MB',
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
                    margin:'0 0 0 3',
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