/*
*   store
*   sm
*   updateStatus
*/
Ext.define('YZSoft.src.menu.Item', {
    extend: 'Ext.menu.Item',
    iconCls: 'blist',
    updateStatus: Ext.emptyFn,

    constructor: function (config) {
        this.callParent([config]);

        if (this.store)
            this.store.on('load', this.onUpdateStatus, this);

        if (this.sm)
            this.sm.on('selectionchange', this.onUpdateStatus, this);

        this.on('beforerender', this.onUpdateStatus, this);
    },

    onUpdateStatus: function () {
        Ext.callback(this.updateStatus, this.scope || this);
    }
});