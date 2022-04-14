/*
config:
root
*/
Ext.define('YZSoft.report.admin.Navigator', {
    extend: 'Ext.panel.Panel',
    header: false,
    border: false,
    region: 'west',
    width: 295,
    minWidth: 100,
    maxWidth: 500,
    split: {
        size: 5,
        collapseOnDblClick: false,
        collapsible: true
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.tree = Ext.create('YZSoft.bpm.src.zone.NavigatorTree', {
            storeZoneType: 'Reports',
            securityResType: 'ReportFolder',
            folderPerms: [{
                PermName: 'Read',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Read')
            }, {
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Write')
            }, {
                PermName: 'Execute',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Report_Perm_Execute')
            }],
            root: {
                text: RS.$('All_ReportLib'),
                expanded: false,
                rsid: YZSoft.WellKnownRSID.ReportRoot
            },
            listeners: {
                scope: me,
                selectionchange: 'onSelectionChange'
            }
        });

        me.btnCollapse = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-collapse',
            tooltip: RS.$('All_Collapse'),
            handler: function () {
                me.collapse();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            tooltip: RS.$('All_Refresh'),
            handler: function () {
                me.tree.store.load({
                    loadMask: true
                });
            }
        });

        cfg = {
            collapsible: false,
            layout: 'fit',
            tbar: {
                cls: 'yz-tbar-navigator',
                items: [me.btnCollapse, '->', me.btnRefresh]
            },
            items: [me.tree]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            togglemenu: function () {
            }
        });
    },

    onSelectionChange: function (sm, selected, eOpts) {
        var me = this;

        if (selected.length == 1)
            me.fireEvent('moduleselectionchange', me, selected[0]);
    },

    showModule: function (moduleContainer, created, pnl, rec) {
        var me = this;

        me.moduleContainer = me.tree.moduleContainer = moduleContainer;

        moduleContainer.showModule({
            xclass: 'YZSoft.frame.module.Container',
            config: {
                itemId: me.tree.getCompId(rec),
                items: [{
                    xclass: 'YZSoft.report.admin.Panel',
                    storeZoneType: me.tree.storeZoneType,
                    path: rec.data.path == 'root' ? '' : rec.data.path,
                    record: rec,
                    parentRsid: rec.data.rsid
                }]
            },
            match: function (item) {
                return item.itemId == me.tree.getCompId(rec);
            },
            created: function (pnl) {
                if (created)
                    created(pnl);
            }
        });
    }
});
