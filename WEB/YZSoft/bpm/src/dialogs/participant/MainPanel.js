/*
config:
stepNames
tables
recp
*/
Ext.define('YZSoft.bpm.src.dialogs.participant.MainPanel', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.bpm.src.model.Name',
        'YZSoft.bpm.src.model.Participant'
    ],
    //style: 'background-color:red;',
    layout: 'form',

    constructor: function (config) {
        var me = this,
            tables = config.tables || [],
            stepNames = config.stepNames || [],
            data;

        /***********************通用store**************************/

        data = [];
        Ext.each(stepNames, function (stepName) {
            data.push({ name: stepName, value: stepName });
        });

        me.storeStepNames = Ext.create('Ext.data.Store', {
            model: 'YZSoft.bpm.src.model.Name',
            data: data
        });

        me.storeDeptLevels = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Name',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetOULevels' }
            }
        });

        me.storeDeptNames = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Name',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetOUNames' }
            }
        });

        me.storeLeaderTitle = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Name',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetLeaderTitles' }
            }
        });

        me.storeRoleNames = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Name',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetRoleNames' }
            }
        });

        me.storeDeptLevels.load({ async: false });
        me.storeDeptNames.load({ async: false });
        me.storeLeaderTitle.load({ async: false });
        me.storeRoleNames.load({ async: false });

        var triggerFormField = {
            cls: 'yz-trigger-form',
            hidden: !config.tables,
            handler: function (cmbField) {
                if (!cmbField.dlgFormField) {
                    cmbField.dlgFormField = Ext.create('YZSoft.bpm.src.dialogs.SelFormFieldDlg', {
                        closeAction: 'hide',
                        tables: tables,
                        fn: function (field) {
                            cmbField.setValue(Ext.String.format('<%=FormDataSet["{0}.{1}"]%>',
                                field.TableName, field.ColumnName));
                        }
                    });
                }

                cmbField.dlgFormField.show();
            }
        };
        /***********************通用配置**************************/

        var fieldBaseCfg = {
            tables: config.tables
        };

        var fieldStepNameCfg = Ext.applyIf({
            queryMode: 'local',
            store: me.storeStepNames,
            valueField: 'value',
            displayField: 'name',
            triggers: {
                formfield: triggerFormField
            }
        }, fieldBaseCfg);

        var fieldDeptCfg = Ext.applyIf({
        }, fieldBaseCfg);

        var fieldRoleCfg = Ext.applyIf({
        }, fieldBaseCfg);

        var fieldMemberCfg = Ext.applyIf({
        }, fieldBaseCfg);

        var fieldAccountCfg = Ext.applyIf({
        }, fieldBaseCfg);

        var fieldFormFieldCfg = Ext.applyIf({
        }, fieldBaseCfg);

        var fieldLeaderTitleCfg = Ext.applyIf({
            queryMode: 'local',
            store: me.storeLeaderTitle,
            valueField: 'value',
            displayField: 'name',
            triggers: {
                formfield: triggerFormField
            }
        }, fieldBaseCfg);

        var fieldDeptNameCfg = Ext.applyIf({
            queryMode: 'local',
            store: me.storeDeptNames,
            valueField: 'value',
            displayField: 'name',
            triggers: {
                formfield: triggerFormField
            }
        }, fieldBaseCfg);

        var fieldRoleNameCfg = Ext.applyIf({
            queryMode: 'local',
            store: me.storeRoleNames,
            valueField: 'value',
            displayField: 'name',
            triggers: {
                formfield: triggerFormField
            }
        }, fieldBaseCfg);

        var fieldDeptLevelCfg = Ext.applyIf({
            queryMode: 'local',
            store: me.storeDeptLevels,
            valueField: 'value',
            displayField: 'name',
            triggers: {
                formfield: triggerFormField
            }
        }, fieldBaseCfg);

        var fieldSupervisorLevel = Ext.applyIf({
        }, fieldBaseCfg);

        var fieldFormAccountCfg = Ext.applyIf({
        }, fieldBaseCfg);

        /***********************直线领导**************************/
        me.leader = function () {
            this.store = Ext.create('Ext.data.Store', {
                fields: ['name', 'value', 'items'],
                data: [
                    { name: RS.$('All_DirectSupervisor'), value: 'Supervisor', items: [] },
                    { name: RS.$('All_SupervisorByLevel'), value: 'SupervisorByLevel', items: [
                        Ext.create('Ext.form.field.Number', Ext.applyIf({
                            fieldLabel: RS.$('All_SupervisorLevel'),
                            map: 'SParam1',
                            minValue: 0,
                            value: 0,
                            labelWidth: 50,
                            width: 200
                        }, fieldSupervisorLevel))
                    ]
                    },
                    { name: RS.$('All_LeaderByJobTitle'), value: 'Leader', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_JobTitleName'),
                            map: 'SParam1'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_RoleByName'), value: 'Role', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_RoleName'),
                            map: 'SParam1'
                        }, fieldRoleNameCfg))
                    ]
                    }
                ]
            });

            this.cmbType = Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: RS.$('All_LeaderType'),
                map: 'LeaderType',
                emptyValue: 'Unknown',
                store: this.store,
                editable: false,
                queryMode: 'local',
                valueField: 'value',
                displayField: 'name',
                listeners: {
                    change: function (trigerField, newValue) {
                        me.onSelectionChange(trigerField, newValue);
                    },
                    show: function () {
                        me.onSelectionChange(this, this.getValue());
                    }
                }
            });

            var items = this.items = [this.cmbType];
            this.store.each(function (rec) {
                Ext.each(rec.data.items, function (field) {
                    items.push(field);
                });
            });

            return this;
        } .call({});

        /***********************特定处理人**************************/
        me.spec = function () {

            this.store = Ext.create('Ext.data.Store', {
                fields: ['name', 'value', 'items'],
                data: [
                    { name: RS.$('All_Initiator'), value: 'Initiator', items: [] },
                    { name: RS.$('All_ParticipantOfStep'), value: 'StepRecipient', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_StepNameFull'),
                            map: 'SParam1'
                        }, fieldStepNameCfg))
                    ]
                    },
                    { name: RS.$('All_SpecLeader'), value: 'Leader', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.Dept', Ext.applyIf({
                            fieldLabel: RS.$('All_OU'),
                            map: 'SParam1'
                        }, fieldDeptCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_LeaderJobTitle'),
                            map: 'SParam2'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_SpecRole'), value: 'Role', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.Role', Ext.applyIf({
                            fieldLabel: RS.$('All_RoleFullName'),
                            map: 'SParam1'
                        }, fieldRoleCfg))
                    ]
                    },
                    { name: RS.$('All_SpecMember'), value: 'Member', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.Member', Ext.applyIf({
                            fieldLabel: RS.$('All_MemberFullName'),
                            map: 'SParam1'
                        }, fieldMemberCfg))
                    ]
                    },
                    { name: RS.$('All_SpecAccount'), value: 'User', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.Account', Ext.applyIf({
                            fieldLabel: RS.$('All_Account'),
                            map: 'SParam1'
                        }, fieldAccountCfg))
                    ]
                    },
                    { name: RS.$('All_MemberFullNameInRepeatTable'), value: 'MembersInRepeatTable', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.FormField', Ext.applyIf({
                            fieldLabel: RS.$('All_FormField'),
                            code: false,
                            Save: function (rv) {
                                var segs = this.getValue().split('.');
                                rv.set('SParam1', segs[0]);
                                rv.set('SParam2', segs[1]);
                            },
                            Fill: function (rv) {
                                this.setValue(Ext.String.format('{0}.{1}', rv.get('SParam1'), rv.get('SParam2')));
                            }
                        }, fieldFormFieldCfg))
                    ]
                    },
                    { name: RS.$('All_AccountInRepeatTable'), value: 'UsersInRepeatTable', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.FormField', Ext.applyIf({
                            fieldLabel: RS.$('All_FormField'),
                            code: false,
                            Save: function (rv) {
                                var segs = this.getValue().split('.');
                                rv.set('SParam1', segs[0]);
                                rv.set('SParam2', segs[1]);
                            },
                            Fill: function (rv) {
                                this.setValue(Ext.String.format('{0}.{1}', rv.get('SParam1'), rv.get('SParam2')));
                            }
                        }, fieldFormFieldCfg))
                    ]
                    },
                    { name: RS.$('All_LeaderInSpecNameOU'), value: 'OUNameAndLeaderTitle', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OUName'),
                            map: 'SParam1'
                        }, fieldDeptNameCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_LeaderTitle'),
                            map: 'SParam2'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_RoleInSpecNameOU'), value: 'OUNameAndRoleName', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OUName'),
                            map: 'SParam1'
                        }, fieldDeptNameCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_Role'),
                            map: 'SParam2'
                        }, fieldRoleNameCfg))
                    ]
                    },
                    { name: RS.$('All_MemberInSpecNameOU'), value: 'OUNameAllMember', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OUName'),
                            map: 'SParam1'
                        }, fieldDeptNameCfg))
                    ]
                    },
                    { name: RS.$('All_LeaderInSpecLevelOU'), value: 'OULevelAndLeaderTitle', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OULevel'),
                            map: 'SParam1'
                        }, fieldDeptLevelCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_LeaderTitle'),
                            map: 'SParam2'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_RoleInSpecLevelOU'), value: 'OULevelAndRoleName', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OULevel'),
                            map: 'SParam1'
                        }, fieldDeptLevelCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_Role'),
                            map: 'SParam2'
                        }, fieldRoleNameCfg))
                    ]
                    },
                    { name: RS.$('All_MemberInSpecLevelOU'), value: 'OULevelAllMember', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OULevel'),
                            map: 'SParam1'
                        }, fieldDeptLevelCfg))
                    ]
                    },
                    { name: RS.$('All_AllLeaderByJobTitle'), value: 'LeaderTitle', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_LeaderTitle'),
                            map: 'SParam1'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_AllRoleByName'), value: 'RoleName', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_Role'),
                            map: 'SParam1'
                        }, fieldRoleNameCfg))
                    ]
                    },
                    { name: RS.$('All_AllLeaderInSpecOU'), value: 'SpecDeptAllLeader', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.Dept', Ext.applyIf({
                            fieldLabel: RS.$('All_OUFullName'),
                            map: 'SParam1'
                        }, fieldDeptCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_LeaderTitle'),
                            map: 'SParam2'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_AllRoleInSpecOU'), value: 'SpecDeptAllRole', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.Dept', Ext.applyIf({
                            fieldLabel: RS.$('All_OUFullName'),
                            map: 'SParam1'
                        }, fieldDeptCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_Role'),
                            map: 'SParam2'
                        }, fieldRoleNameCfg))
                    ]
                    },
                    { name: RS.$('All_AllMemberInSpecOU'), value: 'SpecDeptAllMember', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.Dept', Ext.applyIf({
                            fieldLabel: RS.$('All_OUFullName'),
                            map: 'SParam1'
                        }, fieldDeptCfg))
                    ]
                    },
                    { name: RS.$('All_AllCompanyEmplyee'), value: 'AllCompanyMember', items: [] }
                ]
            });

            this.cmbType = Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: RS.$('All_Participant'),
                map: 'SpecifiedType',
                store: this.store,
                editable: false,
                queryMode: 'local',
                valueField: 'value',
                displayField: 'name',
                //value: 'User',
                listeners: {
                    change: function (trigerField, newValue) {
                        me.onSelectionChange(trigerField, newValue);
                    },
                    show: function () {
                        me.onSelectionChange(this, this.getValue());
                    }
                }
            });

            var items = this.items = [this.cmbType];
            this.store.each(function (rec) {
                Ext.each(rec.data.items, function (field) {
                    items.push(field);
                });
            });

            return this;
        } .call({});

        /***********************业务负责人或同事**************************/
        me.businessOwner = function () {
            this.store = Ext.create('Ext.data.Store', {
                fields: ['name', 'value', 'items'],
                data: [
                    { name: RS.$('All_LeaderByJobTitleAndOUName'), value: 'DeptLeader', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OUName'),
                            map: 'SParam1'
                        }, fieldDeptNameCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_ParticipantJobTitle'),
                            map: 'SParam2'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_RoleByRoleNameAndOUName'), value: 'DeptRole', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OUName'),
                            map: 'SParam1'
                        }, fieldDeptNameCfg)),

                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_ParticipantRoleName'),
                            map: 'SParam2'
                        }, fieldRoleNameCfg))
                    ]
                    },
                    { name: RS.$('All_MemberByOUName'), value: 'DeptAllMember', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_OUName'),
                            map: 'SParam1'
                        }, fieldDeptNameCfg)),
                    ]
                    },
                    { name: RS.$('All_LeaderByJobTitle'), value: 'Leader', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_ParticipantJobTitle'),
                            map: 'SParam1'
                        }, fieldLeaderTitleCfg))
                    ]
                    },
                    { name: RS.$('All_RoleByName'), value: 'Role', items: [
                        Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                            fieldLabel: RS.$('All_ParticipantRoleName'),
                            map: 'SParam1'
                        }, fieldRoleNameCfg))
                    ]
                    },
                    { name: RS.$('All_AllMember'), value: 'AllMember', items: [] }
                ]
            });

            this.cmbType = Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: RS.$('All_LeaderType'),
                map: 'SponsorType',
                store: this.store,
                editable: false,
                queryMode: 'local',
                valueField: 'value',
                displayField: 'name',
                listeners: {
                    change: function (trigerField, newValue) {
                        me.onSelectionChange(trigerField, newValue);
                    },
                    show: function () {
                        me.onSelectionChange(this, this.getValue());
                    }
                }
            });

            var items = this.items = [this.cmbType];
            this.store.each(function (rec) {
                Ext.each(rec.data.items, function (field) {
                    items.push(field);
                });
            });

            return this;
        } .call({});

        /***********************总菜单**************************/

        me.cmbStepNames = Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
            fieldLabel: RS.$('All_StepNameFull'),
            map: 'SParam4'
        }, fieldStepNameCfg));

        me.cmbFormAccount = Ext.create('YZSoft.bpm.src.dialogs.participant.field.FormField', Ext.applyIf({
            fieldLabel: RS.$('All_Account'),
            map: 'SParam4'
        }, fieldFormAccountCfg));

        me.cmbDeptLevel = Ext.create('Ext.form.FieldContainer', {
            fieldLabel: RS.$('All_Participant_Range_Prefix'),
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [
                Ext.create('YZSoft.bpm.src.dialogs.participant.field.ComboBox', Ext.applyIf({
                    width: 220
                }, fieldDeptLevelCfg)),{
                    xtype: 'component',
                    flex: 1,
                    html: '&nbsp;' + RS.$('All_Participant_Range_Postfix'),
                    margin:'0 0 0 6'
                }
            ],
            Save: function (rv) {
                rv.set('SParam5', this.items.items[0].getValue());
            },
            Fill: function (rv) {
                this.items.items[0].setValue(rv.get('SParam5'));
            }
        });
        me.cmbDeptLevel.relayEvents(me.cmbDeptLevel.items.items[0], ['change']);

        me.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'value', 'items'],
            data: [
                { name: RS.$('All_InitiatorDirectLeader'), value: 'InitiatorDirectLeader', items: [me.leader.cmbType] },
                { name: RS.$('All_StepRecipientDirectLeader'), value: 'StepRecipientDirectLeader', items: [me.cmbStepNames, me.leader.cmbType] },
                { name: RS.$('All_UserDirectLeader'), value: 'UserDirectLeader', items: [me.cmbFormAccount, me.leader.cmbType] },
                { name: RS.$('All_SpecifiedUser'), value: 'SpecifiedUser', items: [me.spec.cmbType] },
                { name: RS.$('All_InitiatorDeptLeader'), value: 'InitiatorDeptLeader', items: [me.cmbDeptLevel, me.businessOwner.cmbType] },
                { name: RS.$('All_StepRecipientDeptLeader'), value: 'StepRecipientDeptLeader', items: [me.cmbStepNames, me.cmbDeptLevel, me.businessOwner.cmbType] },
                { name: RS.$('All_UserDeptLeader'), value: 'UserDeptLeader', items: [me.cmbFormAccount, me.cmbDeptLevel, me.businessOwner.cmbType] },
                { name: RS.$('All_CustomCode'), value: 'Custom', items: [] }
            ]
        });

        me.cmbType = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: RS.$('All_ParticipantType'),
            map: 'ParticipantType',
            store: me.store,
            editable: false,
            queryMode: 'local',
            valueField: 'value',
            displayField: 'name',
            listeners: {
                change: function (trigerField, newValue) {
                    me.onSelectionChange(trigerField, newValue);
                }
            }
        });

        var cfg = {
            items: Ext.Array.union([me.cmbType], me.spec.items, [me.cmbStepNames, me.cmbFormAccount], me.leader.items, [me.cmbDeptLevel], me.businessOwner.items)
        };

        Ext.apply(cfg, config);

        for (var i = 1; i < cfg.items.length; i++) {
            cfg.items[i].hide();
        }

        Ext.each(cfg.items, function (field) {
            me.relayEvents(field, ['change']);
        });

        me.callParent([cfg]);

        if (config.recp)
            me.fill(config.recp);
    },

    onSelectionChange: function (trigerField, newValue) {
        var me = this,
            find = false,
            store = trigerField.getStore();

        Ext.each(me.items.items, function (field) {
            if (!find) {
                if (trigerField == field)
                    find = true;
                return;
            }

            field.hide();
        });

        var rec = store.getAt(store.find('value', newValue));
        if (rec) {
            Ext.each(rec.data.items, function (item) {
                item.show();
            });
        }
    },

    fill: function (recp, field) {
        var me = this;

        field = field || me.cmbType;

        if (field.Fill) {
            field.Fill(recp);
        }
        else if (field.map) {
            var value = recp.get(field.map);
            if ('emptyValue' in field && field.emptyValue == value)
                value = null;

            field.setValue(value);
        }
        else {
            alert(field.fieldLabel + 'not mapped');
            return;
        }

        var find = false;
        Ext.each(me.items.items, function (tmpfield) {
            if (!find) {
                if (tmpfield === field)
                    find = true;
            }
            else {
                if (!tmpfield.hidden) {
                    me.fill(recp, tmpfield);
                    return false;
                }
            }
        });
    },

    save: function () {
        var me = this,
            rv = new YZSoft.bpm.src.model.Participant({});

        Ext.each(me.items.items, function (field) {
            if (field.isVisible()) {
                if (field.Save) {
                    field.Save(rv);
                }
                else if (field.map) {
                    var value = field.getValue();
                    if ('emptyValue' in field && Ext.isEmpty(value))
                        value = field.emptyValue;

                    rv.set(field.map, value);
                }
                else {
                    alert(field.fieldLabel + 'not mapped');
                    return false;
                }
            }
        });

        return rv;
    }
});