/*
*/

Ext.define('YZSoft.src.form.field.FrequencyWeekly', {
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
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_Every'),
                layout: 'hbox',
                margin: 0,
                defaults: {
                    margin: 0
                },
                items: [{
                    xtype: 'numberfield',
                    minValue: 1,
                    value:1,
                    width:80,
                    margin: '0 8 0 0',
                    name: 'WeeklyWeeks'
                }, {
                    xtype: 'displayfield',
                    value: RS.$('All_UnitWeek')
                }]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_SelectDate'),
                defaults: {
                    xtype: 'container',
                    layout: 'hbox',
                    defaults: {
                        xtype: 'checkbox',
                        width: 100,
                        margin: 0,
                        value:true
                    }
                },
                items: [{
                    items: [
                        { boxLabel: RS.$('All_Week1'), name: 'WeeklyWeekDays0' },
                        { boxLabel: RS.$('All_Week2'), name: 'WeeklyWeekDays1' },
                        { boxLabel: RS.$('All_Week3'), name: 'WeeklyWeekDays2' }
                    ]
                }, {
                    items: [
                        { boxLabel: RS.$('All_Week4'), name: 'WeeklyWeekDays3' },
                        { boxLabel: RS.$('All_Week5'), name: 'WeeklyWeekDays4' },
                        { boxLabel: RS.$('All_Week6'), name: 'WeeklyWeekDays5' }
                    ]
                }, {
                    items: [
                        { boxLabel: RS.$('All_Week7'), name: 'WeeklyWeekDays6' }
                    ]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
})