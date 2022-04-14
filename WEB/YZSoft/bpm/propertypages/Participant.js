/*
config:
tables
stepNames
*/
Ext.define('YZSoft.bpm.propertypages.Participant', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Participant'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtParticipient = Ext.create('YZSoft.bpm.src.editor.ParticipantField', {
            name: 'Participants',
            tables: config.tables,
            stepNames: config.stepNames,
            flex: 1
        });

        cfg = {
            defaults: {
                labelAlign: 'top'
            },
            items: [me.edtParticipient, {
                xtype: 'fieldset',
                title: RS.$('Process_Participant_Policy'),
                items: [{
                    xtype: 'radiogroup',
                    columns: 1,
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [{
                            xtype: 'radio',
                            boxLabel: RS.$('Process_Participant_Policy_FirstUser'),
                            width: 180,
                            name: 'PolicyType',
                            inputValue: 'FirstUser',
                            listeners: {
                                change: function () {
                                    me.updateStatus();
                                }
                            }
                        }, {
                            xtype: 'checkbox',
                            boxLabel: RS.$('Process_Participant_EnableAgent'),
                            name: 'FirstUserBParam1',
                            reference: 'chkFirstUserBParam1',
                            margin: '0 0 0 20'
                        }]
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [{
                            xtype: 'radio',
                            boxLabel: RS.$('Process_Participant_Policy_Share'),
                            width: 180,
                            name: 'PolicyType',
                            inputValue: 'Share',
                            listeners: {
                                change: function () {
                                    me.updateStatus();
                                }
                            }
                        }, {
                            xtype: 'checkbox',
                            boxLabel: RS.$('Process_Participant_SendToFirstShareUser'),
                            name: 'ShareBParam1',
                            reference: 'chkShareBParam1',
                            margin: '0 0 0 20'
                        }]
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [{
                            xtype: 'radio',
                            boxLabel: RS.$('Process_Participant_Policy_All'),
                            width: 180,
                            name: 'PolicyType',
                            inputValue: 'All',
                            listeners: {
                                change: function () {
                                    me.updateStatus();
                                }
                            }
                        }, {
                            xtype: 'checkbox',
                            boxLabel: RS.$('Process_Participant_EnableAgent'),
                            name: 'AllBParam1',
                            reference: 'chkAllBParam1',
                            margin: '0 0 0 20'
                        }]
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_WhenNoParticipant'),
                items: [{
                    xtype: 'radiogroup',
                    columns: 3,
                    defaults: {
                        name: 'NoParticipantsAction'
                    },
                    items: [
                        { boxLabel: RS.$('All_AutoApproveThisStep'), inputValue: 'Jump' },
                        { boxLabel: RS.$('Process_PreventSubmit'), inputValue: 'PreventSubmit' },
                        { boxLabel: RS.$('Process_ToExceptionList'), inputValue: 'SendToExceptionList' }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_AutoApprove'),
                margin: 0,
                items: [{
                    xtype: 'checkboxgroup',
                    columns: 3,
                    defaults: {
                    },
                    items: [
                        { boxLabel: RS.$('Process_JumpIfSameOwnerWithInitiator'), name: 'JumpIfSameOwnerWithInitiator' },
                        { boxLabel: RS.$('Process_JumpIfSameOwnerWithPrevStep'), name: 'JumpIfSameOwnerWithPrevStep' },
                        { boxLabel: RS.$('Process_JumpIfProcessed'), name: 'JumpIfProcessed' }
                    ]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.edtParticipient.relayEvents(me, ['tablesChanged']);
    },

    fill: function (data) {
        data.PolicyType = data.ParticipantPolicy.PolicyType;
        data[data.PolicyType + 'BParam1'] = data.ParticipantPolicy.BParam1;
        delete data.ParticipantPolicy;

        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        rv.ParticipantPolicy = {
            PolicyType: rv.PolicyType,
            BParam1: rv[rv.PolicyType + 'BParam1']
        };
        delete rv.FirstUserBParam1;
        delete rv.ShareBParam1;
        delete rv.AllBParam1;

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        Ext.each(['FirstUser', 'Share', 'All'], function (type) {
            var typeChecked = data.ParticipantPolicy.PolicyType == type,
                chkbox = refs['chk' + type + 'BParam1'];

            chkbox.setDisabled(!typeChecked);
        });
    }
});