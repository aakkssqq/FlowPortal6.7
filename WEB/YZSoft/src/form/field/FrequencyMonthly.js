/*
*/

Ext.define('YZSoft.src.form.field.FrequencyMonthly', {
    extend: 'Ext.form.FieldContainer',
    referenceHolder: true,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
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

        cfg = {
            defaults: {
                submitValue: false,
                listeners: {
                    change: function () {
                        me.fireEvent('change');
                    }
                }
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Caption_Months'),
                defaults: {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'checkbox',
                        width: 100,
                        margin: 0,
                        value: true
                    }
                },
                items: [{
                    items: [
                        { boxLabel: RS.$('All_Month1'), name: 'MonthlyMonths0' },
                        { boxLabel: RS.$('All_Month2'), name: 'MonthlyMonths1' },
                        { boxLabel: RS.$('All_Month3'), name: 'MonthlyMonths2' },
                        { boxLabel: RS.$('All_Month4'), name: 'MonthlyMonths3' },
                    ]
                }, {
                    items: [
                        { boxLabel: RS.$('All_Month5'), name: 'MonthlyMonths4' },
                        { boxLabel: RS.$('All_Month6'), name: 'MonthlyMonths5' },
                        { boxLabel: RS.$('All_Month7'), name: 'MonthlyMonths6' },
                        { boxLabel: RS.$('All_Month8'), name: 'MonthlyMonths7' }
                    ]
                }, {
                    items: [
                        { boxLabel: RS.$('All_Month9'), name: 'MonthlyMonths8' },
                        { boxLabel: RS.$('All_Month10'), name: 'MonthlyMonths9' },
                        { boxLabel: RS.$('All_Month11'), name: 'MonthlyMonths10' },
                        { boxLabel: RS.$('All_Month12'), name: 'MonthlyMonths11' }
                    ]
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Date'),
                items: [{
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        boxLabel: RS.$('All_Date'),
                        name: 'MonthlyFrequencyType',
                        reference: 'rdoDay',
                        inputValue: 'Day',
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, {
                        xtype: 'numberfield',
                        minValue: 1,
                        value: 1,
                        width: 80,
                        margin: '0 8',
                        name: 'MonthlyDay',
                        reference: 'edtMonthlyDay'
                    }, {
                        xtype: 'displayfield',
                        value: RS.$('All_UnitMonthDay')
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        boxLabel: RS.$('All_Caption_ByWeek'),
                        name: 'MonthlyFrequencyType',
                        reference: 'rdoWeek',
                        inputValue: 'Week',
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, {
                        xtype: 'combo',
                        name: 'MonthlyWeekNo',
                        reference: 'edtMonthlyWeekNo',
                        width: 120,
                        margin: '0 5 0 8',
                        store: {
                            fields: ['name', 'value'],
                            data: [
                                { name: RS.$('All_Week_First'), value: 1 },
                                { name: RS.$('All_Week_Second'), value: 2 },
                                { name: RS.$('All_Week_Third'), value: 3 },
                                { name: RS.$('All_Week_Fourth'), value: 4 },
                                { name: RS.$('All_Week_TheLastOne'), value: -1 }
                            ]
                        },
                        editable: false,
                        queryMode: 'local',
                        valueField: 'value',
                        displayField: 'name',
                        value:1
                    }, {
                        xtype: 'combo',
                        name: 'MonthlyWeekDay',
                        reference: 'edtMonthlyWeekDay',
                        width: 106,
                        store: {
                            fields: ['name', 'value'],
                            data: [
                                { name: RS.$('All_Week1'), value: 0 },
                                { name: RS.$('All_Week2'), value: 1 },
                                { name: RS.$('All_Week3'), value: 2 },
                                { name: RS.$('All_Week4'), value: 3 },
                                { name: RS.$('All_Week5'), value: 4 },
                                { name: RS.$('All_Week6'), value: 5 },
                                { name: RS.$('All_Week7'), value: 6 }
                            ]
                        },
                        editable: false,
                        queryMode: 'local',
                        valueField: 'value',
                        displayField: 'name',
                        value:0
                    }]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences();

        refs.edtMonthlyDay.setDisabled(!refs.rdoDay.getValue());
        refs.edtMonthlyWeekNo.setDisabled(!refs.rdoWeek.getValue());
        refs.edtMonthlyWeekDay.setDisabled(!refs.rdoWeek.getValue());
    }
});