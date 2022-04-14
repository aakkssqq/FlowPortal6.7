
Ext.define('YZSoft.src.frame.win10.MainTab', {
    extend: 'YZSoft.src.tab.Panel',
    border: false,
    deferredRender: true,
    hideTab: true,

    constructor: function (config) {
        var me = this,
            modules = config.modules,
            items = [], item, cfg;

        Ext.each(modules, function (module) {
            if (module.ment) //维护中的模块
                item = Ext.create('YZSoft.src.panel.MaintPanel', { title: module.title, message: module.ment, url: module.url });
            else
                item = Ext.create(module.xclass || 'YZSoft.src.frame.ClassicModule', module);

            items.push(item);
        });

        cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});