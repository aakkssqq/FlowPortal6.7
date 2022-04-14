/*
config:
ruleid
account
ruleDefine
dosubmit
*/
Ext.define('YZSoft.bpm.taskrule.Dialog', {
    extend: 'Ext.window.Window', //222222
    layout: {
        type: 'vbox',
        align:'stretch'
    },
    cls:'yz-window-size-s',
    width: 610,
    height: 770,
    minWidth: 610,
    minHeight: 770,
    maxHeight:Ext.getBody().getHeight(),
    modal: true,
    maximizable: true,
    bodyPadding: '0 20',
    referenceHolder: true,
    dosubmit: true,
    scrollable:'y',
    constructor: function (config) {
        var me = this,
            cfg;

        me.edtProcesses = Ext.create('YZSoft.bpm.src.form.field.Processes', {
            name: 'ProcessNames',
            width:'100%',
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.pnlRecipient = Ext.create('YZSoft.bpm.src.editor.TaskRuleDelegationField', {
            fieldLabel: RS.$('All_Caption_TaskRuleDelagation'),
            labelAlign: 'top',
            labelPad: 10,
            listeners: {
                change: function () {
                    me.updateStatus();
                }
            }
        });

        me.chkEnable = Ext.create('Ext.form.field.Checkbox', {
            margin: '0 0 0 4',
            boxLabel: RS.$('All_Valid'),
            inputValue: true
        });

        me.chkCondition = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: RS.$('All_AddtionalCondition'),
            margin: '8 0 0 3',
            inputValue: true
        });

        me.edtCondition = Ext.create('Ext.form.field.TextArea', {
            flex: 1,
            minHeight:78,
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                if (me.dosubmit) {
                    me.submit(function (rule) {
                        me.closeDialog(rule);
                    });
                }
                else {
                    me.closeDialog(me.save());
                }
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.chkEnable, '->', me.btnOK, me.btnCancel],
            items: [{
                xtype: 'fieldset',
                title: RS.$('All_TaskRule_RuleType'),
                padding: '5 15 5 15',
                items: [{
                    xtype: 'radiogroup',
                    reference: 'rdoRuleTypeName',
                    columns: 1,
                    items: [
                        { boxLabel: RS.$('All_TaskRule_RuleTypeDelegation'), name: 'A', inputValue: 'DelegationRule' },
                        { boxLabel: RS.$('All_TaskRule_RuleTypeAssistant'), name: 'A', inputValue: 'AssistantRule' }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_DelegationProcess'),
                padding: '5 15 5 15',
                items: [{
                    xtype: 'radiogroup',
                    reference: 'rdoProcessDefineType',
                    columns: 3,
                    items: [
                        { boxLabel: RS.$('All_AllProcess'), name: 'B', inputValue: 'All' },
                        { boxLabel: RS.$('All_OnlyBelowProcess'), name: 'B', inputValue: 'Include' },
                        { boxLabel: RS.$('All_ExcludeBelowProcesses'), name: 'B', inputValue: 'Exclude' }
                    ],
                    listeners: {
                        change: function () {
                            me.updateStatus();
                        }
                    }
                }, me.edtProcesses]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_TransferTo'),
                padding: '5 15 8 15',
                items: [
                    me.pnlRecipient
                ]
            }, me.chkCondition, me.edtCondition, {
                margin: '0 0 0 6px',
                xtype: 'checkbox',
                boxLabel: RS.$('All_Valid'),
                hidden: true,
                name: 'Valid',
                inputValue: true
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.ruleDefine) {
            me.fill(config.ruleDefine);
        }
        else if ('ruleid' in config) {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskRule.ashx'),
                params: { method: 'OpenTaskRule', ruleid: config.ruleid },
                success: function (action) {
                    me.fill(action.result);
                }
            });
        }
        else {
            var rule = {
                RuleTypeName: 'DelegationRule',
                ProcessDefine: {
                    ProcessDefineType: 'All'
                },
                Enabled: true
            };

            me.fill(rule);
        }
    },

    fill: function (rule) {
        var me = this,
            refs = me.getReferences();

        refs.rdoRuleTypeName.setValue({ A: rule.RuleTypeName });
        refs.rdoProcessDefineType.setValue({ B: rule.ProcessDefine.ProcessDefineType });
        me.edtProcesses.setValue(rule.ProcessDefine.ProcessItems);
        me.chkEnable.setValue(rule.Enabled);
        me.pnlRecipient.setValue(rule.Delegators);
        me.chkCondition.setValue(rule.ConditionEnabled);
        me.edtCondition.setValue(rule.Condition);

        me.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences();

        var taskRule = {
            RuleID: me.ruleid,
            Account: me.account,
            RuleTypeName: refs.rdoRuleTypeName.getValue().A,
            ProcessDefine: {
                ProcessDefineType: refs.rdoProcessDefineType.getValue().B,
                ProcessItems: me.edtProcesses.getValue()
            },
            Delegators: me.pnlRecipient.getValue(),
            Enabled: me.chkEnable.getValue(),
            ConditionEnabled: me.chkCondition.getValue(),
            Condition: me.edtCondition.getValue()
        };

        return taskRule;
    },

    submit: function (fn, scope) {
        var me = this,
            refs = me.getReferences(),
            taskRule = me.save();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/TaskRule.ashx'),
            waitMsg: {
                msg: RS.$('All_TaskRuleSaving'),
                target: me
            },
            params: {
                method: 'SaveTaskRule',
                ruleType: taskRule.RuleTypeName
            },
            jsonData: [taskRule],
            success: function (action) {
                if (fn) {
                    taskRule.RuleID = action.result.RuleID;
                    fn.call(scope, taskRule);
                }
            }
        });
    },

    updateStatus: function () {
        var me = this,
            taskRule = me.save();

        me.edtProcesses.setDisabled(taskRule.ProcessDefine.ProcessDefineType == 'All');

        if (taskRule.Delegators.length == 0 ||
            (taskRule.ProcessDefine.ProcessDefineType == 'Include' && taskRule.ProcessDefine.ProcessItems.length == 0))
            me.btnOK.setDisabled(true);
        else
            me.btnOK.setDisabled(false);
    }
});