Ext.define('YZSoft.src.model.AssignPermSID', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'SIDType' },
        { name: 'SID' },
        { name: 'ACERoleParam2' },
        { name: 'ACERoleParam3' },
        { name: 'Inherited' },
        { name: 'Loacl' },
        { name: 'DisplayName' }
    ],

    inheritableStatics: {
        equFn: function (data1, data2) {
            if (data1.SIDType != data2.SIDType)
                return false;

            switch (data1.SIDType) {
                case 'UserSID':
                case 'GroupSID':
                case 'OUSID':
                case 'RoleSID':
                case 'LeaderTitleSID':
                    return String.Equ(data1.SID, data2.SID);
                case 'CustomCode':
                    return String.Equ(data1.SID, data2.SID);
                default:
                    return false;
            }
        }
    }
});