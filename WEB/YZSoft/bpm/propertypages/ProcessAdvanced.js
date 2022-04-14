/*
config
tables
*/
Ext.define('YZSoft.bpm.propertypages.ProcessAdvanced', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Advanced'),
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
                xtype: 'fieldset',
                title: RS.$('All_BPM_Fieldset_ArchivedProcess'),
                padding: '0 18 8 18',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpm.src.form.field.FormField',
                    fieldLabel: RS.$('Process_ReadForm'),
                    name: 'ReadForm'
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_BPM_Fieldset_MultiReportLine'),
                padding: '0 18 8 18',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    margin: '0 0 10 0',
                    fieldLabel: RS.$('All_BPM_Label_UseSpecReportLine'),
                    emptyText: RS.$('All_BPM_PlaceHolder_UseSpecReportLine'),
                    name: 'BizType'
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_MobileAppName'),
                padding: '0 18 0 18',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: RS.$('All_ProcessShortName'),
                    layout: 'hbox',
                    margin: 0,
                    items: [{
                        xtype: 'textfield',
                        width: 120,
                        emptyText: RS.$('All_BPM_PlaceHolder_ProcessShortName'),
                        name: 'ShortName'
                    }, {
                        xtype: 'displayfield',
                        value: RS.$('All_ProcessColor'),
                        margin: '0 6 0 20'
                    }, {
                        xclass: 'YZSoft.src.button.ColorPickerTextBox',
                        reference: 'colorpicker',
                        flex: 1,
                        margin: '0 0 0 3'
                    }]
                }, {
                    xtype: 'textfield',
                    fieldLabel: RS.$('Process_DefaultMobileForm'),
                    margin: '0 0 2 0',
                    emptyText: RS.$('All_BPM_PlaceHolder_MobileForm'),
                    name: 'DefaultMobileForm'
                }, {
                    xclass: 'Ext.form.field.Checkbox',
                    fieldLabel: '&nbsp;',
                    labelSeparator: false,
                    boxLabel: RS.$('All_MobileInitiation'),
                    name: 'MobileInitiation'
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_BPM_Fieldset_BPARelationship'),
                hidden: YZSoft.modules.BPA === false,
                padding: '0 18 8 18',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpa.src.form.field.SpecFileField',
                    fieldLabel: RS.$('All_BPM_Label_BPAFileLink'),
                    name: 'RelatedFile',
                    dlg: {
                        title: RS.$('All_BPM_Title_SelectBPAFile'),
                        folderType: 'BPAProcess'
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        me.getForm().setValues(data);
        refs.colorpicker.setColor(data.Color);
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        rv.Color = refs.colorpicker.color;
        return rv;
    }
});