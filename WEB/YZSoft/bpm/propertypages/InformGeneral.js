/*
config:
relatedFile
*/
Ext.define('YZSoft.bpm.propertypages.InformGeneral', {
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
            },{
                xclass: 'YZSoft.bpm.src.form.field.FormField',
                fieldLabel: RS.$('All_Form'),
                emptyText: RS.$('All_BPM_UseDefaultForm'),
                name: 'Form'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_BPM_MobileForm'),
                emptyText:RS.$('All_BPM_UseDefaultForm'),
                name: 'MobileForm'
            }, {
                xtype: 'fieldset',
                title: RS.$('All_Type'),
                items: [{
                    xtype: 'radiogroup',
                    padding: '3 6',
                    columns: 1,
                    defaults: {
                        name: 'InformType',
                        listeners: {
                            change: function () {
                                me.fireEvent('informTypeChanged', me.save().InformType);
                            }
                        }
                    },
                    items: [
                        { boxLabel: RS.$('All_Inform'), inputValue: 'Inform' },
                        { boxLabel: RS.$('All_Indicate'), inputValue: 'InviteIndicate' }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_BPA_KMCenter'),
                hidden: YZSoft.modules.BPA === false,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpa.src.form.field.FileSpriteComboBox',
                    fieldLabel: RS.$('All_BPM_BPAActivityLink'),
                    emptyText: config.relatedFile ? RS.$('All_BPM_BPAActivityLink_PlaceHolder') : RS.$('All_BPM_BPAActivityLink_PlaceHolder_NoProcessLink'),
                    disabled: !config.relatedFile,
                    name: 'RelatiedSprite',
                    fileid: config.relatedFile,
                    margin: '7 0 20 10'
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