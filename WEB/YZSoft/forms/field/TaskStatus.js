
Ext.define('YZSoft.forms.field.TaskStatus', {
    extend: 'YZSoft.forms.field.Element',

    getEleTypeConfig: function () {
        var me = this;

        return {
            HiddenExpress: me.getHiddenExp()
        };
    }
});