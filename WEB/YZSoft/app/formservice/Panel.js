/*
config
path
parentRsid
storeZoneType
*/
Ext.define('YZSoft.app.formservice.Panel', {
    extend: 'YZSoft.bpm.src.zone.Panel',
    requires: [
        'YZSoft.bpm.src.model.FormServiceInfo'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.FormServiceInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/FormService.ashx'),
                extraParams: {
                    method: 'GetAppsInFolder',
                    path: config.path
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.cellEditing = me.createCellEditing({
        });

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
                    sortable: true
                },
                items: [
                    { xtype: 'rownumberer' },
                    { text: RS.$('FormService_Column_Name'), dataIndex: 'Name', width: 260, formatter: 'text', editor: { xtype: 'textfield'} },
                    { text: RS.$('FormService_Column_States'), dataIndex: 'States', width: 180, renderer: me.renderStates,sortable:false },
                    { text: RS.$('FormService_Column_FormFile'), dataIndex: 'FormFile', flex: 1, formatter: 'text' }
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
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('FormService_NewApp'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.addNew();
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-edit',
                            text: RS.$('FormService_EditApp'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.edit(record);
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-clone',
                            text: RS.$('All_Clone'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.cloneSelection(grid);
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-e60e',
                            text: RS.$('All_MoveStoreObjects'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.moveObjects({
                                    grid: grid
                                });
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid);
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-rename',
                            text: RS.$('All_Rename'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, 1),
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
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('FormService_NewApp'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.addNew();
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection();
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
            iconCls: 'yz-glyph yz-glyph-new',
            text: RS.$('All_New'),
            disabled: true,
            handler: function () {
                me.addNew();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Design'),
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
            perm: 'Write',
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, this.perm, 1, -1));
            },
            handler: function () {
                me.deleteSelection();
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('FormServiceList{0}.xls', RS.$('All_LangPostfix'))),
            params: {
                Folder: config.title
            },
            fileName: Ext.String.format('{0}[{1}]', RS.$('All_FormServicesList'), config.title),
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

        me.sts = Ext.create('YZSoft.src.sts', {
            items: [me.btnEdit, me.btnDelete],
            store: me.store,
            sm: me.grid.getSelectionModel(),
            async: false,
            request: {
                params: {
                    method: 'GetStoreObjectPerms',
                    path: config.path,
                    zone: config.storeZoneType
                }
            }
        });

        cfg = {
            layout: 'fit',
            tbar: {
                cls:'yz-tbar-module',
                items: [
                    me.btnNew,
                    me.btnEdit,
                    me.btnDelete,
                    '|',
                    me.btnExcelExport,
                    me.btnRefresh,
                    '->',
                    RS.$('All_PageFilter'),
                    me.edtFilter
                ]
            },
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.record) {
            config.record.on({
                pathchanged: function (path) {
                    me.path = path;
                    me.store.getProxy().getExtraParams().path = path;
                    me.sts.request.params.path = path;
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

    renderStates: function (value, metaData, record) {
        if (value.length == 0)
            return 'Read';

        var rv = [];
        Ext.each(value, function (state) {
            rv.push(Ext.util.Format.text(state.Name));
        });

        return rv.join(',');
    },

    addNew: function () {
        var me = this;

        Ext.create('YZSoft.app.formservice.Dialog', {
            title: RS.$('FormService_Property_New'),
            autoShow: true,
            folder: me.path,
            parentRsid: me.parentRsid,
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
        var me = this,
            name = rec.data.Name;

        Ext.create('YZSoft.app.formservice.Dialog', {
            title: Ext.String.format('{0} - {1}', RS.$('All_FormApplication'), name),
            readOnly: !rec.data.perm.Write,
            path: me.getRecordFullName(me.path, rec.data.Name),
            rsid: me.getRecordRsid(me.storeZoneType, me.path, rec.data.Name),
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
