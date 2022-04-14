
Ext.define('YZSoft.src.designer.container.VBoxInnerContainer', {
    extend: 'YZSoft.src.designer.container.Abstract',
    cls: ['yz-designer-container', 'yz-designer-container-inner'],
    scrollable: {
        x: false,
        y: false
    },
    defaults: {
        padding: 20
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        //消除YZSoft.src.designer.layout.HBox defaults中layout的影响
        Ext.apply(config, {
            layout: {
                type: 'auto'
            }
        });

        me.callParent([config]);
    }
});