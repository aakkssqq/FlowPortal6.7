
Ext.define('YZSoft.src.ux.RecordSecurityManager', {
    singleton: true,
    requires: [
    ],

    public: function (grid, rsid, publicPerm, leadershipToken, dataSource) {
        if (!grid)
            return;

        var sm = grid.getSelectionModel(),
            recs = sm.getSelection() || [],
            ids = [];

        if (recs.length == 0)
            return;

        var params = {
            method: 'Public',
            count: recs.length,
            dataSource: dataSource,
            rsid: rsid,
            publicPerm: publicPerm,
            leadershipToken: leadershipToken
        };

        for (var i = 0; i < recs.length; i++) {
            params["ID" + i] = recs[i].id;
        };

        YZSoft.SelUsersDlg.show({
            fn: function (users) {
                if (users.length == 0)
                    return;

                params.SIDCount = users.length;
                var accounts = [];
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    params["SID" + i] = user.SID;
                    accounts.push(YZSoft.Render.getUserDisplayName(user.Account, user.DisplayName));
                };

                var userDisplayString = accounts.join(',');

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/RecordAccessControl.ashx'),
                    params: params,
                    waitMsg: { msg: RS.$('All_Publicing'), target: grid },
                    getSuccessMessage: function (items) {
                        var store = grid.getStore(),
                            msg = '';

                        Ext.each(items, function (item) {
                            if (!Ext.isEmpty(msg))
                                msg += '<br/>'

                            msg += Ext.String.format(RS.$('All_Public_ItemSuccess'), item.ID, YZSoft.HttpUtility.htmlEncode(userDisplayString));
                        });

                        return msg;
                    },
                    success: function (action) {
                        var msg = Ext.String.format(RS.$('All_URecPublic_Success_Msg'), action.result.processedItems.length, YZSoft.HttpUtility.htmlEncode(userDisplayString));

                        Ext.Msg.show({
                            title: RS.$('All_Operation_Success_Title'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO,
                            fn: function (btn, text) {
                            }
                        });
                    },
                    failure: function (action) {
                        var processedItems = action.result.processedItems || [],
                            msg = this.getSuccessMessage(processedItems),
                            rec = recs[processedItems.length],
                            failItem = Ext.String.format(RS.$('All_Public_ItemFail'), rec.getId(), YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true));

                        if (!Ext.isEmpty(msg))
                            msg += '<br/>'

                        msg += failItem;

                        Ext.Msg.show({
                            title: RS.$('All_MsgTitle_Error'),
                            msg: msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING,
                            fn: function (btn, text) {
                            }
                        });
                    }
                });
            }
        });
    }
});