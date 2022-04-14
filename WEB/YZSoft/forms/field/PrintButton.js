
Ext.define('YZSoft.forms.field.PrintButton', {
    extend: 'YZSoft.forms.field.Button',

    onClick: function (e) {
        var me = this,
            et = me.getEleType();

        e.stopEvent();
        window.print();
    }
});