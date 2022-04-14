Ext.define('YZSoft.bpm.src.model.Participant', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'ParticipantType' },
        { name: 'SParam1' },
        { name: 'SParam2' },
        { name: 'SParam3' },
        { name: 'SParam4' },
        { name: 'SParam5' },
        { name: 'LParam1' },
        { name: 'LParam2' },
        { name: 'LParam3' },
        { name: 'Include' },
        { name: 'Exclude' },
        { name: 'IsValid' },
        { name: 'DisplayString' },
        { name: 'Express' },
        { name: 'LeaderType', yzenum: { type: 'BPM.ParticipantLeaderType', store: 'LParam1'} },
        { name: 'SpecifiedType', yzenum: { type: 'BPM.ParticipantSpecifiedType', store: 'LParam1'} },
        { name: 'SponsorType', yzenum: { type: 'BPM.ParticipantSponsorType', store: 'LParam1'} }
    ],

    inheritableStatics: {
        equFn: function (data1, data2) {
            return data1.ParticipantType == data2.ParticipantType && data1.Express == data2.Express;
        }
    }
});
