Ext.define('YZSoft.bpm.src.model.SID', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'SIDType' },
        { name: 'SID' },
        { name: 'DisplayName' }
    ],

    inheritableStatics: {
        equFn: function (data1, data2) {
            return data1.SIDType == data2.SIDType && data1.SID == data2.SID;
        }
    }
});