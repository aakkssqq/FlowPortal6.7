
Ext.define('YZSoft.bpm.src.ux.Server', {
    singleton: true,

    getMessageGroups: function (callback) {
        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: { method: 'GetServerNotifyMessages' },
            success: function (action) {
                callback(action.result);
            }
        });
    }
});