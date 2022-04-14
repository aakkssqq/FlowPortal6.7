/*
tabWrap
模块的最外层容器，结构为：模块容器、tab、tab中的功能模块，
具体模块如：草稿箱、待办加载在tab中，tab加载在此容器中
*/
Ext.define('YZSoft.frame.module.Container', {
    extend: 'YZSoft.src.container.ModuleContainer',
    cls: ['yz-s-module-cnt'],
    layout: {
        type: 'card',
        deferredRender: true,
        layoutOnCardChange: true
    },
    border: false,

    constructor: function (config) {
        var me = this,
            items = config.items,
            cfg;

        if (config.tabWrap === true) {
            delete config.items;

            Ext.each(items, function (item) {
                Ext.apply(item, {
                    closable:false
                });
            });

            me.tab = Ext.create('YZSoft.frame.tab.Module', Ext.apply({
                activeTab: config.activeTab,
                items: items,
                hideTab: false,
                caption: config.text
            }, config.tabConfig));

            cfg = {
                items: [me.tab]
            };
        }
        else {
            cfg = {
            };
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('yz-module-cnt');
    }
});