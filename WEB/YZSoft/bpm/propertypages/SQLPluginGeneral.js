/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.SQLPluginGeneral', {
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
                xclass: 'YZSoft.bpm.src.form.field.ExtServerField',
                fieldLabel: RS.$('All_DataSource'),
                serverTypes: 'DataSourceServer',
                name: 'DataSourceName',
                btnCreateConfig: {
                    text: RS.$('Process_SqlPlugin_NewDataSource')
                }
            }, {
                xtype: 'textarea',
                flex: 1,
                fieldLabel: RS.$('Process_SqlPlugin_SqlCommand'),
                cls: 'yz-form-field-code',
                inputAttrTpl: new Ext.XTemplate([
                    'wrap="off"'
                ]),
                labelAlign: 'top',
                labelClsExtra: 'yz-lab-highlight',
                name: 'CommandText',
                reference: 'edtCommandText',
                margin: 0
            }, {
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                bodyStyle: 'background-color:transparent',
                border: false,
                margin: '3 0 0 0',
                items: [{
                    xclass: 'YZSoft.src.form.field.CodeSuggestField',
                    reference: 'edtCodeSuggest',
                    tables: config.tables,
                    emptyText: RS.$('All_CodeSuggest_EmptyText'),
                    flex: 1
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
        refs.btnInsert.attach(refs.edtCommandText);
    },

    fill: function (data) {
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            rv;

        rv = me.getValuesSubmit();
        return rv;
    },

    updateStatus: function () {
    }
});