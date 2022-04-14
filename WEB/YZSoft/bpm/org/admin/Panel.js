/*
config
path
parentRsid: rec.data.rsid
*/
Ext.define('YZSoft.bpm.org.admin.Panel', {
    extend: 'Ext.panel.Panel',
    header: false,
    requires: [
        'YZSoft.bpm.src.model.OUObject'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: true,
            model: 'YZSoft.bpm.src.model.OUObject',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                extraParams: {
                    method: 'GetOUObjects',
                    path: config.path,
                    defaultPosition: true
                },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                scope: me,
                load: function (store, records, successful, operation, eOpts) {
                    var perm = me.perm,
                        metaData = me.store.getProxy().getReader().metaData;

                    if (metaData) {
                        me.OUEditable = metaData.Editable;
                        me.OUNewRole = metaData.NewRole;
                    }

                    me.menuAddNewRole.setDisabled(!me.path || !perm.Write || !me.OUNewRole);
                    me.menuAddNewMember.setDisabled(!me.path || !perm.Write || !me.OUEditable);
                    me.btnNew.setDisabled(!me.path || !perm.Write || (!me.OUEditable && !me.OUNewRole));
                    me.btnAddExistUser.setDisabled(!me.path || !me.OUEditable || !perm.Write);
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
            columns: {
                defaults: {
                    sortable: false,
                },
                items: [
                    { xtype: 'rownumberer' },
                    { text: '<div class="yz-column-header-flag fa fa-flag"></div>', tdCls: 'yz-grid-cell-flag', width: 30, align: 'center', sortable: false, draggable: false, locked: false, autoLock: true, resizable: false, menuDisabled: true, renderer: me.renderFlag.bind(me) },
                    { text: RS.$('Org_ObjectName'), dataIndex: 'Name', width: 160, formatter: 'text' },
                    { text: RS.$('All_Type'), dataIndex: 'Type', width: 120, align: 'center', renderer: me.renderType },
                    { text: RS.$('All_UserDisplayName'), dataIndex: 'DisplayName', width: 160, formatter: 'text' },
                    { text: RS.$('All_MemberLevel'), dataIndex: 'Level', width: 68, align: 'center' },
                    { text: RS.$('All_LeaderTitle'), dataIndex: 'LeaderTitle', width: 160, align: 'center', formatter: 'text' },
                    { text: RS.$('All_Supervisor'), dataIndex: 'Supervisors', flex: 1, renderer: me.renderSupervisors },
                    {
                        xtype: 'actioncolumn',
                        text: RS.$('All_Default_Position'),
                        width: 80,
                        align: 'center',
                        sortable: false,
                        draggable: false,
                        menuDisabled: true,
                        disabledCls: 'yz-display-none',
                        items: [{
                            glyph: 0xead1,
                            iconCls: 'yz-size-icon-13 yz-action-defaultposition',
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return record.data.Type != 'Member' || record.data.Disabled || record.data.IsDefaultPosition;
                            },
                            handler: function (grid, rowIndex, colIndex, item, e, record) {
                                if (me.perm && me.perm.Write)
                                    me.setDefaultPosition(record);
                            }
                        }, {
                            glyph: 0xead0,
                            iconCls: 'yz-size-icon-13 yz-action-defaultposition-yes',
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return record.data.Type != 'Member' || record.data.Disabled || !record.data.IsDefaultPosition;
                            }
                        }]
                    }
                ]
            },
            viewConfig: {
                getRowClass: function (record) {
                    if (record.data.Disabled)
                        return 'yz-grid-row-gray';
                }
            },
            listeners: {
                itemdblclick: function (view, record, item, index, e, eOpts) {
                    me.edit(record);
                },
                containercontextmenu: function (view, e, eOpts) {
                    e.stopEvent();
                },
                itemcontextmenu: function (view, record, item, index, e) {
                    e.stopEvent();

                    var recs = me.grid.getSelectionModel().getSelection();

                    var menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-property',
                            text: RS.$('All_Property'),
                            disabled: !YZSoft.UIHelper.IsOptEnable(null, me.grid, '', 1, 1),
                            handler: function () {
                                if (recs.length == 1)
                                    me.edit(recs[0]);
                            }
                        },
                        '-',
                        {
                            iconCls: 'yz-glyph yz-glyph-copy',
                            text: RS.$('Org_CopySupervisor'),
                            disabled: !(me.OUEditable && recs.length == 1 && recs[0].data.Type == 'Member'),
                            handler: function () {
                                if (recs.length == 1)
                                    me.copySupervisor(recs[0]);
                            }
                        }, {
                            glyph: 0xe60c,
                            text: RS.$('Org_PasteSupervisor'),
                            disabled: !me.OUEditable || !me.perm.Write || !YZSoft.clipboard.Supervisor || recs.length == 0 || me.hasRole(recs),
                            handler: function () {
                                me.pasteSupervisor(recs);
                            }
                        },
                        '-',
                        {
                            glyph: 0xe60e,
                            text: RS.$('Org_MoveToOU'),
                            disabled: !me.OUEditable || !me.perm.Write || recs.length == 0,
                            handler: function () {
                                me.moveObjects(recs);
                            }
                        },
                        '-',
                        {
                            glyph: 0xea4f,
                            text: RS.$('All_LineUp'),
                            disabled: !me.OUEditable || !me.perm.Write || !me.canMoveUp(recs),
                            handler: function () {
                                me.moveUp(recs);
                            }
                        }, {
                            glyph: 0xe601,
                            text: RS.$('All_LineDown'),
                            disabled: !me.OUEditable || !me.perm.Write || !me.canMoveDown(recs),
                            handler: function () {
                                me.moveDown(recs);
                            }
                        },
                        '-',
                        {
                            iconCls: 'yz-glyph yz-glyph-delete',
                            text: RS.$('All_Delete'),
                            disabled: me.hasUnEditable(recs) || !YZSoft.UIHelper.IsOptEnable(me, me.grid, 'Write', 1, -1),
                            handler: function () {
                                me.deleteSelection();
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-e617',
                            text: RS.$('All_Pwd_Reset'),
                            sm: me.grid.getSelectionModel(),
                            disabled: !(recs.length == 1 && recs[0].data.Type == 'Member' && me.perm.Write && recs[0].data.UserEditable),
                            handler: function () {
                                if (recs.length == 1)
                                    me.resetPwd(recs[0]);
                            }
                        }]
                    });

                    menu.showAt(e.getXY());
                    menu.focus();
                }
            }
        });

        me.menuAddNewMember = Ext.create('Ext.menu.Item', {
            text: RS.$('All_Member'),
            glyph:0xeae1,
            handler: function (item) {
                me.addNewMember();
            }
        });

        me.menuAddNewRole = Ext.create('Ext.menu.Item', {
            text: RS.$('All_Role'),
            glyph: 0xe614,
            handler: function (item) {
                me.addNewRole();
            }
        });

        me.btnNew = Ext.create('Ext.button.Button', {
            text: RS.$('All_New'),
            glyph: 0xe61d,
            disabled: true,
            menu: {
                items: [me.menuAddNewMember, me.menuAddNewRole]
            }
        });

        me.btnAddExistUser = Ext.create('Ext.button.Button', {
            text: RS.$('Org_AddExistUser'),
            glyph: 0xeb20,
            disabled: true,
            handler: function () {
                me.addExistUser();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-property',
            text: RS.$('All_Property'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!YZSoft.UIHelper.IsOptEnable(me, me.grid, '', 1, 1));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.edit(recs[0]);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-delete',
            text: RS.$('All_Delete'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                var recs = this.sm.getSelection();
                this.setDisabled(me.hasUnEditable(recs) || !YZSoft.UIHelper.IsOptEnable(me, me.grid, 'Write', 1, -1));
            },
            handler: function () {
                me.deleteSelection();
            }
        });

        me.menuResetPwd = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e617',
            text: RS.$('All_Pwd_Reset'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                var recs = this.sm.getSelection();
                this.setDisabled(!(recs.length == 1 && recs[0].data.Type == 'Member' && me.perm.Write && recs[0].data.UserEditable));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.resetPwd(recs[0]);
            }
        });

        me.menuCopySupervisor = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-copy',
            text: RS.$('Org_CopySupervisor'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                var recs = this.sm.getSelection();
                this.setDisabled(!(me.OUEditable && recs.length == 1 && recs[0].data.Type == 'Member'));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.copySupervisor(recs[0]);
            }
        });

        me.menuPasteSupervisor = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e60c',
            text: RS.$('Org_PasteSupervisor'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                var recs = this.sm.getSelection();
                this.setDisabled(!me.OUEditable || !me.perm.Write || !YZSoft.clipboard.Supervisor || recs.length == 0 || me.hasRole(recs));
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                me.pasteSupervisor(recs);
            }
        });

        me.menuMoveObjects = Ext.create('YZSoft.src.menu.Item', {
            iconCls: 'yz-glyph yz-glyph-e60e',
            text: RS.$('Org_MoveToOU'),
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                var recs = this.sm.getSelection();
                this.setDisabled(!me.OUEditable || !me.perm.Write || recs.length == 0);
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                me.moveObjects(recs);
            }
        });

        me.menuMoveUp = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_LineUp'),
            glyph: 0xea4f,
            sm: me.grid.getSelectionModel(),
            store: me.store,
            updateStatus: function () {
                this.setDisabled(!me.OUEditable || !me.perm.Write || !me.canMoveUp(this.sm.getSelection()));
            },
            handler: function () {
                var recs = this.sm.getSelection();
                me.moveUp(recs);
            }
        });

        me.menuMoveDown = Ext.create('YZSoft.src.menu.Item', {
            text: RS.$('All_LineDown'),
            glyph: 0xe601,
            sm: me.grid.getSelectionModel(),
            store: me.store,
            updateStatus: function () {
                this.setDisabled(!me.OUEditable || !me.perm.Write || !me.canMoveDown(this.sm.getSelection()));
            },
            handler: function () {
                var recs = this.sm.getSelection();
                me.moveDown(recs);
            }
        });

        me.btnMore = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e602',
            text: RS.$('All_MoreOpt'),
            menu: {
                items: [
                    me.menuResetPwd,
                    '-',
                    me.menuCopySupervisor,
                    me.menuPasteSupervisor,
                    '-',
                    me.menuMoveObjects,
                    '-',
                    me.menuMoveUp,
                    me.menuMoveDown
                ]
            },
            listeners: {
                menushow: function () {
                    me.menuPasteSupervisor.updateStatus();
                }
            }
        });

        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('OUMembers{0}.xls', RS.$('All_LangPostfix'))),
            params: {
                Folder: config.title
            },
            fileName: Ext.String.format('{0}[{1}]', RS.$('All_OUMember'), config.title),
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

        me.edtSearch = Ext.create('YZSoft.src.form.field.Search', {
            listeners: {
                searchclick: function () {
                    me.fireEvent('searchclick', me.edtSearch.getValue());
                },
                clearclick: function () {
                    me.fireEvent('clearclick');
                }
            }
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls:'yz-tbar-module',
                items: [me.btnNew, me.btnAddExistUser, me.btnEdit, '|', me.btnDelete, me.btnMore, '|', me.btnExcelExport, me.btnRefresh, '->', RS.$('All_SearchUser'), me.edtSearch]
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
                    me.store.reload({
                        loadMask: false
                    });
                },
                gotoAccount: function (account) {
                    var rec = me.store.getById(account);
                    if (rec) {
                        me.grid.getSelectionModel().select(rec);
                        me.grid.ensureVisible(rec);
                    }
                    return false;
                }
            });
        }

        Ext.getDoc().on({
            userdefaultpositionchanged: function (uid, memberfullname) {
                var store = me.store;

                store.each(function (rec) {
                    if (rec.data.Name == uid)
                        rec.set('IsDefaultPosition', rec.data.FullName == memberfullname);
                });
            }
        });
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: me.parentRsid,
                perms: 'Write'
            },
            success: function (action) {
                me.perm = action.result;
            }
        });
    },

    onActivate: function () {
        var me = this;

        me.store.load({
            loadMask: false,
            callback: function (records, operation, success) {
                if (me.record) {
                    me.record.fireEvent('ouobjectsloaded', me.grid, records, operation, success)
                }
            }
        });
    },

    renderFlag: function (value, metaData, record) {
        var type = record.data.Type,
            disabled = record.data.Disabled,
            tip;

        if (type == 'Member') {
            tip = RS.$('All_Member');
            if (disabled)
                tip += '(' + RS.$('All_Disabled') + ')';

            return Ext.String.format('<div class="yz-grid-cell-box-flag yz-flag-grayable yz-color-type yz-glyph yz-glyph-eae1" data-qtip="{0}"></div>', tip);
        }
        else
            return Ext.String.format('<div class="yz-grid-cell-box-flag yz-flag-grayable yz-color-type yz-glyph yz-glyph-ea94" data-qtip="{0}"></div>', RS.$('All_Role'));
    },

    renderType: function (value, metaData, record) {
        return value == 'Member' ? (record.data.IsLeader ? RS.$('All_Leader') : RS.$('All_Member')) : RS.$('All_Role');
    },

    setDefaultPosition: function (rec) {
        var me = this,
            uid = rec.data.Name,
            memberfullname = rec.data.FullName;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'SetUserDefaultPosition',
                uid: uid,
                memberFullName: rec.data.FullName
            },
            waitMsg: {
                target: me
            },
            success: function (result) {
                Ext.getDoc().fireEvent('userdefaultpositionchanged', uid, memberfullname);
            }
        });
    },

    selectByNames: function (added) {
        var me = this,
            recs = [];

        Ext.each(added, function (account) {
            var rec = me.store.getById(account);
            if (rec)
                recs.push(rec);
        });

        me.grid.getSelectionModel().select(recs);
    },

    hasRole: function (recs) {
        var find = Ext.Array.findBy(recs, function (rec) {
            if (rec.data.Type == 'Role')
                return true;
        });

        return find ? true : false;
    },

    renderSupervisors: function (value, metaData, record) {
        var rv = [];

        Ext.each(value, function (spv) {
            var spvItem;
            if (spv.FGYWEnabled) {
                if (spv.FGYWs.length == 0)
                    spvItem = Ext.String.format('{0}[{1}]',
                        YZSoft.Render.renderString(spv.UserName),
                        RS.$('All_Supervisor_Empty_Biz')
                    );
                else
                    spvItem = Ext.String.format('{0}[{1}]',
                        YZSoft.Render.renderString(spv.UserName),
                        YZSoft.Render.renderString(spv.FGYWs.join(';'))
                    );
            }
            else {
                spvItem = spv.UserName;
            }

            rv.push(spvItem);
        });

        return rv.join(',');
    },

    canMoveUp: function (recs) {
        var me = this;

        if (recs.length == 0)
            return false;

        if (me.hasRole(recs))
            return false;

        recs = Ext.Array.sort(recs, function (a, b) {
            return me.store.indexOf(a) - me.store.indexOf(b);
        });

        var rec = recs[0],
            idx = me.store.indexOf(rec);

        if (idx == 0)
            return false;

        var prerec = me.store.getAt(idx - 1);
        if (prerec.data.Type == 'Role')
            return false;

        if (!rec.data.IsLeader && prerec.data.IsLeader)
            return false;

        return true;
    },

    canMoveDown: function (recs) {
        var me = this;

        if (recs.length == 0)
            return false;

        if (me.hasRole(recs))
            return false;

        recs = Ext.Array.sort(recs, function (a, b) {
            return me.store.indexOf(a) - me.store.indexOf(b);
        });

        var rec = recs[recs.length - 1],
            idx = me.store.indexOf(rec);

        if (idx == me.store.getCount() - 1)
            return false;

        var nextrec = me.store.getAt(idx + 1);
        if (rec.data.IsLeader && !nextrec.data.IsLeader)
            return false;

        return true;
    },

    addNewRole: function () {
        var me = this;

        Ext.create('YZSoft.bpm.org.admin.RoleDlg', {
            autoShow: true,
            title: RS.$('Org_CreateRole'),
            parentou: me.path,
            getRootOUsType: 'SameProvider',
            srcoupath: me.path,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    addNewMember: function () {
        var me = this;

        Ext.create('YZSoft.bpm.org.admin.MemberDlg', {
            autoShow: true,
            title: RS.$('Org_CreateMember'),
            parentou: me.path,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    addExistUser: function () {
        var me = this;

        YZSoft.SelUsersDlg.show({
            fn: function (users) {
                var accounts = [];

                Ext.each(users, function (user) {
                    accounts.push(user.Account);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                    params: {
                        method: 'AddExistUsers',
                        parentou: me.path
                    },
                    jsonData: accounts,
                    waitMsg: {
                        msg: RS.$('Org_AddExistUser_LoadMask'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: Ext.String.format(RS.$('Org_AddExistUser_Success'), users.length),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start: 0
                            },
                            callback: function () {
                                me.selectByNames(action.result.added);
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

                        me.store.reload({
                            mbox: mbox,
                            callback: function () {
                                me.selectByNames(action.result.added);
                            }
                        });
                    }
                });

            }
        });
    },

    edit: function (rec) {
        var me = this;

        switch (rec.data.Type) {
            case 'Member':
                me.editMember(rec);
                break;
            case 'Role':
                me.editRole(rec);
                break;
        }
    },

    editRole: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.org.admin.RoleDlg', {
            autoShow: true,
            title: Ext.String.format('{0} - {1}', RS.$('All_RoleProperty'), rec.data.Name),
            readOnly: !me.perm.Write,
            fullname: rec.data.FullName,
            getRootOUsType: 'SameProvider',
            srcoupath: me.path,
            fn: function (data) {
                me.store.reload({
                    callback: function () {
                        me.grid.getSelectionModel().select(me.store.getById(data.Name));
                    }
                });
            }
        });
    },

    editMember: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.org.admin.MemberDlg', {
            autoShow: true,
            title: Ext.String.format(RS.$('Org_MemberProperty_Title'), rec.data.Name),
            readOnly: !me.perm.Write,
            fullname: rec.data.FullName,
            parentou: me.path,
            fn: function (data) {
                if (data.headshotChanged && data.Name == YZSoft.LoginUser.Account)
                    Ext.getDoc().fireEvent('headshotChanged');

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
            recs = me.grid.getSelectionModel().getSelection(),
            ids = [];

        if (recs.length == 0)
            return;

        var roles = [],
            members = [];

        Ext.each(recs, function (rec) {
            if (rec.data.Type == 'Role')
                roles.push(rec.data.Name);
            if (rec.data.Type == 'Member')
                members.push(rec.data.Name);
        });

        var params = {
            method: 'DeleteObjects',
            parentou: me.path
        };

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
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                    params: params,
                    jsonData: {
                        roles: roles,
                        members: members
                    },
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
                                target:me,
                                start: 0
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

    resetPwd: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.org.admin.ResetPwdDlg', {
            autoShow: true,
            title: Ext.String.format(RS.$('Org_ResetPwd_Title'), rec.data.DisplayName || rec.data.Name),
            parentou: me.path,
            uid: rec.data.Name,
            fn: function (user) {
            }
        });
    },

    copySupervisor: function (rec) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: { method: 'GetSupervisors', memberfullname: rec.data.FullName },
            success: function (action) {
                YZSoft.clipboard.Supervisor = action.result;
                me.fireEvent('supervisorChanged');
            }
        });
    },

    pasteSupervisor: function (recs) {
        if (!YZSoft.clipboard.Supervisor)
            return;

        var me = this,
            mbs = [];

        Ext.each(recs, function (rec) {
            mbs.push(rec.data.FullName);
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: { method: 'SetSupervisors' },
            jsonData: {
                members: mbs,
                supervisors: YZSoft.clipboard.Supervisor
            },
            waitMsg: {
                msg: RS.$('All_Copying'),
                target: me
            },
            success: function (action) {
                me.store.reload({
                    loadMask: {
                        msg: Ext.String.format(RS.$('Org_CopySupervisor_Success'), recs.length),
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
    },

    moveObjects: function (recs) {
        var me = this,
            objects = [];

        Ext.each(recs, function (rec) {
            objects.push(rec.data);
        });

        Ext.create('YZSoft.bpm.org.admin.SelMoveTagOUDlg', {
            autoShow: true,
            objects: objects,
            getRootOUsType: 'MoveRoleMemberTo',
            srcoupath: me.path,
            fn: function (data) {
                var roles = [],
                    members = [];

                Ext.each(recs, function (rec) {
                    if (rec.data.Type == 'Role')
                        roles.push(rec.data.Name);
                    if (rec.data.Type == 'Member')
                        members.push(rec.data.Name);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                    params: {
                        method: 'MoveOUObjects',
                        src: me.path,
                        tag: data.ou.FullName,
                        copy: data.copy
                    },
                    jsonData: {
                        members: members,
                        roles: roles
                    },
                    waitMsg: {
                        msg: data.copy ? RS.$('All_Copying') : RS.$('All_Moving'),
                        target: me,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: Ext.String.format(data.copy ? RS.$('All_Copy_Success_Multi') : RS.$('All_Move_Success_Multi'), recs.length),
                                msgCls: 'yz-mask-msg-success',
                                target: me,
                                start: 0,
                                stay: 'xxx'
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

    moveUp: function (recs) {
        var me = this,
            mbs = [];

        Ext.each(recs, function (rec) {
            mbs.push(rec.data.Name);
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'MoveUpMembers',
                parentou: me.path
            },
            jsonData: mbs,
            success: function (action) {
                me.store.reload({
                    loadMask: false
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
    },

    moveDown: function (recs) {
        var me = this,
            mbs = [];

        Ext.each(recs, function (rec) {
            mbs.push(rec.data.Name);
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'MoveDownMembers',
                parentou: me.path
            },
            jsonData: mbs,
            success: function (action) {
                me.store.reload({
                    loadMask: false
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
    },

    hasUnEditable: function (recs) {
        var find = Ext.Array.findBy(recs, function (rec) {
            if (!rec.data.Editable)
                return true;
        });

        return find ? true : false;
    }
});
