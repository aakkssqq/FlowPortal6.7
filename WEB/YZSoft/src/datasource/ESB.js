
/*
esbObjectName
*/
Ext.define('YZSoft.src.datasource.ESB', {
    extend: 'YZSoft.src.datasource.Abstract',
    isESB: true,
    config: {
        esbObjectName: null,
        orderBy: null
    },

    getParams: function (config, fn, fail) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/DataSource/ESB.ashx'),
            params: {
                method: 'GetParams',
                esbObjectName: me.getEsbObjectName()
            },
            success: function (action) {
                fn && fn(action.result);
            },
            failure: fail ? function (action) {
                fail(action);
            } : null
        }, config));
    },

    getSchema: function (config, fn, fail) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/DataSource/ESB.ashx'),
            params: {
                method: 'GetSchema',
                esbObjectName: me.getEsbObjectName()
            },
            success: function (action) {
                var columns = action.result;
                fn && fn(columns);
            },
            failure: fail ? function (action) {
                fail(action);
            } : null
        }, config));
    },

    createStoreNoPaged: function (config) {
        var me = this;

        return Ext.create('YZSoft.src.datasource.Store', Ext.apply({
            ds: me,
            dsFilters: me.evalFilter(),
            proxy: {
                type: 'ajax',
                actionMethods: { read: 'POST' },
                url: YZSoft.$url('YZSoft.Services.REST/DataSource/ESB.ashx'),
                extraParams: {
                    method: 'GetDataNoPaged',
                    esbObjectName: me.getEsbObjectName(),
                    orderBy: me.getOrderBy()
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        }, config));
    },

    archive: function () {
        var me = this;

        return {
            type: 'esb',
            esbObjectName: me.getEsbObjectName(),
            orderBy: me.getOrderBy(),
            filter: me.getFilter(),
            pageSize: me.getPageSize()
        };
    }
});