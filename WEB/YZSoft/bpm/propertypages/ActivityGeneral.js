/*
config:
relatedFile
*/
Ext.define('YZSoft.bpm.propertypages.ActivityGeneral', {
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
                title: RS.$('Process_FieldSet_NodePermisions'),
                items: [{
                    xtype: 'checkboxgroup',
                    columns: 5,
                    returnArray: true,
                    defaults: {
                        submitValue: false,
                        name: 'Permision'
                    },
                    items: [
                        { boxLabel: RS.$('Process_NodePerm_BatchApprove'), inputValue: 'BatchApprove' },
                        { boxLabel: RS.$('Process_NodePerm_RecedeRestart'), inputValue: 'RecedeRestart' },
                        { boxLabel: RS.$('Process_NodePerm_Reject'), inputValue: 'Reject' },
                        { boxLabel: RS.$('Process_NodePerm_Transfer'), inputValue: 'Transfer' },
                        { boxLabel: RS.$('Process_NodePerm_Inform'), inputValue: 'Inform' },
                        { boxLabel: RS.$('Process_NodePerm_InviteIndicate'), inputValue: 'InviteIndicate' },
                        { boxLabel: RS.$('Process_NodePerm_Public'), inputValue: 'Public' },
                        { boxLabel: RS.$('Process_NodePerm_PickBack'), inputValue: 'PickBack' },
                        { boxLabel: RS.$('Process_NodePerm_RecedeBack'), inputValue: 'RecedeBack' },
                        { boxLabel: RS.$('Process_NodePerm_Jump'), inputValue: 'Jump' },
                        { boxLabel: RS.$('Process_NodePerm_Consign'), inputValue: 'Consign' },
                        { boxLabel: RS.$('Process_NodePerm_Abort'), inputValue: 'Abort' },
                        { boxLabel: RS.$('Process_NodePerm_Delete'), inputValue: 'Delete' },
                        { boxLabel: RS.$('Process_NodePerm_MobileApprove'), inputValue: 'MobileApprove' }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_BizType'),
                items: [{
                    xtype: 'radiogroup',
                    columns: 1,
                    items: [{
                        xtype: 'radio',
                        boxLabel: RS.$('Process_BizType_Inheri'),
                        name: 'BizTypeInheri1',
                        inputValue: 'true',
                        listeners: {
                            change: function () {
                                me.fireEvent('change');
                                me.updateStatus();
                            }
                        }
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [{
                            xtype: 'radio',
                            boxLabel: RS.$('Process_BizType_Spec'),
                            name: 'BizTypeInheri1',
                            inputValue: 'false',
                            listeners: {
                                change: function () {
                                    me.updateStatus();
                                }
                            }
                        }, {
                            xtype: 'textfield',
                            name: 'BizType',
                            reference: 'edtBizType',
                            margin: '0 0 0 20',
                            width: 160
                        }]
                    }]
                }]
            }, Ext.apply({
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
            }, config.RelatiedSpriteConfig)]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        data.BizTypeInheri1 = data.BizTypeInheri.toString();

        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();
        rv.PickBackUnProcessedStepOnly = true;

        rv.BizTypeInheri = rv.BizTypeInheri1 == 'false' ? false : true;
        delete rv.BizTypeInheri1;

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        refs.edtBizType.setDisabled(data.BizTypeInheri);
    }
});