/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.EndGeneral', {
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
                xtype: 'fieldset',
                title: RS.$('All_Type'),
                margin:'8 0 0 0',
                items: [{
                    xtype: 'radiogroup',
                    padding: '3 6',
                    columns: 1,
                    defaults: {
                        name: 'EndType'
                    },
                    items: [
                        { boxLabel: RS.$('Process_EndType_Approve'), inputValue: 'Approve' },
                        { boxLabel: RS.$('Process_EndType_Reject'), inputValue: 'Reject' }
                    ]
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