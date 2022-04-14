
Ext.define('YZSoft.src.designer.layout.Column', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'column'
    },
    scrollable: {
        x: false,
        y: false
    },
    defaults: {
        padding: 20
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            columns = config.columns;

        me.defaults = Ext.apply(me.defaults || {}, {
            columnWidth: 1 / columns
        });

        me.callParent([config]);
    }
});