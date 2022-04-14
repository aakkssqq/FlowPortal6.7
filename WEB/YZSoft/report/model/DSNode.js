Ext.define('YZSoft.report.model.DSNode', {
    extend: 'Ext.data.TreeModel',
    config: {
        store:null
    },
    fields: [
    ],

    updateStore: function (newstore) {
        this.fireEvent('storechanged', newstore);
    }
});