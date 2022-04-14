
Ext.define('YZSoft.src.datasource.Store', {
    extend: 'Ext.data.JsonStore',
    config: {
        ds: null,
        dsFilters: []
    },
    privates: {
        onBeforeLoad: function (operation) {
            var me = this,
                ds = me.getDs(),
                extParams = me.getProxy().getExtraParams(),
                filters = me.getDsFilters();

            if (ds)
                filters = ds.regularRequestFilters(filters);

            Ext.apply(extParams, {
                filters: Ext.encode(filters)
            });

            me.callParent(arguments);
        }
    },

    resetDsFilters: function () {
        var me = this,
            ds = me.getDs(),
            filters = ds.evalFilter();

        me.setDsFilters(filters);
    },

    mergeDsFilters: function (filters) {
        var me = this,
            ds = me.getDs(),
            orgFilters = me.getDsFilters();

        ds.mergeUserFilters(orgFilters, filters);
    }

    //removeDsFilter: function(filterNames) {
    //    var me = this,
    //        filters = me.dsFilters = me.dsFilters || {},
    //        filterNames = Ext.Array.from(filterNames);

    //    Ext.each(filterNames, function(filterName) {
    //        delete filters[filterName];
    //    });
    //},

    //clearConds: function () {
    //    this.setConds([]);
    //},

    //addConds: function (conds) {
    //    var me = this,
    //        addconds = Ext.Array.from(conds),
    //        conds = me.conds = me.conds || [],
    //        existCond;

    //    Ext.Array.each(addconds, function (addcond) {
    //        existCond = Ext.Array.findBy(conds, function (cond) {
    //            if (cond.name == addcond.name &&
    //                cond.op == addcond.op &&
    //                cond.isAll === addcond.isAll)
    //                return true;
    //        });

    //        if (existCond)
    //            Ext.apply(existCond, addcond);
    //        else
    //            conds.push(addcond);
    //    });
    //}
});