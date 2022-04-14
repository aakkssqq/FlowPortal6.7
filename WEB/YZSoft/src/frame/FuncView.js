
Ext.define('YZSoft.src.frame.FuncView', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.tab.Module'
    ],
    xtype: 'yz-func-panel-cnt',
    region: 'center',
    layout: {
        type: 'card',
        deferredRender: true,
        layoutOnCardChange: true
    },
    border: false,
    items: [],

    constructor: function () {
        var me = this;

        me.callParent(arguments);
        me.addCls('yz-func-view');

        me.on({
            activate: function () {
                var panel = me.getLayout().getActiveItem();
                panel && panel.fireEvent('activate');
            }
        });
    },

    showModule: function (record) {
        var me = this,
            node = record.data;

        var tab = record.tab;
        if (!tab) {
            var rv = me.createFuncPanels(node);

            tab = record.tab = Ext.create('YZSoft.src.tab.Module', {
                enableTabScroll: true,
                activeTab: node.activeTab,
                border: false,
                plain: true,
                items: rv.items,
                hideTab: rv.hideTab,
                firsttimeactive: true,
                caption: node.caption || node.text,
                listeners: {
                    activate: function (to, from, opt) {
                        if (!this.firsttimeactive) {
                            var activeTab = this.getActiveTab()
                            if (activeTab)
                                activeTab.fireEvent('activate', activeTab, from, Ext.apply(opt, { sameModel: true }));
                        }
                        this.firsttimeactive = false;
                    }
                }
            });

            record.on({
                textchanged: function () {
                    this.tab.setTitle(this.data.text);
                }
            });

            //当前active的panel第一次其父tab.Module没有调用到activate
            Ext.each(rv.items, function (item) {
                item.on({
                    activate: function () {
                        if (this.onActivate) {
                            var args = Ext.Array.union(this.activateTime || 0, arguments)
                            this.activateTime = (this.activateTime || 0) + 1;
                            this.onActivate.apply(this, args)
                        }
                    }
                });
            });

            me.add(tab);
        }

        me.getLayout().setActiveItem(tab);
    },

    createFuncPanel: function (item) {
        if (item.ment) //维护中的模块
            return Ext.create('YZSoft.src.panel.MaintPanel', { title: item.text, message: item.ment, url: item.url });
        else if (!item.xclass) //建设中的模块
            return Ext.create('YZSoft.src.panel.BuildingPanel', { title: item.text, message: item.building, url: item.url });
        else { //功能模块
            if (item.id) {
                var cmp = Ext.getCmp(item.id);
                if (cmp && cmp.destroy)
                    cmp.destroy();
            }
            return Ext.create(item.xclass, Ext.apply({ id: item.id, title: item.text, moduleName: item.text, closable: false }, item.config));
        }
    },

    createFuncPanels: function (node) {
        var me = this;

        var rv = { hideTab: true, items: [] };
        if (node.ment) {
            rv.items.push(me.createFuncPanel(node));
        }
        else if (node.tabs && node.tabs.length != 0) {
            rv.hideTab = false;
            Ext.each(node.tabs, function (tabDefine) {
                rv.items.push(me.createFuncPanel(tabDefine));
            });
        }
        else {
            var panel = me.createFuncPanel(node);
            panel.fireEvent('funcPanelCreated', panel, node);
            rv.items.push(panel);
        }

        return rv;
    },

    setActiveTab: function (record, moduleid, callback, scope) {
        var activeCmp = record.tab.setActiveTab(moduleid);
        if (callback) {
            callback.call(scope || this, activeCmp);
        }
    }
});