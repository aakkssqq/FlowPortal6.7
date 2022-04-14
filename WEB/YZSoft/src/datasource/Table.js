
/*
datasourceName,
tableName
*/
Ext.define('YZSoft.src.datasource.Table', {
    extend: 'YZSoft.src.datasource.Abstract',
    isTable: true,
    config: {
        datasourceName: 'Default',
        tableName: null,
        orderBy: null
    },

    getParams: function (config, fn, fail) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/DataSource/Table.ashx'),
            params: {
                method: 'GetParams',
                datasourceName: me.getDatasourceName(),
                tableName: me.getTableName()
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
            url: YZSoft.$url('YZSoft.Services.REST/DataSource/Table.ashx'),
            params: {
                method: 'GetSchema',
                datasourceName: me.getDatasourceName(),
                tableName: me.getTableName()
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
                url: YZSoft.$url('YZSoft.Services.REST/DataSource/Table.ashx'),
                extraParams: {
                    method: 'GetDataNoPaged',
                    datasourceName: me.getDatasourceName(),
                    tableName: me.getTableName(),
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
            type: 'table',
            datasourceName: me.getDatasourceName(),
            tableName: me.getTableName(),
            orderBy: me.getOrderBy(),
            filter: me.getFilter(),
            pageSize: me.getPageSize()
        };
    }
});