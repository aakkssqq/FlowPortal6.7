
Ext.define('YZSoft.im.src.FunctionTab', {
    extend: 'YZSoft.src.tab.Panel',
    xtype: 'yz-tab-module',
    cls: 'yz-tab-module yz-s-module-tab yz-im-tab-module',
    border: false,
    deferredRender: true,
    hideTab: false,
    header:false,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            activate: function () {
                me.getActiveTab().fireEvent('activate');
            }
        });
    },

    setTitle: function (title) {
        this.cmpTitle.update({
            title: title
        });
    },

    onAdd: function (item, index) {
        if (item.layout.type != 'card' && !item.preventAddCls) {
            item.addCls('yz-func-panel');
            if (item.addBodyCls)
                item.addBodyCls('yz-func-panel-body');
        }

        this.callParent(arguments);
    }
});