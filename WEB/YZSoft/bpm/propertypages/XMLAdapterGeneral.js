/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.XMLAdapterGeneral', {
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
                margin: '0 0 0 0',
                labelWidth: 121,
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_GenerateStandard'),
                margin: '8 0 0 0',
                padding:'5 20 5 20',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    margin: 0,
                    items: [{
                        xtype: 'radio',
                        name: 'BySchema1',
                        inputValue: 'true',
                        value: true,
                        boxLabel: RS.$('Process_XMLAdapter_ByXSD'),
                        listeners: {
                            scope: me,
                            change: 'onCheckChange'
                        }
                    }, {
                        xtype: 'displayfield',
                        margin: '0 18 0 60',
                        value: RS.$('Process_XMLAdapter_XSDFile_Label') + ':',
                        reference:'labSchema'
                    }, {
                        xclass: 'YZSoft.src.form.field.OpenFile',
                        flex: 1,
                        reference:'edtSchema',
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
                    }]
                }, {
                    xtype: 'radio',
                    boxLabel: RS.$('Process_XMLAdapter_NoXSDUseMap'),
                    name: 'BySchema1',
                    inputValue: 'false',
                    listeners: {
                        scope: me,
                        change: 'onCheckChange'
                    }
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_OutputLocation'),
                margin: '8 0 0 0',
                padding: '5 20 5 20',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpm.src.form.field.ExtServerField',
                    fieldLabel: RS.$('Process_Taget_Server'),
                    name: 'ServerName',
                    reference: 'edtServerName',
                    serverTypes: ['Local', 'FTPServer']
                }, {
                    xclass: 'YZSoft.bpm.src.form.field.FSSFolderField',
                    fieldLabel: RS.$('Process_Taget_Folder'),
                    name: 'Path',
                    margin:'0 0 12 0',
                    listeners: {
                        beforeBrowser: function () {
                            this.serverName = me.getReferences().edtServerName.getValue();
                        }
                    }
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_OutputOptions'),
                margin: '8 0 0 0',
                padding: '5 20 5 20',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('All_FileName'),
                    layout: 'hbox',
                    margin: 0,
                    items: [{
                        xtype: 'textfield',
                        flex: 1,
                        name: 'FileName'
                    }, {
                        xtype: 'displayfield',
                        value: RS.$('All_FileEncode') + ':',
                        margin: '0 6 0 30'
                    }, {
                        xtype: 'combobox',
                        width: 120,
                        name: 'EncodeType',
                        store: {
                            fields: ['name', 'value'],
                            data: [
                                { value: 'GB2312', name: 'GB2312' },
                                { value: 'BIG5', name: 'BIG5' },
                                { value: 'JIS', name: 'JIS' },
                                { value: 'UTF8', name: 'UTF-8' },
                                { value: 'Unicode', name: 'Unicode' }
                            ]
                        },
                        value: 'UTF8',
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'value',
                        editable: false,
                        forceSelection: true
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('Process_FileOutput_Overwrite'),
                    layout: 'hbox',
                    defaults: {
                        xtype: 'radio',
                        name: 'Overwrite1',
                        flex: 1
                    },
                    items: [
                        { boxLabel: RS.$('Process_FileOutput_Overwrite_No'), inputValue: 'false', value: true },
                        { boxLabel: RS.$('Process_FileOutput_Overwrite_Yes'), inputValue: 'true' }
                    ]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        data.BySchema1 = data.BySchema.toString();
        delete data.BySchema;

        data.Overwrite1 = data.Overwrite.toString();
        delete data.Overwrite;

        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        rv.BySchema = rv.BySchema1 == 'false' ? false : true;
        delete rv.BySchema1;

        rv.Overwrite = rv.Overwrite1 == 'false' ? false : true;
        delete rv.Overwrite1;

        return rv;
    },

    onCheckChange: function (radio, newValue, oldValue, eOpts) {
        var me = this,
            data = me.save();
        
        me.fireEvent('bySchemaChanged', data.BySchema);
        me.updateStatus();
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        refs.labSchema.setDisabled(!data.BySchema);
        refs.edtSchema.setDisabled(!data.BySchema);
    }
});