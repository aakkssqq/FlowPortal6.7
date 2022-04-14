/*
config:
tables
stepNames
*/
Ext.define('YZSoft.bpm.propertypages.CallProcessOwner', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('Process_Title_Owner'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            defaults: {
                labelAlign: 'top',
                margin: '2 0 0 0'
            },
            items: [{
                xclass: 'YZSoft.bpm.src.editor.ParticipantField',
                flex: 1,
                fieldLabel: RS.$('Process_Owner_CreateForTitle'),
                name: 'Participants',
                tables: config.tables,
                stepNames: config.stepNames,
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_Owner_CreatePolicy'),
                margin:'8 0 0 0',
                items: [{
                    xtype: 'radiogroup',
                    padding: '2 6',
                    columns: 1,
                    defaults: {
                        name:'PolicyType'
                    },
                    items: [
                        { boxLabel: RS.$('Process_Owner_CreatePolicy_FirstUser'), inputValue: 'FirstUser' },
                        { boxLabel: RS.$('Process_Owner_CreatePolicy_All'), inputValue: 'All' }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_WhenNoParticipant'),
                margin: '8 0 0 0',
                items: [{
                    xtype: 'radiogroup',
                    padding: '2 6',
                    columns: 3,
                    defaults: {
                        name: 'JumpIfNoParticipants1'
                    },
                    items: [
                        { boxLabel: RS.$('All_AutoApproveThisStep'), inputValue: 'true' },
                        { boxLabel: RS.$('Process_PreventSubmit'), inputValue: 'false' }
                    ]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        data.JumpIfNoParticipants1 = data.JumpIfNoParticipants.toString();
        data.PolicyType = data.ParticipantPolicy.PolicyType;
        delete data.ParticipantPolicy;

        this.getForm().setValues(data);
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        rv.JumpIfNoParticipants = rv.JumpIfNoParticipants1 == 'false' ? false : true;
        delete rv.JumpIfNoParticipants1;

        rv.ParticipantPolicy = {
            PolicyType: rv.PolicyType
        };

        return rv;
    }
});