
/*
config
    groupInfo,
    maskTarget
*/
Ext.define('YZSoft.bpa.group.MemberPanel', {
    extend: 'Ext.container.Container',
    requires: ['YZSoft.bpa.src.model.GroupMember'],
    layout: 'border',
    style: 'background-color:white',
    padding: '0 40 30 40',
    roles: ['Owner', 'Admin', 'Editor', 'Author', 'Guest'],

    constructor: function (config) {
        var me = this,
            groupInfo = me.groupInfo = config.groupInfo,
            groupid = groupInfo.Group.GroupID,
            perm = groupInfo.Perm,
            cfg;

        config.maskTarget = config.maskTarget || me;

        me.btnAddMember = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddGroupMember'),
            hidden: !perm.Admin,
            cls: 'bpa-btn-solid-hot',
            margin: '0 10 0 0',
            handler: function () {
                me.addMember();
            }
        });

        me.btnDelete = Ext.create('Ext.button.Button', {
            text: RS.$('All_Delete'),
            hidden: !perm.Admin,
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-recyclebin',
            margin: '0 0 0 5',
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length != 0) {
                    me.deleteMember(recs);
                }
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            margin: '0 0 0 20',
            handler: function () {
                me.store.reload({
                    loadMask: true
                });
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 64,
            padding:0,
            items: [
                me.btnAddMember,
                me.btnDelete,
                '->',
                me.btnRefresh
            ]
        });

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: 'YZSoft.bpa.src.model.GroupMember',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                extraParams: {
                    method: 'GetGroupMembers',
                    groupid: groupInfo.Group.GroupID
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            region: 'center',
            border: false,
            cls: 'yz-grid-cellalign-vcenter bpa-grid-groupmember',
            selModel: {
                mode: 'MULTI'
            },
            viewConfig: {
                markDirty: false
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { text: RS.$('All_UserName'), dataIndex: 'User', flex: 3, scope: me, renderer: me.renderUser },
                    { text: RS.$('BPA_ORG_Role'), dataIndex: 'Role', flex: 2, scope: me, renderer: me.renderRole, listeners: { scope: me, click: me.onClickRole} },
                    {
                        xtype: 'actioncolumn',
                        hidden: !perm.Admin,
                        text: RS.$('All_Operation'),
                        width: 180,
                        align: 'center',
                        items: [{
                            glyph: 0xe62b,
                            iconCls: 'yz-action-delete',
                            tooltip: RS.$('All_Delete'),
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return record.isOwner();
                            },
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.deleteMember(record);
                            }
                        }]
                    }
                ]
            }
        },config.gridConfig));

        me.grid.on({
            scope: me,
            selectionchange: 'updateStatus'
        });

        cfg = {
            items: [me.toolbar, me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                me.store.reload($S.loadMask[me.firsttime !== false ? 'first' : 'activate']);
                me.firsttime = false;
            }
        });

        me.updateStatus();
    },

    renderUser: function (value, metaData, record) {
        return Ext.String.format('<img src="{0}" class="headshort"/>{1}{2}',
            Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'GetHeadshot',
                account: value.Account,
                thumbnail: 'S'
            })),
            value.DisplayName || value.Account,
            value.Account == userInfo.Account ? RS.$('BPA__YourSelf') : '');
    },

    renderRole: function (value, metaData, record) {
        var me = this,
            groupInfo = me.groupInfo,
            perm = groupInfo.Perm,
            fmt;

        if (perm.Admin && !record.isOwner())
            fmt = '<div class="changerole">{0}</div>';
        else
            fmt = '{0}';

        return Ext.String.format(fmt, RS.$('All_Enum_GroupRole_' + value));
    },

    onClickRole: function (view, cell, recordIndex, cellIndex, e, record) {
        var me = this,
            target = Ext.fly(e.getTarget());

        if (target.hasCls('changerole')) {
            e.stopEvent();

            var items = [];
            Ext.each(me.roles, function (roleName) {
                if (roleName == 'Owner')
                    return;

                items.push({
                    text: RS.$('All_Enum_GroupRole_' + roleName),
                    tooltip: RS.$('All_Enum_GroupRoleDesc_' + roleName),
                    roleName: roleName,
                    record: record,
                    scope: me,
                    handler: me.onRoleMenuClick
                });
            });
            var menu = Ext.create('Ext.menu.Menu', {
                minWidth: 100,
                shadow: true,
                items: items
            });

            //menu.showBy(target.dom, 'tr-br?');
            menu.showAt(e.getXY());
        }
    },

    deleteMember: function (recs) {
        var me = this,
            groupInfo = me.groupInfo,
            groupid = groupInfo.Group.GroupID,
            accounts = [];

        recs = Ext.isArray(recs) ? recs : [recs];
        Ext.each(recs, function (rec) {
            accounts.push(rec.data.UID);
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'DeleteGroupMembers',
                groupid: groupid
            },
            jsonData: accounts,
            waitMsg: {
                msg: RS.$('All_Deleting'),
                target: me,
                start: 0
            },
            success: function (result) {
                me.store.remove(recs);
            }
        });
    },

    onRoleMenuClick: function (menuItem, e) {
        var me = this,
            groupInfo = me.groupInfo,
            groupid = groupInfo.Group.GroupID,
            rec = menuItem.record,
            roleName = menuItem.roleName;

        if (roleName == rec.data.Role)
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'ChangeMemberRole',
                groupid: groupid,
                UID: rec.data.UID,
                newrole: roleName
            },
            waitMsg: {
                msg: RS.$('All_Submiting'),
                target: me.maskTarget,
                start: 0
            },
            success: function (result) {
                me.store.reload({
                    loadMask: {
                        msg: RS.$('All_Modified'),
                        msgCls: 'yz-mask-msg-success',
                        target: me.maskTarget,
                        start: 0
                    }
                });
            }
        });
    },

    addMember: function () {
        var me = this,
            groupInfo = me.groupInfo,
            groupid = groupInfo.Group.GroupID,
            accounts = [];

        Ext.create('YZSoft.bpa.src.dialogs.AddGroupMemberDlg', {
            autoShow: true,
            fn: function (users, roleName) {
                if (users.length == 0)
                    return;

                Ext.each(users, function (user) {
                    accounts.push(user.Account);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    params: {
                        method: 'AddGroupMembers',
                        groupid: groupid,
                        role: roleName
                    },
                    jsonData: accounts,
                    waitMsg: {
                        msg: RS.$('All_Adding'),
                        target: me.maskTarget,
                        start: 0
                    },
                    success: function (result) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_LoadMask_Add_Success'),
                                msgCls: 'yz-mask-msg-success',
                                target: me.maskTarget,
                                start:0
                            },
                            callback: function (records) {
                                var recs = [];

                                Ext.each(records, function (rec) {
                                    if (Ext.Array.contains(accounts, rec.data.UID))
                                        recs.push(rec);
                                });

                                me.grid.getSelectionModel().select(recs);
                            }
                        });
                    }
                });
            }
        });
    },

    updateStatus: function () {
        var me = this,
            sm = me.grid.getSelectionModel(),
            recs = sm.getSelection(),
            hasOwner = false;

        Ext.each(recs, function (rec) {
            if (rec.isOwner())
                hasOwner = true;
        });

        me.btnDelete.setDisabled(hasOwner || recs.length == 0);
    }
});