/*
config
*/
Ext.define('YZSoft.esb.admin.DSFlowPanel', {
    extend: 'YZSoft.src.library.zone.Panel',
    requires: [
        'YZSoft.esb.model.DSFlow'
    ],
    serviceUrl: YZSoft.$url('YZSoft.Services.REST/ESB/DSFlow/Admin.ashx'),
    folderSecurityResType: 'ESBDSFlowFolder',
    rootRSID: YZSoft.WellKnownRSID.ESBDSFlowRoot,
    storeZoneType: 'ESBDSFlow',
    viewType: 'icon',
    addNewObjectText: RS.$('ESB_DSFlow_AddNew'),
    folderPerms: [{
        PermName: 'Read',
        PermType: 'Module',
        PermDisplayName: RS.$('All_Perm_Read')
    }, {
        PermName: 'Write',
        PermType: 'Module',
        PermDisplayName: RS.$('All_Perm_Write')
    }],
    viewMoveObjectsConfig: {
        dlgConfig: {
            cancopy: false
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.viewStore = me.createViewStore({
            model: 'YZSoft.esb.model.DSFlow'
        });

        me.treeStore = me.createTreeStore({
            root: {
                text: RS.$('ESB_DSFlowRoot'),
                expanded: false,
                rsid: me.rootRSID
            }
        });

        me.tree = me.createTree({
        });

        me.btnCollapseTree = me.createCollapseTreeButton();
        me.btnRefreshTree = me.createRefreshTreeButton();

        me.treePanel = me.createTreePanel({
            tbar: {
                items: [me.btnCollapseTree, '->', me.btnRefreshTree]
            },
            items:[me.tree]
        });

        me.view = me.createView();
        me.crumb = me.createCrumb();

        me.navBar = Ext.create('Ext.container.Container', {
            region: 'north',
            margin: '3 20 3 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [me.crumb, { xtype: 'tbfill' }]
        });

        me.btnNew = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e61d',
            text: RS.$('All_Add'),
            disabled: true,
            handler: function (item) {
                me.addNew();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Edit'),
            sm: me.view,
            updateStatus: function () {
                this.setDisabled(me.hasFolderSelected() || !me.IsOptEnable('Write', null, 1, 1));
            },
            handler: function () {
                var recs = me.view.getActiveView().getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.edit(recs[0]);
                }
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            sm: me.view,
            updateStatus: function () {
                this.setDisabled(me.hasFolderSelected() || !me.IsOptEnable('Write', null, 1, -1));
            },
            handler: function () {
                me.viewDeleteSelection();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.viewRefresh()
            }
        });

        me.btnCollapse = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-eb30',
            handler: function () {
                me.toggleTree();
            }
        });

        me.btnDetailView = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-eaa5',
            handler: function () {
                me.view.setViewType('detail');
            }
        });

        me.btnIconView = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-eb31',
            handler: function () {
                me.view.setViewType('icon');
            }
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls: 'yz-tbar-module',
                items: [me.btnNew, me.btnEdit, me.btnDelete, '|', me.btnRefresh, '->', me.btnCollapse, me.btnDetailView, me.btnIconView]
            },
            items: [me.treePanel, me.navBar, me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createDetailView: function (config) {
        var me = this;

        return Ext.create('YZSoft.src.library.base.DetailView', Ext.apply({
            columns: {
                defaults: {
                },
                items: [
                    { xtype: 'rownumberer' },
                    { text: RS.$('All_Name'), dataIndex: 'Name', width: 200, editor: { xtype: 'textfield' }, formatter: 'text', folder:true },
                    { text: RS.$('All_Type'), dataIndex: 'Type', flex: 1, scope: me, renderer: me.renderType }
                ]
            }
        }, config));
    },

    createIconView: function (config) {
        var me = this;

        return Ext.create('YZSoft.src.library.zone.IconView', Ext.apply({
        }, config));
    },

    renderType: function (value, metaData, record) {
        return value;
        return RS.$('Connection_Type_' + value);
    },

    onViewBeforeOpenFolder: function () {
        var me = this;

        me.callParent(arguments);
        me.btnNew.setDisabled(true);
    },

    onViewAfterCheckFolderPermision: function (perm) {
        this.btnNew.setDisabled(!perm.Write);
    },

    addNew: function () {
        var me = this,
            panel;

        panel = Ext.create('YZSoft.esb.designer.DSFlowDesigner', {
            designMode: 'new',
            folder: me.view.folderId,
            listeners: {
                close: function () {
                    YZSoft.frame.getLayout().prev();
                },
                saved: function (mode, name, result) {
                    me.viewStore.reload({
                        loadMask: false,
                        callback: function (records, operation, success) {
                            if (success) {
                                var record = me.viewStore.getById(name)
                                record && me.view.getActiveView().getSelectionModel().select(record);
                            }
                        }
                    });
                }
            }
        });

        YZSoft.frame.add(panel);
        YZSoft.frame.setActiveItem(panel);
    },

    edit: function (rec) {
        var me = this,
            panel;

        panel = Ext.create('YZSoft.esb.designer.DSFlowDesigner', {
            designMode: 'edit',
           // readOnly: !rec.data.perm.Write,
            folder: me.view.folderId,
            flowName: rec.getId(),
            listeners: {
                close: function () {
                    YZSoft.frame.getLayout().prev();
                },
                reportsaved: function () {
                    me.viewStore.reload({
                        loadMask: false
                    });
                }
            }
        });

        YZSoft.frame.add(panel);
        YZSoft.frame.setActiveItem(panel);
    }
});
