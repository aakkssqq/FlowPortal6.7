
Ext.define('YZSoft.report.search.field.mixin', {

    getParamNames: function () {
        var me = this,
            xdatabind = Ext.String.trim(me.xdatabind),
            paramNames;

        if (xdatabind)
            paramNames = xdatabind.split(';');
        else
            paramNames = [];

        return paramNames;
    },

    getDSFilters: function () {
        var me = this,
            paramNames = me.getParamNames(),
            value = me.getValue(),
            rv = [];

        Ext.each(paramNames, function (paramName) {
            rv = Ext.Array.push(rv, me.getDSFilter(paramName));
        });

        return rv;
    }
});