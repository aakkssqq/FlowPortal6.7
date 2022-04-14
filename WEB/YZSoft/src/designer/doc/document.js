/*
src: 文档内容
classManager 可选项，缺省为YZSoft.src.designer.runtime.ClassManager
*/

Ext.define('YZSoft.src.designer.doc.Document', {
    extend: 'Ext.Evented',
    requires: [
        'YZSoft.src.designer.runtime.ClassManager'
    ],

    constructor: function (config) {
        var me = this;

        //缺省classManager
        me.classManager = YZSoft.src.designer.runtime.ClassManager;

        me.callParent([config]);
    },

    resolveItems: function (itemids, fn) {
        if (Ext.isFunction(itemids)) {
            fn = itemids;
            itemids = null;
        }

        var me = this,
            classManager = me.classManager,
            components = me.src.define.components,
            itemids = itemids || me.src.define.items,
            items = [];

        Ext.each(itemids, function (itemid) {
            var cfg;

            if (Ext.isObject(itemid)) {
                cfg = itemid;
            }
            else{
                var item = components[itemid],
                    cfg = Ext.clone(item) || {},
                    xclass;

                if (cfg.ctype) {
                    Ext.apply(cfg, {
                        xclass: classManager.getXClass(cfg.ctype, cfg)
                    });
                }

                Ext.apply(cfg, {
                    itemid: itemid
                });

                fn && fn(cfg);
            }

            items.push(cfg);

            if (!Ext.isEmpty(cfg.items))
                cfg.items = me.resolveItems(cfg.items, fn);
        });

        return items;
    }
});