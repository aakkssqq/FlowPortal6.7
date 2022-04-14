
Ext.define('YZSoft.src.datasource.Abstract', {
    extend: 'Ext.Evented',
    requires: [
        'YZSoft.src.ux.ValueEval'
    ],
    config: {
        filter: {},
        pageSize: 100,
        paging:'Enable'
    },

    applyFilters: function (filters) {
        if (Ext.isObject(filters)) {
            Ext.Object.each(filters, function (name, filter) {
                if (!Ext.isObject(filter)) {
                    filter = filters[name] = {
                        op: '=',
                        value: filter
                    }
                }
                else {
                    filter.op = filter.op || '=';
                }
            });
        }

        return filters;
    },

    //getInitFilter: function (fn) {
    //    var me = this,
    //        filters = [],
    //        fixFilters = me.evalFilter();

    //    me.getParams({}, function (params) {
    //        filters = me.params2Filters(params);
    //        me.mergeFilter(filters, fixFilters);
    //        fn && fn(filters);
    //    });
    //},

    //params2Filters: function (params) {
    //    var me = this,
    //        rv = [];

    //    Ext.ecah(params, function (param) {
    //        rv.push({
    //            name: param.name,
    //            dataType: param.dataType,
    //            op: param.op || '',
    //            value: null
    //        });
    //    });

    //    return rv;
    //},

    evalFilter: function () {
        var me = this,
            filters = me.getFilter(),
            rv = [];

        Ext.Object.each(filters, function (name, filter) {
            rv.push({
                name: name,
                op: filter.op,
                value: YZSoft.src.ux.ValueEval.eval(filter.value),
                isDsFilter: true
            });
        });

        return rv;
    },

    mergeUserFilters: function (filters, userFilters) {
        var existFilter,
            userFilters = Ext.Array.from(userFilters);

        Ext.each(userFilters, function (filter) {
            existFilter = Ext.Array.findBy(filters, function (existFilter) {
                if (existFilter.isAll == filter.isAll &&
                    String.Equ(existFilter.name,filter.name) &&
                    existFilter.op == filter.op)
                    return true;
            });

            if (Ext.isEmpty(filter.value)) {
                if (existFilter && existFilter.isDsFilter)
                    Ext.Array.remove(filters, existFilter);

                return;
            }

            if (existFilter) {
                Ext.apply(existFilter, filter);
                delete existFilter.isDsFilter;
            }
            else {
                filters.push(filter);
            }
        });

        return filters;
    },

    regularRequestFilters: function (filters) {
        var rv = [];

        Ext.each(filters, function (filter) {
            filter = Ext.clone(filter);
            delete filter.isDsFilter;

            rv.push(filter);
        });

        return rv;
    }
});