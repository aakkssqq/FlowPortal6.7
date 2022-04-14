/*
config
path
storeZoneType
parentRsid
*/
Ext.define('YZSoft.extserver.Panel', {
    extend: 'YZSoft.bpm.src.zone.Panel',
    requires: [
        'YZSoft.bpm.src.model.ExtServer'
    ],

    constructor: function (config) {
        var me = this,
            addServerItems,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.ExtServer',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/ExtServer.ashx'),
                extraParams: {
                    method: 'GetServersInFolder',
                    perm: 'Read',
                    path: config.path
                }
            }
        });

        me.cellEditing = me.createCellEditing({
        });

        addServerItems = [{
            iconCls: 'yz-glyph yz-glyph-e622',
            text: RS.$('ExtServer_Type_BPMServer'),
            handler: function (item) {
                me.addNewBPMServer();
            }
        }, {
            iconCls: 'yz-glyph yz-glyph-e620',
            text: RS.$('ExtServer_Type_FTPServer'),
            handler: function (item) {
                me.addNewFTPServer();
            }
        }, {
            iconCls: 'yz-glyph yz-glyph-e623',
            text: RS.$('ExtServer_Type_DataSourceServer'),
            handler: function (item) {
                me.addNewDataSourceServer();
            }
        }];

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            plugins: [me.cellEditing],
            selModel: {
                mode: 'MULTI'
            },
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                },
                items: [
                    { xtype: 'rownumberer' },
                    { text: RS.$('All_Name'), dataIndex: 'Name', width: 200, editor: { xtype: 'textfield' }, formatter: 'text' },
                    { text: RS.$('All_Type'), dataIndex: 'ServerType', flex: 1, scope: me, renderer: me.renderType }
                ]
            },
            listeners: {
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    me.edit(record);
                },
                itemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();


                    var grid = view.grid;
                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-e61d',
                            text: RS.$('All_Add'),
                            disabled: !me.perm.Write,
                            menu: {
                                items: addServerItems
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-edit',
                            text: RS.$('All_Edit'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, '', 1, 1),
                            handler: function () {
                                me.edit(record);
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-clone',
                            text: RS.$('All_Clone'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.cloneSelection(grid, 'Name');
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-e60e',
                            text: RS.$('All_MoveStoreObjects'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.moveObjects({
                                    grid: grid,
                                    nameField: 'Name',
                                    dlgConfig: {
                                        cancopy: false
                                    }
                                });
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid, 'Name');
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-rename',
                            text: RS.$('All_Rename'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, 1),
                            handler: function () {
                                me.cellEditing.startEdit(record, 1);
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-refresh',
                            text: RS.$('All_Refresh'),
                            handler: function () {
                                grid.getStore().reload({
                                    loadMask: true
                                });
                            }
                        }]
                    });
                    menu.showAt(e.getXY());
                    menu.focus();
                },
                containercontextmenu: function (view, e, eOpts) {
                    e.stopEvent();

                    var grid = view.grid;
                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-e61d',
                            text: RS.$('All_Add'),
                            disabled: !me.perm.Write,
                            menu: {
                                items: addServerItems
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(me.grid, 'Name');
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-refresh',
                            text: RS.$('All_Refresh'),
                            handler: function () {
                                grid.getStore().reload({
                                    loadMask: true
                                });
                            }
                        }]
                    });

                    menu.showAt(e.getXY());
                    menu.focus();
                }
            }
        });

        me.btnNew = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e61d',
            text: RS.$('All_Add'),
            disabled: true,
            menu: {
                items: addServerItems
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Edit'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.edit(recs[0]);
                }
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(me, me.grid, 'Write', 1, -1));
            },
            handler: function () {
                me.deleteSelection(me.grid, 'Name');
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('ExtServer{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            fileName: RS.$('All_ExtServer'),
            radioDisabled: true,
            defaultRadio: 'all',
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date()
                }
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.store.reload({
                    loadMask: true
                });
            }
        });

        me.edtFilter = Ext.create('YZSoft.src.form.field.LiveSearch', {
            grid: me.grid
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls:'yz-tbar-module',
                items: [me.btnNew, me.btnEdit, me.btnDelete, '|', me.btnExcelExport, me.btnRefresh, '->', RS.$('All_PageFilter'), me.edtFilter]
            },
            items: [me.grid, me.gridGroupUsers]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.record) {
            config.record.on({
                pathchanged: function (path) {
                    me.path = path;
                    me.store.getProxy().getExtraParams().path = path;
                }
            });
        }
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: me.parentRsid,
                perms: 'Write'
            },
            success: function (action) {
                var perm = me.perm = action.result;
                me.btnNew.setDisabled(!perm.Write);
            }
        });
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    renderType: function (value, metaData, record) {
        return RS.$('ExtServer_Type_' + value);
    },

    addNewBPMServer: function () {
        var me = this;

        Ext.create('YZSoft.extserver.BPMServerDlg', {
            autoShow: true,
            path: me.path,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    addNewDataSourceServer: function () {
        var me = this;

        Ext.create('YZSoft.extserver.DataSourceServerDlg', {
            autoShow: true,
            path: me.path,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    addNewFTPServer: function () {
        var me = this;

        Ext.create('YZSoft.extserver.FTPServerDlg', {
            autoShow: true,
            path: me.path,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    edit: function (rec) {
        var me = this;

        switch (rec.data.ServerType) {
            case 'BPMServer':
                me.editBPMServer(rec);
                break;
            case 'FTPServer':
                me.editFTPServer(rec);
                break;
            case 'DataSourceServer':
                me.editDataSourceServer(rec);
                break;
        }
    },

    editBPMServer: function (rec) {
        var me = this;

        Ext.create('YZSoft.extserver.BPMServerDlg', {
            path: me.path,
            serverName: rec.data.Name,
            title: Ext.String.format('{0} - {1}',RS.$('ExtServer_Type_BPMServer'),rec.data.Name),
            readOnly: !me.perm.Write,
            autoShow: true,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    editDataSourceServer: function (rec) {
        var me = this;

        Ext.create('YZSoft.extserver.DataSourceServerDlg', {
            path: me.path,
            serverName: rec.data.Name,
            title: Ext.String.format('{0} - {1}', RS.$('ExtServer_Type_DataSourceServer'), rec.data.Name),
            readOnly: !me.perm.Write,
            autoShow: true,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    editFTPServer: function (rec) {
        var me = this;

        Ext.create('YZSoft.extserver.FTPServerDlg', {
            path: me.path,
            serverName: rec.data.Name,
            title: Ext.String.format('{0} - {1}', RS.$('ExtServer_Type_FTPServer'), rec.data.Name),
            readOnly: !me.perm.Write,
            autoShow: true,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    }
});
