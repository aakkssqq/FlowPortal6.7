
Ext.define('YZSoft.src.library.base.data.FolderStore', {
    extend: 'Ext.data.JsonStore',
    requires: [
        'YZSoft.src.library.base.data.FolderReader'
    ],

    constructor: function (config) {
        config = Ext.apply({
            proxy: {
                type: 'memory'
            }
        }, config);

        config.proxy.reader = config.proxy.reader || {};

        Ext.apply(config.proxy.reader, {
            xclass: 'YZSoft.src.library.base.data.FolderReader'
        })

        this.callParent([config]);
    }
});