
/*
datasourceName,
procedureName
*/
Ext.define('YZSoft.src.datasource.Procedure', {
    extend: 'YZSoft.src.datasource.Abstract',
    isProcedure: true,
    config: {
        datasourceName: 'Default',
        procedureName: null
    },

    getParams: function (config, fn, fail) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/DataSource/Procedure.ashx'),
            params: {
                method: 'GetParams',
                datasourceName: me.getDatasourceName(),
                procedureName: me.getProcedureName()
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
            url: YZSoft.$url('YZSoft.Services.REST/DataSource/Procedure.ashx'),
            params: {
                method: 'GetSchema',
                datasourceName: me.getDatasourceName(),
                procedureName: me.getProcedureName()
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
                url: YZSoft.$url('YZSoft.Services.REST/DataSource/Procedure.ashx'),
                extraParams: {
                    method: 'GetDataNoPaged',
                    datasourceName: me.getDatasourceName(),
                    procedureName: me.getProcedureName()
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
            type: 'procedure',
            datasourceName: me.getDatasourceName(),
            procedureName: me.getProcedureName(),
            filter: me.getFilter(),
            pageSize: me.getPageSize()
        };
    }
});