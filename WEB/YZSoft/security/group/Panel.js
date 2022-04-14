
Ext.define('YZSoft.security.group.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.SecurityGroup',
        'YZSoft.bpm.src.model.SID'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.SecurityGroup',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/SecurityGroup.ashx'),
                extraParams: {
                    method: 'GetGroups'
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', Ext.apply({
            clicksToEdit: false,
            listeners: {
                scope: me,
                validateedit: 'onValidateEdit'
            }
        }));

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
                    { xtype: 'rownumberer', renderer: null },
                    { text: RS.$('All_SecutityGroupName'), dataIndex: 'GroupName', flex: 1, editor: { xtype: 'textfield' }, formatter: 'text' },
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
                                me.edit(record);
                            }
                        }]
                    }
                ]
            },
            listeners: {
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    me.edit(record);
                },
                selectionchange: function () {
                    me.updateStatus();
                },
                itemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();

                    var grid = view.grid;
                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('Security_NewGroup'),
                            disabled: !me.perm.Write,
                            handler: function () {
                                me.addNew();
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-edit',
                            text: RS.$('All_Edit'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, '', 1, 1),
                            handler: function () {
                                me.edit(record);
                            }
                        }, '-', {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Delete', 1, -1),
                            handler: function () {
                                me.deleteSelection();
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-rename',
                            text: RS.$('All_Rename'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, grid, 'Delete', 1, 1),
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
                            text: RS.$('Security_NewGroup'),
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

        me.storeGroupUsers = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.SID',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/SecurityGroup.ashx'),
                extraParams: {
                    method: 'GetGroupUsers'
                }
            }
        });

        me.gridGroupUsers = Ext.create('Ext.grid.Panel', {
            title: RS.$('All_Member'),
            store: me.storeGroupUsers,
            region: 'south',
            ui: 'light',
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
            height: '40%',
            minHeight: 100,
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { xtype: 'rownumberer', renderer: null },
                    { text: RS.$('All_Member'), dataIndex: 'DisplayName', tdCls: 'yz-grid-cell-pl-6', flex: 1, renderer: me.renderSIDName.bind(me) },
                    { text: RS.$('All_Type'), dataIndex: 'SIDType', width: 120, align:'center', renderer: YZSoft.Render.renderSIDType }
                ]
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
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid, 'Delete', 1, -1));
            },
            handler: function () {
                me.deleteSelection();
            }
        });

        me.btnAssignPerm = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e611',
            text: RS.$('All_AssignManagePerm'),
            disabled: true,
            handler: function () {
                Ext.create('YZSoft.security.WellKnownRSIDAssignPermDlg', {
                    autoShow: true,
                    title: RS.$('All_SecurityGroup'),
                    rsid: YZSoft.WellKnownRSID.SecurityGroupRoot,
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
            templateExcel: YZSoft.$url(me, Ext.String.format('SecurityGroup{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            fileName: RS.$('All_SecurityGroup'),
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
                cls: 'yz-tbar-module',
                items: [
                    me.btnNew,
                    me.btnEdit,
                    me.btnDelete,
                    '|',
                    me.btnAssignPerm,
                    '|',
                    me.btnExcelExport,
                    me.btnRefresh,
                    '->',
                    RS.$('All_PageFilter'),
                    me.edtFilter
                ]
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
                rsid: YZSoft.WellKnownRSID.SecurityGroupRoot,
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

    renderSIDFlag: function (value, metaData, record) {
        var sidType = record.data.SIDType,
            glyph, tip;

        switch (sidType) {
            case 'UserSID':
                tip = RS.$('All_Account');
                glyph = 'yz-glyph-eae1';
                break;
            case 'GroupSID':
                tip = RS.$('All_SecurityGroup');
                glyph = 'yz-glyph-eb14';
                break;
            case 'OUSID':
                tip = RS.$('All_OU');
                glyph = 'yz-glyph-eb26';
                break;
            case 'RoleSID':
                tip = RS.$('All_Role');
                glyph = 'yz-glyph-ea94';
                break;
            case 'LeaderTitleSID':
                tip = RS.$('All_LeaderTitle');
                glyph = 'yz-glyph-ea94';
                break;
            case 'CustomCode':
                tip = RS.$('All_Advanced');
                glyph = 'yz-glyph-eaf6';
                break;
            default:
                return false;
        }

        return Ext.String.format('<div class="yz-grid-cell-box-flag yz-flag-grayable yz-color-type yz-glyph {0}" style="padding-right:8px;" data-qtip="{1}"></div>', glyph, tip);
    },

    renderSIDName: function (value, metaData, record) {
        var flag = this.renderSIDFlag(value, metaData, record);
        return flag + Ext.util.Format.text(value);
    },

    addNew: function () {
        var me = this;

        Ext.create('YZSoft.security.group.Dialog', {
            title: RS.$('Security_NewGroup'),
            autoShow: true,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.group.GroupName));
                    }
                });
            }
        });
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.security.group.Dialog', {
            groupName: rec.data.GroupName,
            title: Ext.String.format('{0} - {1}', RS.$('Security_Title_SecutiryGroup'), rec.data.GroupName),
            readOnly: !me.perm.Write,
            autoShow: true,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.group.GroupName));
                        me.updateStatus();
                    }
                });
            }
        });
    },

    deleteSelection: function () {
        var me = this,
            recs = me.grid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        var params = {
            method: 'DeleteGroups'
        };

        var groupNames = [];
        Ext.each(recs, function (rec) {
            groupNames.push(rec.getId());
        });

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: RS.$('Security_DeleteSecurityGroupCfm_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/SecurityGroup.ashx'),
                    method:'POST',
                    params: params,
                    jsonData:groupNames,
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
                                target: me
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

    onValidateEdit: function (editor, context, eOpts) {
        var me = this,
            rec = context.record;

        context.value = Ext.String.trim(context.value);

        if (context.originalValue == context.value)
            return;

        if (!context.value) {
            context.cancel = true;
            return;
        }

        var err = $objname(context.value);
        if (err !== true) {
            YZSoft.alert(err);
            context.cancel = true;
            return;
        }

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SecurityGroup.ashx'),
            params: {
                method: 'RenameSecurityGroup',
                name: context.originalValue,
                newname: context.value
            },
            success: function (action) {
                Ext.defer(function () {
                    me.updateStatus();
                },1);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                context.cancel = true;
            }
        });
    },

    updateStatus: function () {
        var sm = this.grid.getSelectionModel(),
            recs = sm.getSelection();

        if (recs.length == 1) {
            var groupName = recs[0].data.GroupName;
            this.gridGroupUsers.setTitle(Ext.String.format('{0} - {1}', RS.$('All_SecurityGroup'), groupName));
            this.storeGroupUsers.load({
                params: {
                    GroupName: groupName
                },
                loadMask: false
            });
        }
    }
});
