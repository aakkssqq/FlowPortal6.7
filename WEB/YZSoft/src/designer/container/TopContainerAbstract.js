
Ext.define('YZSoft.src.designer.container.TopContainerAbstract', {
    extend: 'YZSoft.src.designer.container.Abstract',
    style: 'background-color:#fff;',
    scrollable: true,

    constructor: function (config) {
        config.designer.dcnt = this;
        this.callParent([config]);
    },

    nextid: function (perfix, seed) {
        var me = this,
            seed = seed || 1,
            i, id;

        for (i = seed; ; i++) {
            id = perfix + i;

            if (!me.getPartFromId(id))
                return id;
        }
    }
});