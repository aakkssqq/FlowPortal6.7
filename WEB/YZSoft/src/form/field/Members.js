/*
singleSelection default:false
*/
Ext.define('YZSoft.src.form.field.Members', {
    extend: 'YZSoft.src.form.field.Users',
    triggers: {
        browser: {
            cls: 'yz-trigger-member',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this,
            users = this.getValue();

        if (me.singleSelection == true) {
            YZSoft.SelMemberDlg.show({
                fn: function (user) {
                    me.setValue([user]);
                }
            });
        }
        else {
            YZSoft.SelMembersDlg.show({
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
    }
});