/*
config:
root
*/
Ext.define('YZSoft.bpm.process.admin.Navigator', {
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
            storeZoneType: 'Process',
            securityResType: 'ProcessFolder',
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
                PermDisplayName: RS.$('All_Process_Perm_Execute')
            }, {
                PermName: 'TaskRead',
                PermType: 'Record',
                PermDisplayName: RS.$('All_Process_Perm_TaskRead')
            }, {
                PermName: 'TaskAdmin',
                PermType: 'Record',
                PermDisplayName: RS.$('All_Process_Perm_TaskAdmin')
            }],
            root: {
                text: RS.$('All_ProcessLib'),
                expanded: false,
                rsid: YZSoft.WellKnownRSID.ProcessRoot
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
    },

    onSelectionChange: function (sm, selected, eOpts) {
        var me = this;

        if (selected.length == 1)
            me.fireEvent('moduleselectionchange', me, selected[0]);
    }
});
