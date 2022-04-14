
Ext.define('YZSoft.bpm.org.admin.ModulePanel', {
    extend: 'YZSoft.frame.app.Abstract',
    getCompId: function (rec) {
        return Ext.String.format('OUAdmin_{0}', YZSoft.util.hex.encode(rec.data.path));
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.navigatorPanel = Ext.create('YZSoft.bpm.org.admin.Navigator', Ext.apply({
            region: 'west',
            title: config.title
        }, config.navigator));

        me.moduleContainer = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center'
        });

        me.searchResultPanel = Ext.create('YZSoft.bpm.org.admin.SearchResultPanel', {
            region: 'south',
            height: '33%',
            ui: 'light',
            header: {
                cls: 'yz-header-submodule'
            },
            split: {
                cls: 'yz-spliter',
                size: 5,
                collapseOnDblClick: false,
                collapsible: true
            },
            border: false,
            hidden: true,
            isWritable: function () {
                var pnl = me.moduleContainer.getActiveItem().getActiveItem();
                return pnl && pnl.perm && pnl.perm.Write;
            }
        })

        cfg = {
            layout:'border',
            items: [me.navigatorPanel, {
                xtype: 'container',
                region: 'center',
                layout: 'border',
                items: [
                    me.moduleContainer,
                    me.searchResultPanel
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.navigatorPanel.on({
            scope: me,
            moduleselectionchange: 'onModuleSelectionChange',
            afterdeleterecord: 'onAfterDeleteRecord'
        });

        me.navigatorPanel.relayEvents(me.searchResultPanel, ['gotoclick']);
    },

    onModuleSelectionChange: function (pnlNavigator, rec) {
        var me = this;

        me.moduleContainer.showModule({
            xclass: 'YZSoft.frame.module.Container',
            config: {
                itemId: me.getCompId(rec),
                items: [{
                    xclass: 'YZSoft.bpm.org.admin.Panel',
                    path: rec.data.path == 'root' ? '' : rec.data.path,
                    record: rec,
                    parentRsid: rec.data.rsid,
                    listeners: {
                        searchclick: function () {
                            me.searchResultPanel.fireEventArgs('searchclick', arguments);
                        },
                        clearclick: function () {
                            me.searchResultPanel.fireEventArgs('clearclick', arguments);
                        }
                    }
                }]
            },
            match: function (item) {
                return item.itemId == me.getCompId(rec);
            }
        });
    },

    onAfterDeleteRecord: function (rec) {
        var me = this,
            cmpid = me.getCompId(rec),
            cmp = me.moduleContainer.getComponent(cmpid);

        if (cmp)
            cmp.destroy();
    }
});
