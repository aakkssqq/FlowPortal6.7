/*
config:
*/
Ext.define('YZSoft.src.jschema.editdlg.Import', {
    extend: 'Ext.window.Window',
    title: RS.$('JSchame_ImportSchema'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 900,
    minWidth: 900,
    height: 646,
    modal: true,
    resizable: true,
    bodyPadding: '10 26 5 26',
    converts: {
        jsonSample: 'JSONSample2JSchema',
        jsonSchema: 'JSONSchema2JSchema',
        xmlSample: 'XMLSample2JSchema',
        xmlSchema: 'XMLSchema2JSchema'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnImportType = Ext.create('Ext.button.Segmented', {
            items: [{
                text: RS.$('All_JSchema_Import_jsonSample'),
                pressed: true,
                value: 'jsonSample'
            }, {
                text: RS.$('All_JSchema_Import_jsonSchema'),
                value: 'jsonSchema'
            },{
                text: RS.$('All_JSchema_Import_xmlSample'),
                value: 'xmlSample'
            }, {
                text: RS.$('All_JSchema_Import_xmlSchema'),
                value: 'xmlSchema'
            }],
            listeners: {
                toggle: function (container, button, pressed) {
                    me.updateStatus();
                }
            }
        });

        me.jsonSample = Ext.create('YZSoft.src.form.field.OpenFile', {
            fieldLabel: RS.$('All_FileUpload'),
            emptyText: RS.$('All_Upload_JsonSample_EmptyText'),
            hidden: true,
            upload: {
                fileTypes: '*.json',
                typesDesc: RS.$('All_JSchame_UploadFileDesc_JsonSample'),
                fileSizeLimit: '100 MB',
                params: {
                    Method: 'GetFileContent'
                }
            },
            listeners: {
                uploadSuccess: function (file, data) {
                    me.jsonSampleEdt.setValue(data);
                    me.updateSchema();
                }
            }
        });

        me.jsonSchema = Ext.create('YZSoft.src.form.field.OpenFile', {
            fieldLabel: RS.$('All_FileUpload'),
            emptyText: RS.$('All_Upload_JsonSchema_EmptyText'),
            hidden: true,
            upload: {
                fileTypes: '*.json',
                typesDesc: RS.$('All_JSchame_UploadFileDesc_JsonSchema'),
                fileSizeLimit: '100 MB',
                params: {
                    Method: 'GetFileContent'
                }
            },
            listeners: {
                uploadSuccess: function (file, data) {
                    me.jsonSchemaEdt.setValue(data);
                    me.updateSchema();
                }
            }
        });

        me.xmlSample = Ext.create('YZSoft.src.form.field.OpenFile', {
            fieldLabel: RS.$('All_FileUpload'),
            emptyText: RS.$('All_Upload_XmlSample_EmptyText'),
            upload: {
                fileTypes: '*.xml',
                typesDesc: RS.$('All_JSchame_UploadFileDesc_XML'),
                fileSizeLimit: '100 MB',
                params: {
                    Method: 'GetFileContent'
                }
            },
            listeners: {
                uploadSuccess: function (file, data) {
                    me.xmlSampleEdt.setValue(data);
                    me.updateSchema();
                }
            }
        });

        me.xmlSchema = Ext.create('YZSoft.src.form.field.OpenFile', {
            fieldLabel: RS.$('All_FileUpload'),
            emptyText: RS.$('All_Upload_XsdSample_EmptyText'),
            hidden: true,
            upload: {
                fileTypes: '*.xsd',
                typesDesc:RS.$('All_JSchame_UploadFileDesc_XSD'),
                fileSizeLimit: '100 MB',
                params: {
                    Method: 'GetFileContent'
                }
            },
            listeners: {
                uploadSuccess: function (file, data) {
                    me.xmlSchemaEdt.setValue(data);
                    me.updateSchema();
                }
            }
        });

        me.jsonSampleEdt = Ext.create('YZSoft.src.form.field.JsonEditor', {
            fieldLabel: RS.$('All_JSchema_ImportType_jsonSample'),
            labelAlign: 'top'
        });

        me.jsonSchemaEdt = Ext.create('YZSoft.src.form.field.JsonEditor', {
            fieldLabel: RS.$('All_JSchema_ImportType_jsonSchema'),
            labelAlign: 'top'
        });

        me.xmlSampleEdt = Ext.create('YZSoft.src.form.field.XMLEditor', {
            fieldLabel: RS.$('All_JSchema_ImportType_xmlSample'),
            labelAlign:'top'
        });

        me.xmlSchemaEdt = Ext.create('YZSoft.src.form.field.XMLEditor', {
            fieldLabel: RS.$('All_JSchema_ImportType_xmlSchema'),
            labelAlign: 'top'
        });

        me.cardSrc = Ext.create('Ext.container.Container', {
            layout: 'card',
            flex: 1,
            activeItem: me.xmlSampleEdt,
            items: [
                me.jsonSampleEdt,
                me.jsonSchemaEdt,
                me.xmlSampleEdt,
                me.xmlSchemaEdt
            ]
        });

        me.btnGen = Ext.create('Ext.button.Button', {
            glyph: 0xeb32,
            handler: function () {
                me.updateSchema();
            }
        });

        me.treeSchema = Ext.create('YZSoft.src.jschema.tree.PreviewTree', {
            border: true,
            cls:'yz-border-t'
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_Save'),
            cls: 'yz-btn-default',
            handler: function () {
                if (!me.curSchema)
                    return;

                me.closeDialog(me.curSchema);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_JSchema_ImportType'),
                items: [me.btnImportType]
            },
            me.jsonSample,
            me.jsonSchema,
            me.xmlSample,
            me.xmlSchema,{
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align:'stretch'
                },
                items: [
                    me.cardSrc, {
                    xtype: 'container',
                    padding: '0 11 0 10',
                    layout: 'center',
                    items: [
                        me.btnGen
                    ]
                },{
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('All_JSchema_Import_SchemaPreview'),
                    labelAlign: 'top',
                    flex: 1,
                    layout:'fit',
                    items: [me.treeSchema]
                }]
            }],
            buttons: [me.btnOK, me.btnCancel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    updateSchema: function (config) {
        var me = this,
            importType = me.btnImportType.getValue(),
            src = Ext.String.trim(me.cardSrc.getLayout().getActiveItem().getValue());

        if (!src)
            return;

        YZSoft.Ajax.request(Ext.apply({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/DesignTime/JSchema.ashx'),
            params: {
                method: me.converts[importType]
            },
            jsonData: src,
            waitMsg: {
                msg: RS.$('All_JSchema_Import_LoadMask_Transforming'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.curSchema = action.result;
                me.treeSchema.setSchema({
                    result: action.result
                });

                me.updateStatus();
            }
        }, config));
    },

    updateStatus: function () {
        var me = this,
            importType = me.btnImportType.getValue();

        Ext.each(['jsonSample', 'jsonSchema', 'xmlSample', 'xmlSchema'], function (type) {
            me[type][importType == type ? 'show' : 'hide']();
        });

        me.cardSrc.setActiveItem(me[importType + 'Edt']);
        me.btnOK.setDisabled(!me.curSchema);
    }
});