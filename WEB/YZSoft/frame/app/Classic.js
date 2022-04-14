/*
应用类
classicNavigatorDefaults
*/
Ext.define('YZSoft.frame.app.Classic', {
    extend: 'YZSoft.frame.app.Abstract',

    constructor: function (config) {
        var me = this,
            cfg;

        me.navigatorPanel = Ext.create((config && config.navigator && config.navigator.xclass) || 'YZSoft.frame.navigator.Classic', Ext.apply({
            region: 'west',
            title: config.title,
            classicNavigatorDefaults: config.classicNavigatorDefaults
        }, config.navigator));

        me.moduleContainer = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            style: 'z-index:0' //navigatorPanel收缩时，流程定义和图形报表部分内容会展现到navigatorPanel前，如：系统管理，业务发起的legend
        });

        cfg = {
            layout: 'border',
            items: [me.navigatorPanel, me.moduleContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.navigatorPanel.on({
            scope: me,
            moduleselectionchange: 'onModuleSelectionChange'
        });
    },

    onModuleSelectionChange: function (pnlNavigator, rec) {
        var me = this,
            xclass,
            cfg;

        if (rec.data.ment) { //维护中的模块
            xclass = 'YZSoft.src.panel.MaintPanel';
            cfg = {
                title: rec.data.text,
                message: rec.data.ment,
                url: rec.data.url
            };
        }
        else if (!rec.data.tabs && !rec.data.xclass) { //建设中的模块
            xclass = 'YZSoft.src.panel.BuildingPanel';
            cfg = {
                title: rec.data.text,
                message: rec.data.building,
                url: rec.data.url
            };
        }
        else {
            xclass = 'YZSoft.frame.module.Container';
            cfg = Ext.apply({
                title: rec.data.text,
                items: me.createFuncPanels(rec),
                tabWrap: rec.data.tabWrap !== false,
                tabConfig: {
                    hideTab: false,
                    activeTab: rec.data.activeTab
                }
            }, rec.data.config)
        }

        rec.pnlFunc = me.moduleContainer.showModule({
            xclass: xclass,
            config: cfg,
            match: function (item) {
                return item === rec.pnlFunc;
            }
        });
    },

    createFuncPanel: function (item) {
        if (item.ment) {
            return Ext.create('YZSoft.src.panel.MaintPanel', {
                title: item.text,
                message: item.ment,
                url: item.url
            });
        }
        else if (!item.xclass) { //建设中的模块
            return Ext.create('YZSoft.src.panel.BuildingPanel', {
                title: item.text,
                message: item.building,
                url: item.url
            });
        }
        else {
            return Ext.apply({
                xclass: item.xclass,
                moduleid: item.id,
                title: item.text,
                moduleName: item.text,
                //glyph: item.glyph,
                closable: false
            }, item.config);
        }
    },

    createFuncPanels: function (rec) {
        var me = this,
            items = [];

        if (rec.data.tabs && rec.data.tabs.length != 0) {
            Ext.each(rec.data.tabs, function (tabDefine) {
                items.push(me.createFuncPanel(tabDefine));
            });
        }
        else {
            items.push(me.createFuncPanel(rec.data));
        }

        return items;
    },

    onToggleMenu: function () {
        var me = this,
            navPanel = me.navigatorPanel;

        if (!navPanel)
            return;

        navPanel.animCollapse = 250;
        navPanel.toggleCollapse();
    },

    goto: function (moduleids, callback, scope) {
        var me = this,
            nodeid = moduleids[0];

        if (nodeid) {
            me.navigatorPanel.setActiveNode(nodeid, function () {
                callback && callback.call(scope || me);
            },null,false);
        }
    }
});