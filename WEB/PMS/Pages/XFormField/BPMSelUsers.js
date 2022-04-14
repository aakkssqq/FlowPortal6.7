
Ext.define('Demo.XFormField.BPMSelUsers', {
    extend: 'YZSoft.forms.field.ExtJSControl',
    xclass: 'YZSoft.src.form.field.Users',

    getValue: function () {
        var users = this.callParent() || [],
            rv = [];

        Ext.each(users, function (user) {
            rv.push(user.Account);
        });

        return rv.join(',');
    },

    setValue: function (value) {
        value = (value || '').split(',');
        this.callParent([value]);
    }
});