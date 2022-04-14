/*
maskTarget
*/

Ext.define('YZSoft.bpa.admin.group.GroupListPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.model.Group'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        config.maskTarget = config.maskTarget || me;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.model.Group',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                extraParams: {
                    Method: 'GetUserGroups',
                    groupType: 'BPATeam'
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', Ext.apply({
            clicksToEdit: false,
            listeners: {
                scope: me,
                validateedit: 'onValidateEdit'
            }
        }, config.cellEditingConfig));

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            region: 'center',
            border: false,
            hideHeaders: true,
            rowLines: false,
            cls: 'bpa-grid-groups',
            bodyStyle: 'border-top-width:0;',
            plugins: [me.cellEditing],
            viewConfig: {
                markDirty: false,
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: false
                },
                items: [
                    { text: '', dataIndex: 'ImageUrl', width: 47, scope: me, renderer: me.renderImage },
                    { text: '', dataIndex: 'Name', flex: 1, scope: me, tdCls:'yz-grid-cell-valign-center',renderer: YZSoft.Render.renderString, editor: { xtype: 'textfield'} }
                ]
            },
            listeners: {
                scope: me,
                itemcontextmenu: 'onItemContextMenu'
            }
        });

        cfg = {
            layout: 'fit',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.load({});
    },

    renderImage: function (value, metaData, record) {
        return Ext.String.format('<image src="{0}" class="groupimg" />', value)
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            sm = view.getSelectionModel(),
            menu;

        e.stopEvent();
        sm.select(record);

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: [{
                iconCls: 'yz-glyph yz-glyph-new',
                text: RS.$('BPA_AddGroup'),
                handler: function () {
                    me.addnew();
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-rename',
                text: RS.$('All_Rename'),
                handler: function () {
                    me.startRename(record);
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-delete',
                text: RS.$('BPA__Disband'),
                handler: function () {
                    me.deleteRecords([record]);
                }
            }, {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.$refresh();
                }
            }, '-', {
                iconCls: 'yz-glyph yz-glyph-property',
                text: RS.$('All_Property'),
                handler: function () {
                    me.edit(record);
                }
            }]
        });

        menu.showAt(e.getXY());
        menu.focus();
    },

    $refresh: function (config) {
        this.store.reload(Ext.apply({
            loadMask: true
        }, config));
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

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'RenameGroup',
                groupid: rec.data.GroupID,
                newName: context.value
            },
            success: function (action) {
                rec.set('Name', context.value);
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
                context.cancel = true;
            }
        });
    },

    startRename: function (record) {
        this.cellEditing.startEdit(record, 1);
    },

    deleteRecords: function (recs) {
        var me = this,
            names = [],
            groupids = [];

        Ext.each(recs, function (rec) {
            groupids.push(rec.data.GroupID);
            names.push(rec.data.Name);
        });

        Ext.Msg.show({
            title: RS.$('BPA_Title_Disband'),
            msg: Ext.String.format(RS.$('BPA_Msg_Disband'), names.join(';')),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    params: {
                        method: 'DisbandGroups'
                    },
                    jsonData: {
                        groupids: groupids
                    },
                    waitMsg: {
                        msg: RS.$('BPA_LoadMask_Disbanding'),
                        target: me.maskTarget,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('BPA_Toast_Disbanded'),
                                msgCls: 'yz-mask-msg-success',
                                target: me.maskTarget,
                                start: 0
                            }
                        });
                    }
                });
            }
        });
    },

    edit: function (record) {
        var me = this;

        Ext.create('YZSoft.app.group.GroupDlg', {
            title: record.data.Name,
            autoShow: true,
            autoClose: false,
            groupid: record.data.GroupID,
            fn: function (data) {
                var dlg = this;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    params: {
                        method: 'UpdateGroup',
                        groupid: record.data.GroupID
                    },
                    jsonData: {
                        data: data
                    },
                    waitMsg: {
                        msg: RS.$('All_LoadMask_Updating'),
                        target: dlg,
                        start: 0
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_Toast_Updated'),
                                msgCls: 'yz-mask-msg-success',
                                target: dlg,
                                start: 0
                            },
                            callback: function () {
                                dlg.close();
                            }
                        });
                    }
                });
            }
        });
    },

    addnew: function () {
        var me = this;

        Ext.create('YZSoft.app.group.GroupDlg', {
            title: RS.$('BPA_AddGroup'),
            autoShow: true,
            autoClose: false,
            fn: function (data) {
                var dlg = this;

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    waitMsg: {
                        msg: RS.$('All_LoadMask_Creating'),
                        target: dlg,
                        start: 0
                    },
                    params: {
                        method: 'CreateGroup',
                        groupType: 'BPATeam',
                        FolderID: 'BPAGroup',
                        DocumentFolderID: 'BPAGroupFile'
                    },
                    jsonData: {
                        data: data
                    },
                    success: function (action) {
                        me.store.reload({
                            loadMask: {
                                msg: RS.$('All_Toast_Created'),
                                msgCls: 'yz-mask-msg-success',
                                target: dlg,
                                start: 0
                            },
                            callback: function (records, options, success) {
                                var sm = me.grid.getSelectionModel(),
                                    rec = me.store.getById(action.result.GroupID);

                                dlg.close();

                                if (rec)
                                    sm.select(rec);
                            }
                        });
                    }
                });
            }
        });
    }
});