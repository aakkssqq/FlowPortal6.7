/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.ConditionGeneral', {
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
                anchor: '100%'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('All_StepName'),
                name: 'Name',
                reference: 'edtName'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('Process_Cond_ExpressDisplay'),
                name: 'ExpressMean'
            }, {
                xtype: 'fieldcontainer',
                flex: 1,
                fieldLabel: RS.$('Process_Cond_Express'),
                margin: 0,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.src.form.field.CondByFormField',
                    reference: 'edtCodeAssist1',
                    margin: '0 0 2 0',
                    compareField: {
                        emptyText:RS.$('All_FormField'),
                        tables: config.tables
                    }
                }, {
                    xclass: 'YZSoft.src.form.field.CondByPositionField',
                    reference: 'edtCodeAssist2',
                    margin: '0 0 2 0'
                }, {
                    xclass: 'YZSoft.src.form.field.CondByUserPropertyField',
                    reference: 'edtCodeAssist3',
                    margin: '0 0 2 0'
                }, {
                    xtype: 'textarea',
                    flex: 1,
                    name: 'Express',
                    reference: 'edtCondition'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var refs = me.getReferences();
        //refs.edtCodeAssist.relayEvents(me, ['tablesChanged']);
        refs.edtCodeAssist1.attach(refs.edtCondition);
        refs.edtCodeAssist2.attach(refs.edtCondition);
        refs.edtCodeAssist3.attach(refs.edtCondition);

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