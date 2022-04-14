
Ext.define('YZSoft.forms.field.SignHistory', {
    extend: 'YZSoft.forms.field.Element',

    getEleTypeConfig: function () {
        var me = this;

        return {
            HiddenExpress: me.getHiddenExp()
        };
    }
});