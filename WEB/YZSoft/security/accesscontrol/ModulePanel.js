
Ext.define('YZSoft.security.accesscontrol.ModulePanel', {
    extend: 'YZSoft.frame.app.Abstract',
    getCompId: function (rec) {
        return Ext.String.format('AccessControlList_{0}', YZSoft.util.hex.encode(rec.data.path));
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.navigatorPanel = Ext.create('YZSoft.security.accesscontrol.Navigator', Ext.apply({
            region: 'west',
            title: config.title,
            editable: config.editable
        }, config.navigator));

        me.moduleContainer = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center'
        });

        cfg = {
            layout: 'border',
            items: [me.navigatorPanel, me.moduleContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.navigatorPanel.on({
            scope: me,
            moduleselectionchange: 'onModuleSelectionChange',
            afterdeleterecord: 'onAfterDeleteRecord'
        });

        me.on({
            scope: me,
            togglemenu: function () {
                me.navigatorPanel.toggleCollapse();
            }
        });
    },

    onModuleSelectionChange: function (pnlNavigator, rec) {
        var me = this;

        me.moduleContainer.showModule({
            xclass: 'YZSoft.frame.module.Container',
            config: {
                itemId: me.getCompId(rec),
                items: [{
                    xclass: 'YZSoft.security.accesscontrol.Panel',
                    rsid: rec.isRoot() ? '' : rec.data.path,
                    record: rec,
                    editable: me.editable,
                    listeners: {
                        editclicked: function () {
                            pnlNavigator.onEditClicked(rec);
                        },
                        addchildrenclicked: function () {
                            pnlNavigator.onAddChildrenClicked(rec);
                        },
                        assignpermclicked: function () {
                            pnlNavigator.onAssignPermClicked(rec);
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
