
Ext.define('YZSoft.src.designer.part.layout.Abstract', {
    extend: 'YZSoft.src.designer.part.Abstract',
    selectable: false,
    optHtml: '<div class="opt delete"></div>',

    constructor: function (config) {
        var me = this;


        me.callParent(arguments);
        me.addCls('yz-part-layout');
    }
});