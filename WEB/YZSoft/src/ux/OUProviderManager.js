
Ext.define('YZSoft.src.ux.OUProviderManager', {
    singleton: true,
    requires: [
    ],

    getProviderInfo: function (nameSpace) {
        var me = this;

        nameSpace = me.getNameSpaceFromFullName(nameSpace).toLowerCase();
        me.providers = me.providers || {};

        if (!(nameSpace in me.providers)) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                params: {
                    method: 'GetProviderInfo',
                    nameSpace: nameSpace
                },
                success: function (action) {
                    me.providers[nameSpace] = action.result;
                }
            });
        }

        return me.providers[nameSpace];
    },

    getNameSpaceFromFullName: function (fullName) {
        var idx = fullName.indexOf(':');
        if (idx == -1)
            return fullName;
        else
            return fullName.substr(0, idx);
    }
});