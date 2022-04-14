/*
config:
tables
stepNames
*/
Ext.define('YZSoft.bpm.propertypages.FreeRoutingParticipant', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_FreeRoutingParticipant'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            stepNameData = [],
            cfg;

        Ext.each(config.stepNames, function (name) {
            stepNameData.push({ Name: name });
        });

        me.cmbRecpDeclareStep = Ext.create({
            xtype: 'combo',
            fieldLabel: RS.$('Process_FreeRoutingRecp'),
            name: 'RecpDeclareStep',
            store: {
                fields: ['Name'],
                data: stepNameData
            },
            editable: true,
            queryMode: 'local',
            valueField: 'Name',
            displayField: 'Name',
            width: 460
        });

        me.chkUserSelect = Ext.create('Ext.button.Segmented', {
            defaults: {
            },
            items: [{
                text: RS.$('All_OnlyOneUser'),
                value: false
            }, {
                text: RS.$('All_MultiUser'),
                value: true
            }],
            listeners: {
                scope: me,
                toggle: 'updateStatus'
            }
        });

        me.chkRoutingType = Ext.create('Ext.button.Segmented', {
            defaults: {
            },
            items: [{
                text: RS.$('All_ConsignRoutingType_Serial'),
                value: 'Serial'
            }, {
                text: RS.$('All_ConsignRoutingType_Parallel'),
                value: 'Parallel'
            }, {
                text: RS.$('All_DeclareByRecipiant'),
                value: 'None'
            }]
        });

        me.chkJumpIfNoParticipants = Ext.create('Ext.button.Segmented', {
            defaults: {
            },
            items: [{
                text: RS.$('All_AutoApproveThisStep'),
                value: true
            }, {
                text: RS.$('Process_PreventSubmit'),
                value: false
            }]
        });

        cfg = {
            defaults: {
            },
            items: [{
                xtype: 'container',
                layout: 'vbox',
                defaults: {
                    labelWidth: 160
                },
                items: [
                    me.cmbRecpDeclareStep, {
                        xtype: 'fieldcontainer',
                        fieldLabel: RS.$('Process_FreeRouting_SelUser'),
                        items: [
                            me.chkUserSelect
                        ]
                    }, {
                        xtype: 'fieldcontainer',
                        fieldLabel: RS.$('Process_FreeRouting_Routing'),
                        items: [
                            me.chkRoutingType
                        ]
                    }, {
                        xtype: 'fieldcontainer',
                        fieldLabel: RS.$('Process_FreeRouting_NoRecipiant'),
                        items: [
                            me.chkJumpIfNoParticipants
                        ]
                    }
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    fill: function (data) {
        var me = this;

        data.RecpDeclareStep = data.RecpDeclareSteps.join(',');
        me.getForm().setValues(data);

        me.chkUserSelect.setValue(data.MultiRecipient);
        me.chkRoutingType.setValue(data.RoutingType);
        me.chkJumpIfNoParticipants.setValue(data.JumpIfNoParticipants);

        me.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        rv.RecpDeclareSteps = rv.RecpDeclareStep ? rv.RecpDeclareStep.split(/[,;]/g) : [];
        delete rv.RecpDeclareStep;

        rv.MultiRecipient = me.chkUserSelect.getValue();
        rv.RoutingType = me.chkRoutingType.getValue();
        rv.JumpIfNoParticipants = me.chkJumpIfNoParticipants.getValue();

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        me.chkRoutingType.setDisabled(!data.MultiRecipient);
    }
});