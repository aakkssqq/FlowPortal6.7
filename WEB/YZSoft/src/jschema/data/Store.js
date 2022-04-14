
Ext.define('YZSoft.src.jschema.data.Store', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'YZSoft.src.jschema.data.Model',
        'YZSoft.src.jschema.data.Reader'
    ],
    implicitModel: 'YZSoft.src.jschema.data.Model',

    constructor: function (config) {
        var me = this;

        config = Ext.apply({
            proxy: {
                type: 'memory'
            }
        }, config);

        config.proxy.reader = config.proxy.reader || {};

        Ext.apply(config.proxy.reader, {
            xclass: 'YZSoft.src.jschema.data.Reader'
        })

        me.callParent([config]);
    }
});