/*
*/

Ext.define('YZSoft.src.form.field.FrequencyDaily', {
    extend: 'Ext.form.FieldContainer',
    referenceHolder: true,
    layout: 'hbox',

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
                xtype: 'container',
                layout: {
                    type:'vbox',
                    align:'stretch'
                },
                items: [{
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        boxLabel: RS.$('All_Frequency_Daily'),
                        width: 180,
                        name: 'DailyFrequencyType',
                        inputValue: 'EveryDay',
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        boxLabel: RS.$('All_EveryWorkDay'),
                        name: 'DailyFrequencyType',
                        reference: 'rdoEveryWorkDay',
                        inputValue: 'EveryWorkDay',
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, {
                        xtype: 'displayfield',
                        value: RS.$('All_Calendar'),
                        margin: '0 10 0 60'
                    }, {
                        xtype: 'combobox',
                        name: 'DailyTimeSheetName',
                        reference: 'cmbDailyTimeSheetName',
                        editable: false,
                        queryMode: 'local',
                        store: me.storeTimeSheet,
                        valueField: 'Name',
                        displayField: 'Name',
                        width: 180
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'radio',
                        boxLabel: RS.$('All_Every'),
                        name: 'DailyFrequencyType',
                        reference: 'rdoDays',
                        inputValue: 'Days',
                        listeners: {
                            scope: me,
                            change: 'updateStatus'
                        }
                    }, {
                        xtype: 'numberfield',
                        minValue: 1,
                        value:1,
                        name: 'DailyDays',
                        reference: 'edtDailyDays',
                        width: 80,
                        margin: '0 8 0 20'
                    }, {
                        xtype: 'displayfield',
                        value: RS.$('All_UnitDays')
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

        refs.cmbDailyTimeSheetName.setDisabled(!refs.rdoEveryWorkDay.getValue());
        refs.edtDailyDays.setDisabled(!refs.rdoDays.getValue());
    }
})