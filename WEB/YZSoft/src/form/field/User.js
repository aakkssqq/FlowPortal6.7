
Ext.define('YZSoft.src.form.field.User', {
    extend: 'Ext.form.field.Text',
    xtype: 'YZUserField',
    allowBlank: true,
    triggers: {
        browser: {
            cls: 'yz-trigger-user',
            handler: 'onBrowser'
        }
    },

    onBrowser: function () {
        var me = this;

        YZSoft.SelUserDlg.show({
            fn: function (user) {
                if (user == null)
                    return;

                me.onSelect(user);
            }
        });
    },

    onSelect: function (user) {
        this.setValue(user.Account);
        this.fireEvent('select', user);
    }
});