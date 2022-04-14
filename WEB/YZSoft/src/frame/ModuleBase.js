
Ext.define('YZSoft.src.frame.ModuleBase', {
    extend: 'Ext.panel.Panel',
    border: false,
    navigatorXClass: 'YZSoft.src.frame.Navigater',
    viewXClass: 'YZSoft.src.frame.FuncView',

    constructor: function (config) {
        var me = this;

        me.navigaterView = Ext.create(me.navigatorXClass, Ext.apply({
            dataURL: config.dataURL,
            title: config.title,
            activeNode: config.activeNode
        }, config.navigater));

        me.functionView = Ext.create(me.viewXClass, Ext.apply({
        }, config.view));

        var cfg = {
            navigaterView: me.navigaterView,
            functionView: me.functionView,
            layout: 'border',
            items: [me.navigaterView, me.functionView]
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);

        me.functionView.relayEvents(me, ['activate']);
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.addCls('yz-panel-module');
        me.navigaterView.on('selectionchange', me.onSelectionChange, me);
    },

    onSelectionChange: function (record) {
        this.functionView.showModule(record);
    },

    setActiveNode: function (nodeid, callback, scope) {
        if (this.navigaterView && this.navigaterView.setActiveNode)
            this.navigaterView.setActiveNode(nodeid, callback, scope);
    },

    setActiveTab: function (record, moduleid, callback, scope) {
        if (this.functionView && this.functionView.setActiveTab)
            this.functionView.setActiveTab(record, moduleid, callback, scope);
    }
});
