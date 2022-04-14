/*
config:
drawContainer
links,
humanStepNames
*/
Ext.define('YZSoft.bpm.propertypages.Timeout', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.bpm.src.model.TimeSheet'
    ],
    referenceHolder: true,
    title: RS.$('All_Timeout'),
    layout: 'anchor',

    constructor: function (config) {
        var me = this,
            linkdata = [],
            humanStepNameData = [],
            cfg;

        me.storeTimeSheet = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            fields: ['Name'],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TimeSheet.ashx'),
                extraParams: { method: 'GetTimeSheets' }
            }
        });

        Ext.each(config.links, function (link) {
            linkdata.push({ Name: link.sprites.text.attr.text });
        });

        Ext.each(config.humanStepNames, function (name) {
            humanStepNameData.push({ Name: name });
        });

        cfg = {
            defaults: {
                anchor: '100%'
            },
            items: [{
                xtype: 'fieldset',
                title: RS.$('All_Calendar'),
                layout: 'hbox',
                items: [{
                    xtype: 'radiogroup',
                    layout: 'hbox',
                    defaults: {
                        name: 'CalendarType',
                        margin: '0 0 0 30',
                        listeners: {
                            change: function () {
                                me.fireEvent('change');
                                me.updateStatus();
                            }
                        }
                    },
                    items: [
                        { boxLabel: RS.$('Process_StepOwnerCalendar'), inputValue: 'StepOwner', margin: 0 },
                        { boxLabel: RS.$('Process_TaskOwnerCalendar'), inputValue: 'TaskOwner' },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                { xtype: 'radio', boxLabel: RS.$('Process_SpecCalendar'), name: 'CalendarType', inputValue: 'Specific' },
                                {
                                    xtype: 'combobox',
                                    name: 'CalendarName',
                                    reference: 'cmbCalendarName',
                                    editable: false,
                                    queryMode: 'local',
                                    store: me.storeTimeSheet,
                                    valueField: 'Name',
                                    displayField: 'Name',
                                    width: 180,
                                    margin: '0 0 12 30'
                                }
                            ]
                        }
                    ]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('All_Deadline'),
                checkboxToggle: true,
                checkboxName: 'DeadlineEnabled',
                padding: '5 15 0 15',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                listeners: {
                    collapse: function () {
                        me.fireEvent('change');
                        me.updateStatus();
                    },
                    expand: function () {
                        me.fireEvent('change');
                        me.updateStatus();
                    }
                },
                items: [{
                    xtype: 'radiogroup',
                    layout: 'hbox',
                    margin: 0,
                    defaults: {
                        name: 'DeadlineType',
                        margin: '0 0 0 30',
                        listeners: {
                            change: function () {
                                me.fireEvent('change');
                                me.updateStatus();
                            }
                        }
                    },
                    items: [
                        { boxLabel: RS.$('Process_DeadlineType_AfterEnterStep'), inputValue: 'AfterEnterStep', margin: 0 },
                        { boxLabel: RS.$('Process_DeadlineType_FirstTimeEnterStep'), inputValue: 'FirstTimeEnterStep' },
                        { boxLabel: RS.$('Process_DeadlineType_AfterTaskCreate'), inputValue: 'AfterTaskCreate' },
                        { boxLabel: RS.$('Process_DeadlineType_Absolute'), inputValue: 'Absolute' }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    reference: 'cntDeadlineHours',
                    margin: '3 0 12 26',
                    layout: {
                        type: 'hbox',
                        align: 'center'
                    },
                    items: [{
                        xclass: 'YZSoft.bpm.src.form.field.FormFieldField',
                        reference: 'edtDeadlineHours',
                        name: 'Hours',
                        width: 220,
                        formatValue: function (field) {
                            return 'FormDataSet["' + field.TableName + '.' + field.ColumnName + '"]';
                        }
                    }, {
                        xtype: 'label',
                        style: 'display:block',
                        html: RS.$('All_UnitHour'),
                        margin: '0 0 0 8'
                    }]
                }, {
                    xtype: 'fieldcontainer',
                    reference: 'cntDeadlineDate',
                    margin: '3 0 12 26',
                    layout: {
                        type: 'hbox',
                        align: 'center'
                    },
                    items: [{
                        xtype: 'label',
                        html: RS.$('Process_Deadline_Title'),
                        margin: '0 8 0 0'
                    }, {
                        xclass: 'YZSoft.bpm.src.form.field.FormFieldField',
                        name: 'Date',
                        reference: 'edtDeadlineDate',
                        width: 280,
                        formatValue: function (field) {
                            return 'FormDataSet["' + field.TableName + '.' + field.ColumnName + '"]';
                        }
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_TimeoutNotify'),
                checkboxToggle: true,
                checkboxName: 'NotifyEnabled',
                reference: 'grpNotify',
                padding: '0 15 5 15',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'panel',
                    bodyStyle: 'background-color:transparent',
                    border: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'hbox',
                            align: 'center'
                        },
                        padding: '0 0 0 26',
                        defaults: {
                            margin: '0 8 0 0'
                        },
                        items: [{
                            xtype: 'label',
                            html: RS.$('Process_FirstTime'),
                            width: 80
                        }, {
                            xtype: 'label',
                            html: RS.$('Process_BeforeDeadline')
                        }, {
                            xtype: 'numberfield',
                            width: 100,
                            name: 'FirsttimeHours',
                            minValue: 0
                        }, {
                            xtype: 'label',
                            html: RS.$('All_UnitHour')
                        }, {
                            xtype: 'numberfield',
                            width: 100,
                            name: 'FirsttimeMinutes',
                            minValue: 0
                        }, {
                            xtype: 'label',
                            html: RS.$('All_UnitMinute')
                        }]
                    }, {
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'hbox',
                            align: 'center'
                        },
                        padding: '0 0 0 26',
                        defaults: {
                            margin: '0 8 0 0'
                        },
                        items: [{
                            xtype: 'checkbox',
                            boxLabel: RS.$('All_Repeat'),
                            name: 'Repeatable',
                            listeners: {
                                change: function () {
                                    me.fireEvent('change');
                                    me.updateStatus();
                                }
                            }
                        }, {
                            xtype: 'tbfill'
                        }, {
                            xtype: 'label',
                            reference: 'edtRepeatEvery',
                            html: RS.$('All_Every')
                        }, {
                            xtype: 'numberfield',
                            width: 100,
                            name: 'RepeatHours',
                            reference: 'edtRepeatHours',
                            minValue: 0
                        }, {
                            xtype: 'label',
                            reference: 'edtRepeatUnitHours',
                            html: RS.$('All_UnitHour')
                        }, {
                            xtype: 'numberfield',
                            width: 100,
                            name: 'RepeatMinutes',
                            reference: 'edtRepeatMinutes',
                            minValue: 0
                        }, {
                            xtype: 'label',
                            reference: 'edtRepeatUnitMinutes',
                            html: RS.$('All_UnitMinute')
                        }]
                    }]
                }, {
                    xtype: 'container',
                    flex:1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xclass: 'YZSoft.src.form.field.List',
                        flex: 1,
                        fieldLabel: RS.$('All_CC'),
                        name: 'Recipients',
                        reference: 'edtRecipients',
                        labelWidth: 30,
                        listConfig: {
                            scrollable: true
                        },
                        margin: '0 0 0 50',
                        renderItem: function (recp) {
                            var rv = recp.DisplayString;
                            YZSoft.Ajax.request({
                                async: false,
                                method: 'POST',
                                url: YZSoft.$url('YZSoft.Services.REST/BPM/Participant.ashx'),
                                params: { method: 'CheckParticipant' },
                                jsonData: [recp],
                                success: function (action) {
                                    rv = action.result[0].RuntimeDisplayString;
                                }
                            });
                            return rv;
                        },
                        listeners: {
                            browserClick: function (values) {
                                var editor = this;
                                Ext.create('YZSoft.bpm.src.dialogs.ParticipantDlg', {
                                    autoShow: true,
                                    title: RS.$('All_SelectParticipant'),
                                    tables: editor.tables,
                                    stepNames: me.humanStepNames,
                                    fn: function (recp) {
                                        var value = editor.getValue();
                                        var find = Ext.Array.findBy(value, function (recpTmp) {
                                            if (YZSoft.bpm.src.model.Participant.equFn(recpTmp, recp))
                                                return true;
                                        });

                                        if (!find)
                                            editor.addRecords(recp, false);
                                    }
                                });
                            }
                        }
                    }, {
                        xtype: 'button',
                        text: RS.$('Process_EditNotifyMessage'),
                        reference: 'btnMessage',
                        padding: '2 20',
                        margin:'1 0 7 85',
                        handler: function () {
                            var btn = this;
                            Ext.create('YZSoft.bpm.src.dialogs.MessageSettingDlg', {
                                autoShow: true,
                                title: RS.$('Process_TimeoutMessageSettingDlgTitle'),
                                messageItems: btn.data,
                                messageCatFieldConfig: {
                                    messageFieldConfig: {
                                        messageCat: 'TimeoutNotify',
                                        tables: me.tables,
                                        inheri: {
                                            parent: me.drawContainer
                                        }
                                    }
                                },
                                fn: function (data) {
                                    btn.data = data;
                                }
                            });
                        }
                    }]
                }]
            }, {
                xtype: 'fieldset',
                title: RS.$('Process_FieldSet_TimeoutProcess'),
                checkboxToggle: true,
                checkboxName: 'ActivityEnabled',
                reference: 'grpActivity',
                padding:'5 15 0 15',
                layout: 'hbox',
                items: [{
                    xtype: 'radiogroup',
                    margin: '0 0 0 22',
                    columns: 1,
                    defaults: {
                        listeners: {
                            change: function () {
                                me.fireEvent('change');
                                me.updateStatus();
                            }
                        }
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [
                            { xtype: 'radio', name: 'ActivityType', boxLabel: RS.$('Process_Timeout_AutoProcess'), width: 130, inputValue: 'AutoProcess' },
                            {
                                xtype: 'combo',
                                name: 'ActionName',
                                store: {
                                    fields: ['Name'],
                                    data: linkdata
                                },
                                editable: false,
                                queryMode: 'local',
                                valueField: 'Name',
                                displayField: 'Name',
                                width: 180,
                                margin: '0 0 7 10'
                            }
                        ]
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [
                            { xtype: 'radio', name: 'ActivityType', boxLabel: RS.$('Process_Timeout_Jump'), width: 130, inputValue: 'Goto' },
                            {
                                xtype: 'combo',
                                name: 'GotoStep',
                                store: {
                                    fields: ['Name'],
                                    data: humanStepNameData
                                },
                                editable: false,
                                queryMode: 'local',
                                valueField: 'Name',
                                displayField: 'Name',
                                width: 180,
                                margin: '0 0 12 10'
                            }
                        ]
                    }]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            tablesChanged: function (tables) {
                var refs = me.getReferences();

                me.tables = tables;
                refs.edtDeadlineHours.tables = tables;
                refs.edtDeadlineDate.tables = tables;
                refs.edtRecipients.tables = tables;
            }
        });
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        me.suspendUpdateStatus = true;

        Ext.apply(data, data.Calendar);
        Ext.apply(data, data.Deadline);
        Ext.apply(data, data.Notify);
        Ext.apply(data, data.Activity);

        data.NotifyEnabled = data.Notify.Enabled;
        data.ActivityEnabled = data.Activity.Enabled;
        data.DeadlineEnabled = data.Deadline.Enabled;

        me.getForm().setValues(data);
        refs.btnMessage.data = data.MessageItems;

        me.suspendUpdateStatus = false;
        me.updateStatus();
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv1, rv;

        rv1 = me.getValuesSubmit();

        rv = {
            Calendar: Ext.copyTo({}, rv1, 'CalendarType,CalendarName'),
            Deadline: Ext.copyTo({ Enabled: rv1.DeadlineEnabled }, rv1, 'DeadlineType,Hours,Date'),
            Notify: Ext.copyTo({ Enabled: rv1.NotifyEnabled }, rv1, 'FirsttimeHours,FirsttimeMinutes,Repeatable,RepeatHours,RepeatMinutes,Recipients,MessageItems'),
            Activity: Ext.copyTo({ Enabled: rv1.ActivityEnabled }, rv1, 'ActivityType,ActionName,GotoStep')
        };
        rv.Notify.MessageItems = refs.btnMessage.data;

        return rv;
    },

    updateStatus: function () {
        if (this.suspendUpdateStatus)
            return;

        var me = this,
            refs = me.getReferences(),
            data = me.save(),
            DeadlineType = data.Deadline.DeadlineType,
            CalendarType = data.Calendar.CalendarType,
            NotifyRepeatable = data.Notify.Repeatable;

        refs.cntDeadlineHours.setVisible(DeadlineType != 'Absolute');
        refs.cntDeadlineDate.setVisible(DeadlineType == 'Absolute');
        refs.cmbCalendarName.setDisabled(CalendarType != 'Specific');
        refs.cmbCalendarName.setDisabled(CalendarType != 'Specific');
        refs.edtRepeatEvery.setDisabled(!NotifyRepeatable);
        refs.edtRepeatHours.setDisabled(!NotifyRepeatable);
        refs.edtRepeatUnitHours.setDisabled(!NotifyRepeatable);
        refs.edtRepeatMinutes.setDisabled(!NotifyRepeatable);
        refs.edtRepeatUnitMinutes.setDisabled(!NotifyRepeatable);
    }
});