/*
config:
relatedFile
*/
Ext.define('YZSoft.bpm.propertypages.DecisionStepGeneral', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_General'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this;

        var cfg = {
            defaults: {
                labelWidth: 78
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_DecisionStepName'),
                name: 'StepName',
                reference: 'edtName'
            }, {
                xtype: 'fieldcontainer',
                flex: 1,
                fieldLabel: RS.$('Process_DecisionCondition'),
                margin: 0,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.src.form.field.CondByFormField',
                    reference: 'edtCodeAssist',
                    margin: '0 0 2 0'
                }, {
                    xtype: 'textarea',
                    flex: 1,
                    name: 'Condition',
                    reference: 'edtCondition'
                }]
            }, {
                xclass: 'YZSoft.bpa.src.form.field.FileSpriteComboBox',
                fieldLabel: RS.$('All_BPM_BPAActivityLink'),
                emptyText: config.relatedFile ? RS.$('All_BPM_BPAActivityLink_PlaceHolder') : RS.$('All_BPM_BPAActivityLink_PlaceHolder_NoProcessLink'),
                disabled: !config.relatedFile,
                name: 'RelatiedSprite',
                fileid: config.relatedFile,
                width: 320
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.getReferences();
        refs.edtCodeAssist.relayEvents(me, ['tablesChanged']);
        refs.edtCodeAssist.attach(refs.edtCondition);
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