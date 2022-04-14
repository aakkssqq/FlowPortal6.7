/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.CodePluginGeneral', {
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
                margin: '0 0 4 0'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'textarea',
                flex: 1,
                fieldLabel: RS.$('Process_CPlus_CodeTitle'),
                cls: 'yz-form-field-code',
                inputAttrTpl: new Ext.XTemplate([
                    'wrap="off"'
                ]),
                labelAlign: 'top',
                labelClsExtra: 'yz-lab-highlight',
                name:'Code',
                reference: 'edtCode',
                margin: 0
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align:'stretch'
                },
                margin: '2 0 0 0',
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
                            this.insertAtCaret(refs.edtCodeSuggest.getValue(), {
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
        refs.btnInsert.attach(refs.edtCode);
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