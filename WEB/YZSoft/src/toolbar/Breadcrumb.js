/*
*/

Ext.define('YZSoft.src.toolbar.Breadcrumb', {
    extend: 'Ext.toolbar.Breadcrumb',

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        config.store.on({
            update: function (store, record, operation, modifiedFieldNames, details, eOpts) {
                if (modifiedFieldNames == 'text') {
                    Ext.each(me._buttons, function (button) {
                        if (button._breadcrumbNodeId == record.getId())
                            button.setText(record.data.text);                            
                    });
                }
            }
        });
    }
});