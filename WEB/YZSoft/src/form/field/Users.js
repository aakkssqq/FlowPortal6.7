/*
singleSelection default:false
*/
Ext.define('YZSoft.src.form.field.Users', {
    extend: 'YZSoft.src.form.field.List',
    triggers: {
        browser: {
            cls: 'yz-trigger-user',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this,
            users = this.getValue();

        if (me.singleSelection == true) {
            YZSoft.SelUserDlg.show({
                fn: function (user) {
                    me.setValue([user]);
                }
            });
        }
        else {
            YZSoft.SelUsersDlg.show({
                initUsers: users,
                scope: me,
                fn: function (users) {
                    me.setValue(users);
                }
            });
        }
        this.fireEvent('browserClick', this.getValue(), this);
    },

    renderItem: function (data) {
        return data.DisplayName || data.Account;
    },

    setValue: function (users) {
        var me = this,
            uids = [];

        users = Ext.isArray(users) ? users : [users];

        Ext.each(users, function (user) {
            if (Ext.isString(user))
                uids.push(user);
        });

        if (uids.length == 0) {
            if (me.singleSelection && users.length > 1)
                users = [users[0]];

            me.callParent([users]);
            return;
        }

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
            params: {
                method: 'UserFromUIDs'
            },
            jsonData: uids,
            scope: me,
            success: function (action) {
                var nusers = [];
                Ext.each(users, function (user) {
                    if (Ext.isString(user)) {
                        var nuser = action.result[user];
                        if (nuser)
                            nusers.push(nuser);
                    }
                    else {
                        nusers.push(user);
                    }
                });
                me.setValue(nusers);
            },
            failure: function (action) {
                alert(action.result.errorMessage);
            }
        });
    }
});