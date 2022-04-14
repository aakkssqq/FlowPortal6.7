/*
config
path
storeZoneType
parentRsid
*/
Ext.define('YZSoft.bpm.xformadmin.Panel', {
    extend: 'YZSoft.bpm.src.zone.Panel',
    requires: [
        'YZSoft.bpm.src.model.FormInfo',
        'YZSoft.src.ux.CustomProtocolSignal'
    ],
    designerVersion: '4.14',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.FormInfo',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/XForm.ashx'),
                extraParams: {
                    method: 'GetFormsInFolder',
                    perm: 'Read',
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
                    { text: RS.$('All_FileName'), dataIndex: 'FileName', flex: 2, editor: { xtype: 'textfield' }, formatter: 'text' },
                    { xtype: 'datecolumn', text: RS.$('All_LastModifyDate'), dataIndex: 'LastWriteTime', width: 160, align: 'center', formatter: 'date("Y-m-d H:i")' },
                    { text: RS.$('All_FileSize'), dataIndex: 'Length', width: 100, align: 'right', formatter: 'fileSize' },
                    { text: RS.$('All_Desc'), dataIndex: 'Desc', flex: 3, formatter: 'text' }
                ]
            },
            listeners: {
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    me.design(record);
                },
                itemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();

                    var grid = view.grid;
                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('All_NewFormAdv'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.newForm();
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-edit',
                            text: RS.$('All_EditFormAdv'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, '', 1, 1),
                            handler: function () {
                                me.design(record);
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-clone',
                            text: RS.$('All_Clone'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.cloneSelection(grid, 'FileName');
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-e60e',
                            text: RS.$('All_MoveStoreObjects'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.moveObjects({
                                    grid: grid,
                                    nameField: 'FileName'
                                });
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid, 'FileName');
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
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('All_NewFormAdv'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.newForm();
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid, 'FileName');
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
                me.newForm();
            }
        });

        me.btnDesign = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-edit',
            text: RS.$('All_Design'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(me, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.design(recs[0]);
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
                me.deleteSelection(me.grid, 'FileName');
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('FormList{0}.xls', RS.$('All_LangPostfix'))),
            params: {
                Folder: config.title
            },
            fileName: Ext.String.format('{0}[{1}]', RS.$('All_FormList'), config.title),
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
                items: [me.btnNew, me.btnDesign, me.btnDelete, '|', me.btnExcelExport, me.btnRefresh, '->', RS.$('All_PageFilter'), me.edtFilter]
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
                    me.rtc.request.params.folder = path;
                }
            });
        }

        me.rtc = Ext.create('YZSoft.src.ux.RTC', {
            bind: me,
            millis: 3000,
            request: {
                url: YZSoft.$url('YZSoft.Services.REST/BPM/XFormAdmin.ashx'),
                params: {
                    method: 'GetDataVersionOfFormsInFolder',
                    folder: config.path
                },
                success: function (action) {
                    var metaData = me.store.getProxy().getReader().metaData;

                    if (action.result.lastUpdateTime && metaData && metaData.dataVersion && action.result.lastUpdateTime > metaData.dataVersion.lastUpdateTime) {
                        me.store.reload({
                            callback: function () {
                                me.rtc.waitOne();
                            }
                        });
                    }
                    me.rtc.waitOne();
                }
            }
        });
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
                me.btnDelete.updateStatus();
            }
        });
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    newForm: function () {
        var me = this,
            params;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: { method: 'GenGuid' },
            success: function (action) {
                params = {
                    method: 'new',
                    websiteRootUrl: YZSoft.getAbsoluteRootUrl(),
                    requestState: userInfo.ClientRequestState,
                    formUrl: YZSoft.getAbsoluteUrl(YZSoft.$url('YZSoft/Forms/XForm/' + me.path + (me.path ? '/' : '') + 'NewFile.aspx')),
                    folder: me.path,
                    lcid: RS.$("All_Languages_Cur_LCID"),
                    startId: action.result.guid
                };

                YZSoft.src.ux.CustomProtocolSignal.launch('XFormWebDesigner' + me.designerVersion + ':base64,' + Ext.util.Base64.encode(Ext.encode(params)), function () {
                    Ext.create('YZSoft.bpm.xformadmin.XFormDesignerInstallDlg', {
                        autoShow: true,
                        version: me.designerVersion
                    });
                }, 'XFormDesignerOpened' + action.result.guid);
            }
        });
    },

    design: function (rec) {
        var me = this,
            params;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: { method: 'GenGuid' },
            success: function (action) {
                params = {
                    method: 'edit',
                    readOnly: !me.perm.Write,
                    websiteRootUrl: YZSoft.getAbsoluteRootUrl(),
                    requestState: userInfo.ClientRequestState,
                    formUrl: YZSoft.getAbsoluteUrl(YZSoft.$url('YZSoft/Forms/XForm/' + me.path + (me.path ? '/' : '') + rec.data.FileName)),
                    folder: me.path,
                    name: rec.data.FileName,
                    lcid: RS.$("All_Languages_Cur_LCID"),
                    startId: action.result.guid
                };

                YZSoft.src.ux.CustomProtocolSignal.launch('XFormWebDesigner' + me.designerVersion + ':base64,' + Ext.util.Base64.encode(Ext.encode(params)), function () {
                    Ext.create('YZSoft.bpm.xformadmin.XFormDesignerInstallDlg', {
                        autoShow: true,
                        version: me.designerVersion
                    });
                }, 'XFormDesignerOpened' + action.result.guid);
            }
        });
    }
});
