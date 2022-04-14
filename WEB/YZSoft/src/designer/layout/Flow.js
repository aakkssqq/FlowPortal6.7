
Ext.define('YZSoft.src.designer.layout.Flow', {
    extend: 'Ext.container.Container',
    cls: ['yz-autolayout-inline'],
    layout: {
        type: 'auto'
    },
    scrollable: {
        x: false,
        y: false
    },
    defaults: {
        padding: 5
    },
    padding: 5,

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.defaults = Ext.apply(me.defaults, {
        });

        me.callParent([config]);
    }
});