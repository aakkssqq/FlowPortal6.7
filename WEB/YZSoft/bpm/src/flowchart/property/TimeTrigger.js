/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.TimeTrigger', {
    extend: 'YZSoft.bpm.src.flowchart.property.Property',
    dialog: {
        xclass: 'YZSoft.bpm.src.flowchart.dialogs.TimeTrigger'
    },
    staticData: {
        ElementTypeName: 'TimeTriggerNode'
    },
    defaultData: {
        Frequency: {
            FrequencyType: 'Daily',
            DailyFrequencyType: 'EveryWorkDay',
            DailyDays: 1,
            WeeklyWeeks: 1,
            WeeklyWeekDays: [
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ],
            MonthlyMonths: [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ],
            MonthlyFrequencyType: 'Week',
            MonthlyDay: 1,
            MonthlyWeekNo: 1,
            MonthlyWeekDay: 0,
            Time: new Date('2000-01-01 09:00:00'),
            StartDate: new Date()
        },
        ControlDataSet: {
            Tables: []
        }
    }
});