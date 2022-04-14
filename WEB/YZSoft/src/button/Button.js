/*
config
    store
    sm
    updateStatus

events
    beforeToggle
*/
Ext.define('YZSoft.src.button.Button', {
    extend: 'Ext.button.Button',
    updateStatus: Ext.emptyFn,

    constructor: function (config) {
        this.callParent([config]);

        this.dobind(config);

        this.on('beforerender', this.onUpdateStatus, this);
    },

    onUpdateStatus: function () {
        Ext.callback(this.updateStatus, this.scope || this);
    },

    dobind: function (config) {
        if (config.store)
            config.store.on('load', this.onUpdateStatus, this);

        if (config.store)
            config.store.on('datachanged', this.onUpdateStatus, this);

        if (config.sm)
            config.sm.on('selectionchange', this.onUpdateStatus, this);
    },

    doToggle: function () {
        var me = this;

        if (me.fireEvent('beforeToggle', me, !me.pressed) !== false)
            me.callParent(arguments);
    }
});