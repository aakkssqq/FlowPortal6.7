/*
config:
showConfirmPanel
showConditionPanel
showDefaultRoutePanel
showVotePanel
*/
Ext.define('YZSoft.bpm.propertypages.LinkGeneral', {
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
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: RS.$('Process_Link_DisplayString'),
                name: 'DisplayString',
                reference: 'edtDisplayString'
            }, {
                xtype: 'textfield',
                fieldLabel: RS.$('All_ValidationGroup'),
                name: 'ValidationGroup'
            }, {
                xtype: 'fieldset',
                padding: '0 18 8 18',
                margin: '6 0 0 0',
                title: RS.$('Process_Link_SumbitCfm'),
                hidden: !config.showConfirmPanel,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 0 3 0'
                },
                items: [{
                    xtype: 'radio',
                    boxLabel: RS.$('All_None'),
                    name: 'ProcessConfirmType',
                    inputValue: 'None',
                    value: true,
                    listeners: {
                        scope: me,
                        change: 'updateStatus'
                    }
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    defaults: {
                        margin: 0
                    },
                    items: [{
                        xtype: 'radio',
                        name: 'ProcessConfirmType',
                        inputValue: 'Prompt',
                        boxLabel: RS.$('Process_Link_SumbitCfm_Option_Prompt'),
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, {
                        xtype: 'label',
                        margin: '0 18 0 60',
                        display: 'block',
                        html: RS.$('Process_Link_SumbitCfm_PromptMessage'),
                        reference: 'labPromptMessage'
                    }, {
                        xtype: 'textfield',
                        flex: 1,
                        name: 'PromptMessage',
                        reference: 'edtPromptMessage'
                    }]
                }, {
                    xtype: 'radio',
                    boxLabel: RS.$('Process_Link_SumbitCfm_Option_EnterPassword'),
                    name: 'ProcessConfirmType',
                    inputValue: 'EnterPassword',
                    listeners: {
                        scope: me,
                        change: 'updateStatus'
                    }
                }]
            }, {
                xtype: 'fieldset',
                padding: '0 18 8 18',
                margin: '6 0 0 0',
                title: RS.$('Process_Link_DeafultRoute'),
                hidden: !config.showDefaultRoutePanel,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 0 3 0'
                },
                items: [{
                    xtype: 'radio',
                    boxLabel: RS.$('Process_Link_DefaultRoute_Yes'),
                    name: 'DefaultRoute',
                    inputValue: 'True',
                    value: true
                }, {
                    xtype: 'radio',
                    boxLabel: RS.$('Process_Link_DefaultRoute_No'),
                    name: 'DefaultRoute',
                    inputValue: 'False'
                }]
            }, {
                xtype: 'fieldset',
                padding: '0 18 8 18',
                margin: '6 0 0 0',
                title: RS.$('Process_Link_RelationCondition'),
                hidden: !config.showConditionPanel,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 0 3 0'
                },
                items: [{
                    xtype: 'radio',
                    boxLabel: RS.$('Process_Link_RelationCondition_True'),
                    name: 'ConditionType',
                    inputValue: 'True',
                    value: true
                }, {
                    xtype: 'radio',
                    boxLabel: RS.$('Process_Link_RelationCondition_False'),
                    name: 'ConditionType',
                    inputValue: 'False'
                }]
            }, {
                xtype: 'fieldset',
                padding: '0 18 8 18',
                margin: '6 0 0 0',
                title: RS.$('Process_Link_VoteCondition'),
                hidden: !config.showVotePanel,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margin: '0 0 3 0'
                },
                items: [{
                    xtype: 'radio',
                    boxLabel: RS.$('Process_Link_VoteCondition_Pass'),
                    name: 'VotePass',
                    inputValue: 'True',
                    value: true
                }, {
                    xtype: 'radio',
                    boxLabel: RS.$('Process_Link_VoteCondition_Reject'),
                    name: 'VotePass',
                    inputValue: 'False'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    fill: function (data) {
        data.DefaultRoute = data.ConditionType;
        data.VotePass = data.ConditionType;
        this.getForm().setValues(data);
        this.updateStatus();
    },

    save: function () {
        var me = this,
            data = this.getValuesSubmit();

        if (me.showDefaultRoutePanel)
            data.ConditionType = data.DefaultRoute;
        if (me.showVotePanel)
            data.ConditionType = data.VotePass;

        return data;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            data = me.save();

        refs.labPromptMessage.setDisabled(data.ProcessConfirmType != 'Prompt');
        refs.edtPromptMessage.setDisabled(data.ProcessConfirmType != 'Prompt');
    }
});