/*
config:
tables
*/
Ext.define('YZSoft.bpm.propertypages.FileAdapterGeneral', {
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
                labelWidth: 116,
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FileAdapter_ArchiveFiles'),
                padding:'5 15 0 15',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpm.src.form.field.FormFieldsField',
                    fieldLabel: RS.$('Process_FileAdapter_AttachmentFields'),
                    name: 'AttachmentFields',
                    tables: config.tables,
                    dlgConfig: {
                        title: RS.$('Process_FileAdapter_SelFieldsDlg_Title'),
                        datatype: 'String'
                    }
                },{
                    xtype: 'textfield',
                    fieldLabel: RS.$('Process_FileAdapter_Filter'),
                    emptyText: RS.$('Process_FileAdapter_Filter_EmptyText'),
                    name: 'Filter',
                    margin: '0 0 12 0'
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FileAdapter_ArchiveTarget'),
                padding: '5 15 0 15',
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
                    margin: '0 0 12 0',
                    listeners: {
                        beforeBrowser: function () {
                            this.serverName = me.getReferences().edtServerName.getValue();
                        }
                    }
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FileAdapter_ArchiveOptions'),
                padding: '5 15 0 15',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    fieldLabel: RS.$('Process_FileAdapter_Prefix'),
                    name: 'Prefix'
                }, {
                    xtype: 'textfield',
                    fieldLabel: RS.$('Process_FileAdapter_PostFix'),
                    name: 'Postfix'
                }, {
                    xtype: 'radiogroup',
                    fieldLabel: RS.$('Process_FileOutput_Overwrite'),
                    defaults: {
                        name: 'Overwrite1'
                    },
                    items: [
                        { boxLabel: RS.$('Process_FileOutput_Overwrite_No'), inputValue: 'false' },
                        { boxLabel: RS.$('Process_FileOutput_Overwrite_Yes'), inputValue: 'true' }
                    ]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        data.Overwrite1 = data.Overwrite.toString();
        delete data.Overwrite;

        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            attachmentFields = [],
            rv;

        rv = me.getValuesSubmit();
        rv.Overwrite = rv.Overwrite1 == 'false' ? false : true;
        delete rv.Overwrite1;

        Ext.each(rv.AttachmentFields, function (field) {
            attachmentFields.push(field.tableName + '.' + field.columnName);
        });
        rv.AttachmentFields = attachmentFields;

        return rv;
    },

    updateStatus: function () {
    }
});