/*
config:
*/
Ext.define('YZSoft.bpm.propertypages.Frequency', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    title: RS.$('All_Frequency'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.frequencyPanels = {
            Daily: Ext.create('YZSoft.src.form.field.FrequencyDaily', {
                fieldLabel: RS.$('All_Date'),
                margin: '0 0 5 0'
            }),
            Weekly: Ext.create('YZSoft.src.form.field.FrequencyWeekly', {
                hidden: true,
                margin: 0
            }),
            Monthly: Ext.create('YZSoft.src.form.field.FrequencyMonthly', {
                hidden: true,
                margin: '0 0 5 0'
            })
        };

        cfg = {
            defaults: {
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Frequency'),
                margin: 0,
                items: [{
                    xtype: 'combo',
                    name: 'FrequencyType',
                    width: 200,
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { name: RS.$('All_Frequency_Daily'), value: 'Daily' },
                            { name: RS.$('All_Frequency_Weekly'), value: 'Weekly' },
                            { name: RS.$('All_Frequency_Monthly'), value: 'Monthly' },
                            { name: RS.$('All_Frequency_Once'), value: 'Once' },
                        ]
                    },
                    editable: false,
                    queryMode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    value: 'Daily',
                    listeners: {
                        scope: me,
                        change: 'onFrequencyTypeChanged'
                    }
                }]
            }, {
                xtype: 'component',
                height: 2,
                hidden: true,
                style: 'background-color:#ababab',
                margin: '5 0 10 0'
            },
            me.frequencyPanels.Daily,
            me.frequencyPanels.Weekly,
            me.frequencyPanels.Monthly, {
                xtype:'component',
                height: 2,
                hidden: true,
                style:'background-color:#ababab',
                margin:'5 0 10 0'
            },{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Frequency_ExectueAt'),
                margin: 0,
                items: [{
                    xtype: 'timefield',
                    name: 'Time',
                    format:'H:i',
                    width: 96
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_StartAt'),
                margin: 0,
                items: [{
                    xtype: 'datefield',
                    name: 'StartDate',
                    width: 200
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onFrequencyTypeChanged: function (combo, newValue) {
        var me = this;

        for (prop in me.frequencyPanels) {
            me.frequencyPanels[prop].setVisible(newValue == prop);
        }
    },

    fill: function (data) {
        if (data.WeeklyWeekDays) {
            for (var i = 0; i < data.WeeklyWeekDays.length; i++)
                data['WeeklyWeekDays' + i] = data.WeeklyWeekDays[i];
            delete data.WeeklyWeekDays;
        }

        if (data.MonthlyMonths) {
            for (var i = 0; i < data.MonthlyMonths.length; i++)
                data['MonthlyMonths' + i] = data.MonthlyMonths[i];
            delete data.MonthlyMonths;
        }

        this.getForm().setValues(data);
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = me.getValuesSubmit();

        rv.WeeklyWeekDays = [];
        for (var i = 0; i <= 6; i++) {
            rv.WeeklyWeekDays[i] = rv['WeeklyWeekDays' + i];
            delete rv['WeeklyWeekDays' + i];
        }

        rv.MonthlyMonths = [];
        for (var i = 0; i <= 11; i++) {
            rv.MonthlyMonths[i] = rv['MonthlyMonths' + i];
            delete rv['MonthlyMonths' + i];
        }

        return rv;
    }
});