/*
config:
relatedFile
*/
Ext.define('YZSoft.bpm.propertypages.StartGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                anchor: '100%',
                margin: '0 0 6 0'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xclass: 'YZSoft.bpm.src.form.field.FormField',
                fieldLabel: RS.$('All_Form'),
                emptyText: RS.$('All_BPM_UseDefaultForm'),
                name: 'Form'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_BPM_MobileForm'),
                emptyText: RS.$('All_BPM_UseDefaultForm'),
                name: 'MobileForm'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Process_PersistParams'),
                name: 'PersistParams'
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_NodePermisions'),
                items: [{
                    xtype: 'checkboxgroup',
                    columns: 5,
                    returnArray: true,
                    defaults: {
                        submitValue: false,
                        name: 'Permision',
                        listeners: {
                            change: function () {
                                me.updateStatus();
                            }
                        }
                    },
                    items: [
                        { boxLabel: RS.$('Process_NodePerm_PickBackRestart'), inputValue: 'PickBackRestart' },
                        { boxLabel: RS.$('Process_NodePerm_Abort'), inputValue: 'Abort' },
                        { boxLabel: RS.$('Process_NodePerm_Delete'), inputValue: 'Delete' },
                        { boxLabel: RS.$('Process_NodePerm_Transfer'), inputValue: 'Transfer' },
                        { boxLabel: RS.$('Process_NodePerm_Inform'), inputValue: 'Inform' },
                        { boxLabel: RS.$('Process_NodePerm_InviteIndicate'), inputValue: 'InviteIndicate' },
                        { boxLabel: RS.$('Process_NodePerm_Public'), inputValue: 'Public' },
                        { boxLabel: RS.$('Process_NodePerm_Consign'), inputValue: 'Consign' },
                        { boxLabel: RS.$('Process_NodePerm_Jump'), inputValue: 'Jump' },
                        { boxLabel: RS.$('Process_NodePerm_MobileApprove'), inputValue: 'MobileApprove' },
                        { boxLabel: RS.$('Process_NodePerm_RecedeRestart'), inputValue: 'RecedeRestart' },
                        { boxLabel: RS.$('Process_NodePerm_Reject'), inputValue: 'Reject' }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_Pickback'),
                items: [{
                    xtype: 'radiogroup',
                    disabledCls: 'yz-fieldcontainer-disabled',
                    reference: 'grpPickback',
                    columns: 2,
                    defaults: {
                        name: 'PickBackUnProcessedStepOnly1'
                    },
                    items: [
                        { boxLabel: RS.$('Process_PickBack_Anytime'), inputValue: 'false' },
                        { boxLabel: RS.$('Process_PickBack_UnProcessedStepOnly'), inputValue: 'true' }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_BPA_KMCenter'),
                hidden: YZSoft.modules.BPA === false,
                layout: {
                    type:'vbox',
                    align:'stretch'
                },
                items: [{
                    xclass: 'YZSoft.bpa.src.form.field.FileSpriteComboBox',
                    fieldLabel:RS.$('All_BPM_BPAActivityLink'),
                    emptyText: config.relatedFile ? RS.$('All_BPM_BPAActivityLink_PlaceHolder'):RS.$('All_BPM_BPAActivityLink_PlaceHolder_NoProcessLink'),
                    disabled: !config.relatedFile,
                    name: 'RelatiedSprite',
                    fileid: config.relatedFile,
                    margin: '0 0 12 4'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        data.PickBackUnProcessedStepOnly1 = data.PickBackUnProcessedStepOnly.toString();

        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        rv.PickBackUnProcessedStepOnly = rv.PickBackUnProcessedStepOnly1 == 'false' ? false : true;
        delete rv.PickBackUnProcessedStepOnly1;

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        refs.grpPickback.setDisabled(!Ext.Array.contains(data.Permision,'PickBackRestart'));
    }
});