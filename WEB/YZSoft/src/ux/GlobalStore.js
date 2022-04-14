Ext.define('YZSoft.src.ux.GlobalStore', {
    singleton: true,

    getGroupImageStore: function () {
        var me = this,
            storeName = 'groupImageTypeStore',
            store = Ext.data.StoreManager.lookup(storeName);

        if (!store) {
            Ext.Loader.syncRequire('YZSoft.src.model.ClassicGroupImage');

            store = Ext.create('Ext.data.Store', {
                model: 'YZSoft.src.model.ClassicGroupImage',
                storeId: storeName
            });

            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                async: false,
                params: {
                    method: 'GetClassicsGroupImage'
                },
                success: function (action) {
                    store.setData(action.result);
                },
                failure: function (action) {
                    Ext.Msg.alert(RS.$('All__NetworkUnavaliable'), action.result.errorMessage);
                }
            });
        }

        return store;
    },
});