/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.FileTriggerGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xclass: 'YZSoft.bpm.src.form.field.FSSFolderField',
                fieldLabel: RS.$('Process_FileTrigger_MonitFolder'),
                name: 'MonitorFolder',
                serverName: 'localhost'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Process_FileTrigger_MonitFileFilter'),
                emptyText: RS.$('Process_FileTrigger_MonitFileFilter_EmptyText'),
                name: 'FileFilter'
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FileTrigger_DataIn'),
                padding: '4 15',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'radio',
                    boxLabel: RS.$('Process_FileTrigger_ImportData'),
                    value: true,
                    name: 'TriggerType',
                    inputValue: 'ImportData',
                    margin: '0 0 0 4',
                    listeners: {
                        scope: me,
                        change: 'onTriggerTypeChange'
                    }
                }, {
                    xclass: 'YZSoft.src.form.field.OpenFile',
                    fieldLabel: RS.$('Process_FileTrigger_DataSchema'),
                    reference: 'edtXmlUpload',
                    labelAlign: 'top',
                    margin: '0 0 0 22',
                    upload: {
                        fileTypes: '*.xsd;*.xml',
                        typesDesc: RS.$('All_FileTypeDesc_XML_XSD'),
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
                    xtype: 'radio',
                    boxLabel: RS.$('Process_FileTrigge_AsAttachment'),
                    name: 'TriggerType',
                    inputValue: 'AsAttach',
                    margin: '3 0 0 4',
                    listeners: {
                        scope: me,
                        change: 'onTriggerTypeChange'
                    }
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FileTrigger_AfterTrigger'),
                padding: '4 15',
                items: {
                    xtype: 'radiogroup',
                    columns: 1,
                    defaults: {
                        name: 'ArchiveAfterExecute1'
                    },
                    items: [
                        { boxLabel: RS.$('Process_FileTrigger_ArchiveTriggerFile'), value: true, inputValue: 'true' },
                        { boxLabel: RS.$('Process_FileTrigger_DeleteTriggerFile'), inputValue: 'false' }
                    ]
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        data.ArchiveAfterExecute1 = data.ArchiveAfterExecute.toString();
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        rv.ArchiveAfterExecute = rv.ArchiveAfterExecute1 == 'false' ? false : true;
        delete rv.ArchiveAfterExecute1;

        return rv;
    },

    onTriggerTypeChange: function (radio, newValue, oldValue, eOpts) {
        var me = this,
            data = me.save();

        me.fireEvent('triggerTypeChange', data.TriggerType);
        me.updateStatus();
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        refs.edtXmlUpload.setDisabled(data.TriggerType != 'ImportData');
    }
});