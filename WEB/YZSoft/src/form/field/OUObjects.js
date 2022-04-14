/*
singleSelection default:false
*/
Ext.define('YZSoft.src.form.field.OUObjects', {
    extend: 'YZSoft.src.form.field.List',
    beforeLabelTextTpl: [],
    afterLabelTextTpl: [],
    addable:false,

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

        this.callParent(arguments);
    },

    renderItem: function (data) {
        if (data.Type == 'Member')
            return data.DisplayName || data.Name;

        if (data.Type == 'Role')
            return data.Name;
    }
});