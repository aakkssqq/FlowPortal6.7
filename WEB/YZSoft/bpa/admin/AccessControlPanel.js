
Ext.define('YZSoft.bpa.admin.AccessControlPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            root: {
                text: RS.$('BPA_AdminPortal'),
                expanded: true,
                rsid: YZSoft.WellKnownRSID.BPASiteRoot,
                perms: [{
                    PermName: 'Execute',
                    PermDisplayName: RS.$('All_Perm_Access')
                }],
                children: [
                    { text: RS.$('BPA_ProcessLib'), expandable: false, expanded: true,
                        rsid: YZSoft.WellKnownRSID.BPALibraryRoot,
                        perms: [{
                            PermName: 'Execute',
                            PermDisplayName: RS.$('All_Perm_Access')
                        }, {
                            PermName: 'Write',
                            PermDisplayName: RS.$('BPA_AddLib')
                        }]
                    },
                    { text: RS.$('BPA_DocumentLib'), expandable: false, expanded: true,
                        rsid: YZSoft.WellKnownRSID.BPADocumentRoot,
                        perms: [{
                            PermName: 'Execute',
                            PermDisplayName: RS.$('All_Perm_Access')
                        }, {
                            PermName: 'Write',
                            PermDisplayName: RS.$('BPA_AddLib')
                        }]
                    },
                    { text: RS.$('BPA_Group'), expandable: false, expanded: true,
                        rsid: YZSoft.WellKnownRSID.BPAGroupRoot,
                        perms: [{
                            PermName: 'Execute',
                            PermDisplayName: RS.$('All_Perm_Access')
                        }, {
                            PermName: 'Write',
                            PermDisplayName: RS.$('BPA_AddGroup')
                        }]
                    },
                    { text: RS.$('BPA_SystemAdmin'), expandable: true, expanded: true,
                        rsid: YZSoft.WellKnownRSID.BPAAdminRoot,
                        perms: [{
                            PermName: 'Execute',
                            PermDisplayName: RS.$('All_Perm_Access')
                        }],
                        children: [
                            { text: RS.$('BPA_TemplateAdmin'), expandable: false, expanded: true,
                                rsid: YZSoft.WellKnownRSID.BPAAdminTemplates,
                                perms: [{
                                    PermName: 'Execute',
                                    PermDisplayName: RS.$('BPA_PermName_Admin')
                                }]
                            },
                            { text: RS.$('BPA_GroupAdmin'), expandable: false, expanded: true,
                                rsid: YZSoft.WellKnownRSID.BPAAdminGroup,
                                perms: [{
                                    PermName: 'Execute',
                                    PermDisplayName: RS.$('BPA_PermName_Admin')
                                }]
                            },
                            { text: RS.$('BPA_PermAdmin'), expandable: false, expanded: true,
                                rsid: YZSoft.WellKnownRSID.BPAAdminSecurity,
                                perms: [{
                                    PermName: 'Execute',
                                    PermDisplayName: RS.$('BPA_PermName_Admin')
                                }]
                            }
                        ]
                    },
                    { text: RS.$('All_Help'), expandable: false, expanded: true,
                        rsid: YZSoft.WellKnownRSID.BPAHelp,
                        perms: [{
                            PermName: 'Execute',
                            PermDisplayName: RS.$('All_Perm_Access')
                        }]
                    },
                    { text: RS.$('All_RecycleBin'), expandable: false, expanded: true,
                        rsid: YZSoft.WellKnownRSID.BPARecycleBin,
                        perms: [{
                            PermName: 'Execute',
                            PermDisplayName: RS.$('BPA_PermName_Execute')
                        }]
                    }
                ]
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            cls: 'yz-tree-modules',
            border: false,
            store: me.store,
            rootVisible: true,
            useArrows: true,
            hideHeaders: true,
            cls: 'bpa-tree-perm',
            listeners: {
                scope: me,
                selectionchange: function (sm, selected, eOpts) {
                    var rec = selected[0];

                    if (rec) {
                        me.pnlSecurity.pnlSecurity.objectColumnText = rec.data.text;
                        me.pnlSecurity.pnlSecurity.setConfig({
                            rsid: rec.data.rsid,
                            perms: rec.data.perms
                        });
                    }
                }
            }
        });

        me.tree.on({
            single: true,
            afterrender: function (tree, eOpts) {
                var root = this.getRootNode(),
                    sm = this.getSelectionModel();

                sm.select(root);
            }
        });

        me.pnlMenu = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_Navigate'),
            border: false,
            header: false,
            width: 240,
            region: 'west',
            layout: 'fit',
            split: {
                cls: 'yz-splitter-light',
                size: 4,
                collapsible: true
            },
            style: 'background-color:#fff;',
            items: [me.tree],
            listeners: {
                element: 'body',
                contextmenu: function (e, t, eOpts) {
                    e.preventDefault();
                }
            }
        });

        me.pnlSecurity = Ext.create('YZSoft.bpa.admin.security.Panel', {
            padding: '10 40 30 40'
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer',
            items: [me.pnlSecurity]
        });

        cfg = {
            layout: 'border',
            items: [me.pnlMenu, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});