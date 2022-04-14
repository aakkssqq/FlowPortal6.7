
/*
datasourceName,
query,
queryParams
    name: paramName,
    displayName: null,
    dataType: null,
    defaultValue: null,
    desc: null,
    internalParam: false
*/
Ext.define('YZSoft.src.datasource.Query', {
    extend: 'YZSoft.src.datasource.Abstract',
    requires: [
        'Ext.util.Base64'
    ],
    isQuery: true,
    config: {
        datasourceName: 'Default',
        query: null,
        queryParams: null
    },

    getFilter: function () {
        var me = this,
            params = me.getInParams(),
            rv = {};

        Ext.each(params, function (param) {
            if (param.defaultValue === null || param.defaultValue === undefined)
                return;

            rv[param.name] = {
                op: '=',
                value: param.defaultValue
            };
        });

        return rv;
    },

    getInParams: function () {
        var me = this,
            params = [],
            queryParams = me.getQueryParams();

        Ext.each(queryParams, function (param) {
            if (!param.internalParam)
                params.push(Ext.clone(param));
        });

        return params;
    },

    getParams: function (config, fn, fail) {
        var me = this
            params = me.getInParams();

        fn && fn(params);
    },

    getSchema: function (config, fn, fail) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/DataSource/Query.ashx'),
            params: {
                method: 'GetSchema',
                datasourceName: me.getDatasourceName(),
                query: Ext.util.Base64.encode(me.getQuery()),
                queryParams: Ext.encode(me.getInParams())
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

    createStore: function (config) {
        var me = this;

        return Ext.create('YZSoft.src.datasource.Store', Ext.apply({
            ds: me,
            dsFilters: me.evalFilter(),
            pageSize: me.getPageSize() || 100,
            proxy: {
                type: 'ajax',
                actionMethods: { read: 'POST' },
                url: YZSoft.$url('YZSoft.Services.REST/DataSource/Query.ashx'),
                extraParams: {
                    method: 'GetDataPaged',
                    paging: me.getPaging() || 'Enable',
                    datasourceName: me.getDatasourceName(),
                    query: Ext.util.Base64.encode(me.getQuery()),
                    queryParams: Ext.encode(me.getInParams())
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
            type: 'query',
            datasourceName: me.getDatasourceName(),
            query: me.getQuery(),
            queryParams: me.getQueryParams(),
            paging: me.getPaging(),
            pageSize: me.getPageSize()
        };
    }
});