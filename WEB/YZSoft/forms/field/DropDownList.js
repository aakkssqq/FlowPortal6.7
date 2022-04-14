
Ext.define('YZSoft.forms.field.DropDownList', {
    extend: 'YZSoft.forms.field.ListBase',
    supportSpoor: true,

    onBeforeAddOption: function (orgValue, rows) {
        var me = this,
            et = me.getEleType(),
            opt;

        if (et.promptText && rows.length != 1) {
            opt = me.createOption(et.promptText, '');

            if (!orgValue && orgValue !== 0)
                opt.selected = true;

            me.addOption(opt);
        }
    },

    onAfterAddOption: function (rows) {
        var me = this,
            et = me.getEleType();

        if (et.promptText && rows.length != 1) {
            var r = {};
            r[et.DisplayColumn] = '';
            r[et.ValueColumn] = '';
            rows.splice(0, 0, r);
        }
    }
});