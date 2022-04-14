
Ext.define('YZSoft.forms.field.SignTrace', {
    extend: 'YZSoft.forms.field.Element',

    getEleTypeConfig: function () {
        var me = this;

        return {
            HiddenExpress: me.getHiddenExp()
        };
    }
});