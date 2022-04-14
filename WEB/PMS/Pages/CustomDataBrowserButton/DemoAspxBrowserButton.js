
Ext.define('Demo.CustomDataBrowserButton.DemoAspxBrowserButton', {
    extend: 'YZSoft.forms.field.AspxBrowserButton',
    datasourceColumns: ['Product', 'Price', 'Qty'], //用与在设计表单，设置DataMap时，显示可map数据列
    datasourceParams: ['ProductCode'],
    multiSelect: false,
    dlgConfig: {
        width:320,
        height:200
    },

    constructor: function (config) {
        var me = this;

        me.url = YZSoft.$url(me,'CustomDataBrowser.aspx');
        me.callParent(arguments);
    }
});