/*
config
sprite
data
*/
Ext.define('YZSoft.bpm.src.flowchart.property.Defaultes', {
    singleton: true,

    FreeRoutingParticipant: {
        ParticipantDeclare: {
            RecpDeclareSteps:[],
            MultiRecipient: true,
            RoutingType: 'None',
            JumpIfNoParticipants: false
        }
    },

    Participant: {
        NoParticipantsAction: 'PreventSubmit',
        JumpIfSameOwnerWithPrevStep: false,
        JumpIfProcessed: false,
        JumpIfSameOwnerWithInitiator: false,
        Participants: [],
        ParticipantPolicy: {
            PolicyType: 'FirstUser',
            BParam1: true
        }
    },
    ParticipantDecisionStep: {
        NoParticipantsAction: 'Jump',
        JumpIfSameOwnerWithPrevStep: false,
        JumpIfProcessed: false,
        JumpIfSameOwnerWithInitiator: false,
        Participants: [],
        ParticipantPolicy: {
            PolicyType: 'FirstUser',
            BParam1: true
        }
    },
    DataControl: {
        ControlDataSet: {
            Tables: []
        },
        InitCreateRecordSet: {
            Tables: []
        }
    },
    Message: {
        MessageItems: []
    },
    Links: {
        SystemLinks: [
      ],
        RecedeBackExtGroups: []
    },

    Timeout: {
        TimeoutRule: {
            Calendar: {
                CalendarType: 'StepOwner',
                CalendarName: ''
            },
            Deadline: {
                Enabled: false,
                DeadlineType: 'AfterEnterStep',
                Hours: 2,
                Date: ''
            },
            Notify: {
                Enabled: false,
                FirsttimeHours: 1,
                FirsttimeMinutes: 0,
                Repeatable: true,
                RepeatHours: 1,
                RepeatMinutes: 0,
                Recipients: [],
                MessageItems: []
            },
            Activity: {
                Enabled: false,
                ActivityType: 'AutoProcess',
                ActionName: '',
                GotoStep: ''
            }
        }
    },
    Events: {
        Events: []
    },
    Rules: {
        Rules: []
    },

    copy: function (data, names) {
        var me = this,
            names = Ext.isString(names) ? names.split(',') : names;

        Ext.each(names, function (name) {
            Ext.apply(data, me[name]);
        });

        return data;
    }
});