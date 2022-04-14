/*
config
tables
*/
Ext.define('YZSoft.bpm.propertypages.ProcessGeneral', {
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
                xtype: 'combo',
                fieldLabel: RS.$('Process_DataRelationshipType'),
                name: 'FormDataRelationshipType',
                store: {
                    fields: ['name', 'value'],
                    data: [
                        { value: 'PrimaryKey', name: RS.$('Process_DataRelationshipType_PrimaryKey') },
                        { value: 'TaskID', name: RS.$('Process_DataRelationshipType_TaskID') }
                    ]
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                editable: false,
                forceSelection: true
            }, {
                xclass: 'YZSoft.bpm.src.form.field.SNFormatField',
                fieldLabel: RS.$('All_SNFormat'),
                name: 'SNDefine',
                defaultField: 'BPMInstTasks.SerialNum',
                listeners: {
                    beforeShowDlg: function (edtField) {
                        edtField.tables = me.tables;
                    }
                }
            }, {
                xclass: 'YZSoft.bpm.src.form.field.FormField',
                fieldLabel: RS.$('Process_DefaultForm'),
                name: 'DefaultForm'
            }, {
                xtype: 'textarea',
                flex: 1,
                fieldLabel: RS.$('All_Process_Desc'),
                cls: 'yz-form-field-code',
                inputAttrTpl: new Ext.XTemplate([
                    'wrap="off"'
                ]),
                labelAlign: 'top',
                name: 'Description'
            }, {
                xtype: 'textarea',
                flex: 1,
                fieldLabel: RS.$('All_Process_TaskDescTemplate'),
                cls: 'yz-form-field-code',
                inputAttrTpl: new Ext.XTemplate([
                    'wrap="off"'
                ]),
                labelAlign: 'top',
                name: 'TaskDescTemplate',
                reference: 'edtTaskDescTemplate',
                margin: 0
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                margin: '3 0 0 0',
                items: [{
                    xclass: 'YZSoft.src.form.field.CodeSuggestField',
                    reference: 'edtCodeSuggest',
                    tables: config.tables,
                    emptyText: RS.$('All_CodeSuggest_EmptyText'),
                    flex: 1,
                    listeners: {
                        beforeShowDlg: function (edtField) {
                            edtField.tables = me.tables;
                        }
                    }
                }, {
                    xclass: 'YZSoft.src.button.InsertInPosButton',
                    reference: 'btnInsert',
                    text: RS.$('All_Insert'),
                    padding: '0 10',
                    margin: '0 0 0 3',
                    listeners: {
                        click: function () {
                            var refs = me.getReferences();
                            this.insertAtCaret('<%=' + refs.edtCodeSuggest.getValue() + '%>', {
                                nofocus: function () {
                                    YZSoft.alert(RS.$('All_MoveCursorToInsertPos'));
                                }
                            });
                        }
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.getReferences();
        refs.btnInsert.attach(refs.edtTaskDescTemplate);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        me.getForm().setValues(data);
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        return rv;
    }
});