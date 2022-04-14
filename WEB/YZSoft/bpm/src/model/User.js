Ext.define('YZSoft.bpm.src.model.User', {
    extend: 'Ext.data.Model',
    idProperty: 'Account',
    fields: [
        { name: 'Account' },
        { name: 'DisplayName' },
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
