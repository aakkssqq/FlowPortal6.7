
Ext.define('YZSoft.bpm.src.ux.StoreParamsUtility', {
    singleton: true,

    /*
    config{
        params
        perfix - property perfix of include/exclude
    }
    */
    setIncludeExclude: function (store, include, exclude, config) {
        config = config || {};

        var me = this,
            includeProp = config.perfix || 'include',
            excludeProp = config.perfix || 'exclude',
            extraParams = config.params || store.getProxy().getExtraParams();

        include = include || [];
        include = Ext.isArray(include) ? include : [include];

        exclude = exclude || [];
        exclude = Ext.isArray(exclude) ? exclude : [exclude];

        if (include.length == 0)
            delete extraParams[includeProp];
        else
            extraParams[includeProp] = Ext.encode(include);

        if (exclude.length == 0)
            delete extraParams[excludeProp];
        else
            extraParams[excludeProp] = Ext.encode(exclude);

        return extraParams;
    }
});