Ext.define('YZSoft.bpm.src.model.UserExt', {
    extend: 'Ext.data.Model',
    idProperty: 'Account',
    fields: [
        { name: 'Account' },
        { name: 'DisplayName' },
        { name: 'SID' },
        { name: 'MemberFullName' },
        { name: 'LeaderTitle' },
        { name: 'Department' },
        { name: 'Description' },
        { name: 'Birthday' },
        { name: 'HRID' },
        { name: 'DateHired' },
        { name: 'Office' },
        { name: 'CostCenter' },
        { name: 'OfficePhone' },
        { name: 'HomePhone' },
        { name: 'Mobile' },
        { name: 'EMail' },
        { name: 'WWWHomePage' },
        { name: 'ShortName' },
        { name: 'FriendlyName' },
        { name: 'ExtAttrs' },
        { name: 'parentouName' },
        { name: 'parentouFullNameFriendly' },
        { name: 'memberFriendlyName' },
        { name: 'search' },
        {
            name: 'headsort',
            depends: ['Account'],
            convert: function (v, rec) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: rec.data.Account,
                    thumbnail: 'M'
                }));
            }
        }
    ]
});
