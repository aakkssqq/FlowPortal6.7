/*
config
*/
Ext.define('YZSoft.connection.admin.Panel', {
    extend: 'YZSoft.src.library.zone.Panel',
    requires: [
        'YZSoft.connection.model.ConnectionInfo'
    ],
    serviceUrl: YZSoft.$url('YZSoft.Services.REST/Connections/Admin.ashx'),
    folderSecurityResType: 'ConnectionFolder',
    rootRSID: YZSoft.WellKnownRSID.ConnectionsRoot,
    storeZoneType: 'Connections',
    viewType: 'icon',
    addNewObjectText: RS.$('Connection_CreateNewConnection'),
    folderPerms: [{
        PermName: 'Read',
        PermType: 'Module',
        PermDisplayName: RS.$('All_Perm_Read')
    }, {
        PermName: 'Write',
        PermType: 'Module',
        PermDisplayName: RS.$('All_Perm_Write')
    }],
    newObjectMenu: {
        plain: true
    },
    viewMoveObjectsConfig: {
        dlgConfig: {
            cancopy: false
        }
    },

    connectionTypes: {
        WebService: {
            text: RS.$('Connection_Type_WebService')
        }, 
        RESTful: {
            text: RS.$('Connection_Type_RESTful')
        },
        SAP: {
            text: RS.$('Connection_Type_SAP')
        },
        U8OpenAPI: {
            text: RS.$('Connection_Type_U8OpenAPI')
        },
        U8EAI: {
            text: RS.$('Connection_Type_U8EAI')
        },
        K3WISE: {
            text: RS.$('Connection_Type_K3WISE')
        },
        KingdeeEAS: {
            text: RS.$('Connection_Type_KingdeeEAS')
        },
        Aliyun: {
            text: RS.$('Connection_Type_Aliyun')
        },
        DingTalk: {
            text: RS.$('Connection_Type_DingTalk')
        },
        WeChatWork: {
            text: RS.$('Connection_Type_WeChatWork')
        },
        SMTP: {
            text: RS.$('Connection_Type_SMTP')
        },
        SQLServer: {
            text: RS.$('Connection_Type_SQLServer')
        },
        Oracle: {
            text: RS.$('Connection_Type_Oracle')
        },
        MySQL: {
            text: RS.$('Connection_Type_MySQL')
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.viewStore = me.createViewStore({
            model: 'YZSoft.connection.model.ConnectionInfo'
        });

        me.treeStore = me.createTreeStore({
            root: {
                text: RS.$('Connection_Root'),
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
            menu: {
                plain: true,
                items: me.getObjectContextMenuNewMenuItems()
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

    getObjectContextMenuNewMenuItems: function () {
        var me = this,
            addServerItems = [];

        Ext.Object.each(me.connectionTypes, function (type, itemConfig) {
            addServerItems.push(Ext.apply({
                text: type,
                padding: '2 12',
                handler: function (item) {
                    me.addNewConnection(type);
                }
            }, itemConfig));
        });

        return addServerItems;
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

    addNewConnection: function (cnType) {
        var me = this,
            dlgXClass = Ext.String.format('YZSoft.connection.connections.{0}.Dlg', cnType);

        Ext.create(dlgXClass, {
            autoShow: true,
            folder: me.view.folderId,
            fn: function (data) {
                me.viewStore.reload({
                    loadMask: false,
                    callback: function (records, operation, success) {
                        if (success) {
                            var record = me.viewStore.getById(data.Name)
                            record && me.view.getActiveView().getSelectionModel().select(record);
                        }
                    }
                });
            }
        });
    },

    edit: function (rec) {
        var me = this,
            dlgXClass = Ext.String.format('YZSoft.connection.connections.{0}.Dlg', rec.data.Type);

        Ext.create(dlgXClass, {
            autoShow: true,
            folder: me.view.folderId,
            objectName: rec.getId(),
            title: Ext.String.format(RS.$('Connection_PropertyDlg_Title'), rec.data.Type, rec.getId()),
            //readOnly: !me.perm.Write,
            fn: function (data) {
                me.viewStore.reload({
                    loadMask: false,
                    callback: function (records, operation, success) {
                        if (success) {
                            var record = me.viewStore.getById(data.Name)
                            record && me.view.getActiveView().getSelectionModel().select(record);
                        }
                    }
                });
            }
        });
    }
});
