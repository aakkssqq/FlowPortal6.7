
Ext.define('YZSoft.forms.field.CustomBrowserButton', {
    extend: 'YZSoft.forms.field.BrowserButtonBase',
    multiSelect:false,

    getEleTypeConfig: function () {
        var me = this,
            config = me.callParent(arguments);

        Ext.apply(config, {
            forceFilter: true,
            sDataSource: me.getDataSource(),
            multiSelect: me.multiSelect
        });

        return config;
    }
});