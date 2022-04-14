
Ext.define('YZSoft.src.designer.layout.HBox', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        xtype: 'container',
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    }
});