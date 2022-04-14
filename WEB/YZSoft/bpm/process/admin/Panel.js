/*
config
path
storeZoneType
parentRsid
*/
Ext.define('YZSoft.bpm.process.admin.Panel', {
    extend: 'YZSoft.bpm.src.zone.Panel',
    requires: [
        'YZSoft.bpm.src.model.ProcessInfo',
        'YZSoft.bpm.src.model.ProcessVersion'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.ProcessInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetProcessesInFolder',
                    perm: 'Read',
                    path: config.path
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.cellEditing = me.createCellEditing({
            versionField: 'ProcessVersion'
        });

        me.dd = Ext.create('Ext.grid.plugin.DragDrop', {
            dragZone: {
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.ProcessName;
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            cls: 'yz-border-t',
            store: me.store,
            region: 'center',
            selModel: {
                mode: 'MULTI'
            },
            plugins: [me.cellEditing],
            viewConfig: {
                markDirty: false,
                plugins: [me.dd]
            },
            columns: {
                defaults: {
                    sortable: false,
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { xtype: 'rownumberer', renderer: null },
                    { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlag.bind(me) },
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 200, editor: { xtype: 'textfield'} },
                    { text: RS.$('All_Status'), dataIndex: 'Active', width: 80, align: 'center', renderer: me.renderStatus },
                    { text: RS.$('All_Version'), dataIndex: 'ProcessVersion', width: 120, align: 'center' },
                    { text: RS.$('All_Desc'), dataIndex: 'Description', flex: 1 },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_DragOrder'),
                        width: 68,
                        align: 'center',
                        sortable: false,
                        draggable: false,
                        menuDisabled: true,
                        items: [{
                            glyph: 0xeacb,
                            iconCls: ['yz-action-move yz-action-gray yz-size-icon-13']
                        }]
                    }
                ]
            },
            listeners: {
                scope: me,
                selectionchange: 'onSelectionChanged',
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    me.design(record, view.grid);
                },
                itemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();

                    var grid = view.grid;
                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('Process_NewProcess'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.newProcess();
                            }
                        }, {
                            text: RS.$('Process_DesignProcess'),
                            glyph:0xeb2d,
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.design(record, grid);
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-clone',
                            text: RS.$('All_Clone'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.cloneSelection(grid, 'ProcessName', 'ProcessVersion', function () {
                                    me.storeVersions.reload({
                                        loadMask: false
                                    });
                                });
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-e60e',
                            text: RS.$('All_MoveStoreObjects'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.moveObjects({
                                    grid: grid,
                                    nameField: 'ProcessName',
                                    dlgConfig: {
                                        cancopy:false
                                    },
                                    callback: function () {
                                        me.onSelectionChanged();
                                    }
                                });
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid, 'ProcessName', 'ProcessVersion', function () {
                                    me.storeVersions.reload({
                                        loadMask: false
                                    });
                                });
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-rename',
                            text: RS.$('All_Rename'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, 1),
                            handler: function () {
                                me.cellEditing.startEdit(record, 2);
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-refresh',
                            text: RS.$('All_Refresh'),
                            handler: function () {
                                grid.getStore().reload({
                                    loadMask: true
                                });
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-property',
                            text: RS.$('All_Property'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.showProperty(record);
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
                            text: RS.$('Process_NewProcess'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.newProcess();
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid, 'ProcessName', 'ProcessVersion', function () {
                                    me.storeVersions.reload({
                                        loadMask: false
                                    });
                                });
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

        me.storeVersions = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.ProcessVersion',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/ProcessAdmin.ashx'),
                extraParams: {
                    method: 'GetProcessVersions'
                }
            }
        });

        me.gridVersions = Ext.create('Ext.grid.Panel', {
            title: RS.$('All_HistoryVersion'),
            store: me.storeVersions,
            region: 'south',
            ui:'light',
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
            height: 200,
            minHeight: 100,
            emptyText: RS.$('Process_HistoryVersion_EmptyText'),
            columns: {
                defaults: {
                    sortable: true
                },
                items: [
                    { xtype: 'rownumberer' },
                    { text: RS.$('All_ProcessName'), dataIndex: 'ProcessName', width: 200, formatter: 'text' },
                    { text: RS.$('All_Status'), dataIndex: 'Active', width: 80, align: 'center', renderer: me.renderStatus },
                    { text: RS.$('All_Version'), dataIndex: 'ProcessVersion', width: 120, align: 'center' },
                    { text: RS.$('All_Desc'), dataIndex: 'Description', flex: 1, formatter: 'text' }
                ]
            },
            listeners: {
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    me.design(record, view.grid);
                },
                itemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();

                    var grid = view.grid;
                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            text: RS.$('Process_DesignProcess'),
                            glyph: 0xeb2d,
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.design(record, grid);
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(grid.parentRecord.data, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid, 'ProcessName', 'ProcessVersion');
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-refresh',
                            text: RS.$('All_Refresh'),
                            handler: function () {
                                grid.getStore().reload({
                                    loadMask: true
                                });
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-property',
                            text: RS.$('All_Property'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.showProperty(record, grid);
                            }
                        }]
                    });

                    menu.showAt(e.getXY());
                    menu.focus();
                },
                containercontextmenu: function (view, e, eOpts) {
                    e.stopEvent();

                    var grid = view.grid,
                        menu;

                    if (!grid.parentRecord)
                        return;

                    menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(grid.parentRecord.data, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid, 'ProcessName', 'ProcessVersion');
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
            handler: function (item) {
                me.newProcess();
            }
        });

        me.btnDesign = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Design'),
            glyph: 0xeb2d,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.design(recs[0], me.grid);
            }
        });

        me.btnProperty = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-property',
            text: RS.$('All_Property'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.showProperty(recs[0]);
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
                me.deleteSelection(me.grid, 'ProcessName', 'ProcessVersion', function () {
                    me.storeVersions.reload({
                        loadMask: false
                    });
                });
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('ProcessList{0}.xls', RS.$('All_LangPostfix'))),
            params: {
                Folder: config.title
            },
            fileName: Ext.String.format('{0}[{1}]', RS.$('All_ProcessList'), config.title),
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
            items: [me.btnDesign, me.btnDelete],
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
            layout: 'border',
            tbar: {
                cls:'yz-tbar-module',
                items: [me.btnNew, me.btnDesign, me.btnProperty, '|', me.btnDelete, '|', me.btnExcelExport, me.btnRefresh, '->', RS.$('All_PageFilter'), me.edtFilter]
            },
            items: [me.grid, me.gridVersions]
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

        me.grid.getView().on({
            scope: me,
            beforedrop: 'onBeforeItemDrop'
        });

        me.on({
            scope: me,
            processsaved: 'onProcessSaved'
        });
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
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

    onSelectionChanged: function () {
        var me = this,
            sm = me.grid.getSelectionModel(),
            recs = sm.getSelection();

        if (recs.length == 1) {
            var processName = recs[0].data.ProcessName;
            me.gridVersions.setTitle(Ext.String.format('{0} - {1}', RS.$('All_HistoryVersion'), processName));
            me.gridVersions.parentRecord = recs[0];
            me.storeVersions.load({
                params: {
                    active: false,
                    ProcessName: processName
                },
                loadMask: false
            });
        }
        else if (recs.length == 0){
            me.gridVersions.setTitle(RS.$('All_HistoryVersion'));
            delete me.gridVersions.parentRecord;
            me.storeVersions.removeAll();
        }
    },

    design: function (rec, grid) {
        var me = this,
            panel;

        panel = YZSoft.ViewManager.addView(this, 'YZSoft.bpm.process.admin.DesignerPanel', {
            title: Ext.String.format('{0} - {1}', RS.$('All_ProcessDesign'), rec.data.ProcessName) + (rec.data.Active === false ? ('(v' + rec.data.ProcessVersion + ')') : ''),
            id: 'Process_' + YZSoft.util.hex.encode(rec.data.ProcessName + rec.data.ProcessVersion),
            readOnly: grid.parentRecord ? !grid.parentRecord.data.perm.Write : !rec.data.perm.Write,
            process: {
                path: me.combinePath(me.path, rec.data.ProcessName),
                version: rec.data.ProcessVersion
            },
            listeners: {
                processsaved: function (mode, process) {
                    me.onProcessSaved(mode, process, grid);
                }
            }
        });
    },

    renameCallback: function (newValue,rec) {
        var me = this,
            processName = rec.data.ProcessName;

        me.store.reload({
            loadMask: false,
            callback: function () {
                var rec = me.store.getById(newValue);
                if (rec)
                    me.grid.getSelectionModel().select(rec);

                me.onSelectionChanged();
            }
        });
    },

    onProcessSaved: function (mode, process) {
        var me = this;

        me.store.reload({
            loadMask: false,
            callback: function () {
                var rec = me.store.getById(process.Name);
                if (rec)
                    me.grid.getSelectionModel().select(rec);
            }
        });

        me.storeVersions.reload({ loadMask: false });
    },

    newProcess: function () {
        var me = this,
            newOrderIndex = 1,
            processName = RS.$('Process_Default_Name'),
            panel;

        panel = YZSoft.ViewManager.addView(this, 'YZSoft.bpm.process.admin.DesignerPanel', {
            title: processName,
            listeners: {
                processsaved: function (mode, process) {
                    me.onProcessSaved(mode, process, me.grid);
                }
            }
        });

        me.store.each(function (rec) {
            if (rec.data.OrderIndex >= newOrderIndex)
                newOrderIndex = rec.data.OrderIndex + 1;
        });

        panel.newProcess(me.path, {
            Property: {
                OrderIndex: newOrderIndex
            }
        });
    },

    showProperty: function (rec, grid) {
        var me = this,
            grid = grid || me.grid,
            store = grid.getStore();

        Ext.create('YZSoft.bpm.process.admin.Dialog', {
            autoShow: true,
            title: Ext.String.format('{0} - {1}', RS.$('All_ProcessProperty'), rec.data.ProcessName),
            readOnly: grid.parentRecord ? !grid.parentRecord.data.perm.Write : !rec.data.perm.Write,
            folder: me.path,
            processName: rec.data.ProcessName,
            version: rec.data.ProcessVersion,
            rsid: me.getRecordRsid(me.storeZoneType, me.path, rec.data.ProcessName),
            fn: function (data) {
                store.reload();
            }
        });
    },

    renderStatus: function (value) {
        return value ? RS.$('Process_Status_Active') : RS.$('Process_Status_History');
    },

    renderFlag: function (value, metaData, record) {
        var type = record.data.Type,
            mobileInit = record.data.MobileInitiation,
            tip;

        if (mobileInit)
            return Ext.String.format('<div class="yz-grid-cell-box-flag yz-flag-grayable yz-flag-mobileinit yz-glyph yz-glyph-eaad" data-qtip="{0}"></div>', RS.$('All_Tip_MobileInitiation'));
    }
});