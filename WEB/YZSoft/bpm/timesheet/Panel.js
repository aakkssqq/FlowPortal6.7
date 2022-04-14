
Ext.define('YZSoft.bpm.timesheet.Panel', {
    extend: 'YZSoft.bpm.src.zone.Panel',
    requires: [
        'YZSoft.bpm.src.model.TimeSheet'
    ],
    storeZoneType: 'TimeSheet',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.TimeSheet',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/TimeSheet.ashx'),
                extraParams: {
                    method: 'GetTimeSheets'
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
                    { xtype: 'rownumberer'},
                    { text: RS.$('All_Name'), dataIndex: 'Name', flex: 1, editor: { xtype: 'textfield' }, formatter: 'text' },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Edit'),
                        width: 100,
                        align: 'center',
                        sortable: false,
                        draggable: false,
                        menuDisabled: true,
                        items: [{
                            glyph: 0xeab4,
                            iconCls: 'yz-size-icon-13',
                            handler: function (grid, rowIndex, colIndex, item, e, record) {
                                me.editCalendar(record);
                            }
                        }]
                    }
                ]
            },
            listeners: {
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    me.editCalendar(record);
                },
                itemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();

                    var grid = view.grid;
                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('All_NewCalendarAdv'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.addNew();
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-e953',
                            text: RS.$('All_EditCalendarAdv'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.editCalendar(record);
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-clone',
                            text: RS.$('All_Clone'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Write', 1, -1),
                            handler: function () {
                                me.cloneSelection(grid);
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection(grid);
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
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-property',
                            text: RS.$('All_Property'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.edit(record);
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
                            text: RS.$('All_NewCalendar'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.addNew();
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(me, grid, 'Write', 1, -1),
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

        me.btnEditCalendar = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e953',
            text: RS.$('All_EditCalendar'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1) {
                    me.editCalendar(recs[0]);
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
                me.deleteSelection();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-property',
            text: RS.$('All_Property'),
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

        me.btnAssignPerm = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e611',
            text: RS.$('All_AssignManagePerm'),
            disabled: true,
            handler: function () {
                Ext.create('YZSoft.security.WellKnownRSIDAssignPermDlg', {
                    autoShow: true,
                    title: RS.$('All_WorkCalendar'),
                    rsid: YZSoft.WellKnownRSID.TimeSheetRoot,
                    perms: [{
                        PermName: 'Read',
                        PermType: 'Module',
                        PermDisplayName: RS.$('All_Perm_Read')
                    }, {
                        PermName: 'Write',
                        PermType: 'Module',
                        PermDisplayName: RS.$('All_Perm_Write')
                    }],
                    fn: function () {
                        //me.store.load({ node: record });
                    }
                });
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('CalendarList{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            fileName: RS.$('All_WorkCalendar'),
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
                items: [me.btnNew, me.btnEditCalendar, me.btnDelete, me.btnEdit, '|', me.btnAssignPerm, '|', me.btnExcelExport, me.btnRefresh, '->', RS.$('All_PageFilter'), me.edtFilter]
            },
            items: [me.grid, me.gridGroupUsers]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: YZSoft.WellKnownRSID.TimeSheetRoot,
                perms: 'Write'
            },
            success: function (action) {
                var perm = me.perm = action.result;

                me.btnNew.setDisabled(!perm.Write);
                me.btnAssignPerm.setDisabled(!perm.Write);
            }
        });
    },

    onActivate: function (times) {
        if (times == 0)
            this.store.load($S.loadMask.first);
        else
            this.store.reload($S.loadMask.activate);
    },

    addNew: function () {
        var me = this;

        Ext.create('YZSoft.bpm.timesheet.PropertyDlg', {
            title: RS.$('All_NewCalendar'),
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

    edit: function (rec) {
        var me = this,
            name = rec.data.Name;

        Ext.create('YZSoft.bpm.timesheet.PropertyDlg', {
            title: Ext.String.format('{0} - {1}', RS.$('All_WorkCalendarProperty'), name),
            readOnly: !me.perm.Write,
            sheetName: name,
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

    deleteSelection: function () {
        var me = this,
            recs = me.grid.getSelectionModel().getSelection();

        if (recs.length == 0)
            return;

        var params = {
            method: 'DeleteTimeSheets'
        };

        var names = [];
        Ext.each(recs, function (rec) {
            names.push({
                ObjectName: rec.data.Name
            });
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$('All_DelCfmMulti_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/TimeSheet.ashx'),
                    method: 'POST',
                    params: params,
                    jsonData: names,
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('All_Deleted_Multi'), recs.length),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start:0
                            }
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Warning'),
                            msg: action.result.errorMessage,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });

                        me.store.reload({ mbox: mbox });
                    }
                });
            }
        });
    },

    editCalendar: function (rec) {
        var me = this,
            name = rec.data.Name;

        YZSoft.ViewManager.addView(this, 'YZSoft.bpm.timesheet.monthcanendar.Panel', {
            title: Ext.String.format('{0} - {1}', RS.$('All_Calendar'), name),
            id: 'TimeSheet_Calendar_' + YZSoft.util.hex.encode(name),
            readOnly: !me.perm.Write,
            sheetName: name
        });
    }
});
