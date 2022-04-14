Ext.define('YZSoft.bpm.org.admin.Navigator', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.OUFolder'
    ],
    header: false,
    border: false,
    region: 'west',
    width: 295,
    minWidth: 100,
    maxWidth: 500,
    split: {
        size: 5,
        collapseOnDblClick: false,
        collapsible: true
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.OUFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                extraParams: {
                    method: 'GetChildOUs'
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: false,
            listeners: {
                validateedit: function (editor, context, eOpts) {
                    me.onValidateEdit(editor, context, eOpts);
                }
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            store: me.store,
            plugins: [me.cellEditing],
            rootVisible: true,
            useArrows: true,
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                editor: { xtype: 'textfield' }
            }],
            root: {
                text: RS.$('All_Org'),
                glyph: 0xeaee,
                expanded: false,
                rsid: YZSoft.WellKnownRSID.OrganizatonRoot
            },
            listeners: {
                scope: me,
                afterrender: 'onAfterRender',
                selectionchange: 'onSelectionChange',
                itemcontextmenu: 'onItemContextMenu'
            }
        });

        me.btnCollapse = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-collapse',
            tooltip: RS.$('All_Collapse'),
            handler: function () {
                me.collapse();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            tooltip: RS.$('All_Refresh'),
            handler: function () {
                me.store.load({
                    loadMask: true
                });
            }
        });

        cfg = {
            collapsible: false,
            layout: 'fit',
            tbar: {
                cls: 'yz-tbar-navigator',
                items: [me.btnCollapse, '->', me.btnRefresh]
            },
            items: [me.tree]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope:me,
            gotoclick:'onGotoClick'
        });
    },

    onAfterRender: function (tree, eOpts) {
        var me = this,
            root = tree.getRootNode(),
            sm = tree.getSelectionModel(),
            view = tree.getView();

        root.expand(false, function () {
            view.refresh();
            sm.select(root.data.path == 'root' ? root.firstChild || root : root);
        });
    },

    onSelectionChange: function (sm, selected, eOpts) {
        var me = this;

        if (selected.length == 1)
            me.fireEvent('moduleselectionchange', me, selected[0]);
    },

    onItemContextMenu: function (view, record, item, index, e) {
        var me = this,
            isRoot = record.isRoot(),
            objPerm = record.data;

        e.stopEvent();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: record.data.rsid,
                perms: 'Write'
            },
            success: function (action) {
                var perm = record.data.perm = action.result;

                var menu = {
                    newOu: {
                        iconCls: 'yz-glyph yz-glyph-new',
                        text: RS.$('Org_CreateChildOU'),
                        disabled: !objPerm.editable || !perm.Write,
                        handler: function () {
                            me.createChildOU(record);
                        }
                    },
                    newOrg: {
                        iconCls: 'yz-glyph yz-glyph-new',
                        text: RS.$('Org_CreateORG'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.createChildOU(record,true);
                        }
                    },
                    $delete: {
                        iconCls: 'yz-glyph yz-glyph-delete',
                        text: RS.$('All_Delete'),
                        disabled: !objPerm.editable || !perm.Write,
                        handler: function () {
                            me.deleteOU(record);
                        }
                    },
                    rename: {
                        iconCls: 'yz-glyph yz-glyph-rename',
                        text: RS.$('All_Rename'),
                        disabled: !objPerm.editable || !perm.Write,
                        handler: function () {
                            me.cellEditing.startEdit(record, 0);
                        }
                    },
                    move: {
                        iconCls: 'yz-glyph yz-glyph-e60e',
                        text: RS.$('All_MoveOU'),
                        disabled: !objPerm.editable || !perm.Write,
                        handler: function () {
                            me.moveOU(record);
                        }
                    },
                    refresh: {
                        iconCls: 'yz-glyph yz-glyph-refresh',
                        text: RS.$('All_Refresh'),
                        handler: function () {
                            record.set('expanded', true);
                            me.store.load({
                                node: record
                            });
                        }
                    },
                    property: {
                        iconCls: 'yz-glyph yz-glyph-property',
                        text: RS.$('All_Property'),
                        handler: function () {
                            me.onPropertyClicked(record);
                        }
                    },
                    rootProperty: {
                        iconCls: 'yz-glyph yz-glyph-property',
                        text: RS.$('All_Property'),
                        handler: function () {
                            me.onRootPropertyClicked(record);
                        }
                    },
                    sp: {
                        xtype: 'menuseparator'
                    }
                },
                menuOu = [
                    menu.newOu,
                    menu.sp,
                    menu.rename,
                    menu.move,
                    menu.$delete,
                    menu.refresh,
                    menu.sp,
                    menu.property
                ],
                menuRoot = [
                    menu.newOrg,
                    menu.refresh,
                    menu.sp,
                    menu.rootProperty
                ];

                menu = Ext.create('Ext.menu.Menu', {
                    margin: '0 0 10 0',
                    items: isRoot ? menuRoot : menuOu
                });

                menu.showAt(e.getXY());
                menu.focus();
            }
        });
    },

    onPropertyClicked: function (rec) {
        var me = this,
            path = rec.data.path,
            path = path == 'root' ? '' : path,
            orgName = rec.data.text;

        Ext.create('YZSoft.bpm.org.admin.OUDlg', {
            autoShow: true,
            title: Ext.String.format(RS.$('Org_OUProperty_Title'), rec.data.text),
            rsid: rec.data.rsid,
            readOnly: !rec.data.perm.Write,
            fullname: path,
            fn: function (ou) {
                rec.set('text', ou.Name);
                rec.set('path', ou.FullName);

                if (orgName != ou.Name) {
                    rec.set('expanded', true);
                    me.store.load({ node: rec });
                }
            }
        });
    },

    onRootPropertyClicked: function (record) {
        var me = this;

        Ext.create('YZSoft.security.WellKnownRSIDAssignPermDlg', {
            autoShow: true,
            title: RS.$('All_Org_Root'),
            rsid: record.data.rsid,
            readOnly: !record.data.perm.Write,
            perms: [{
                PermName: 'Read',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Read')
            }, {
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_Perm_Write')
            }, {
                PermName: 'OnlineMonitor',
                PermType: 'Module',
                PermDisplayName: RS.$('All_OnlineMonitor')
            }, {
                PermName: 'ActivityMonitor',
                PermType: 'Module',
                PermDisplayName: RS.$('All_ActivityMonitor')
            }],
            fn: function () {
                //me.store.load({ node: record });
            }
        });
    },

    createChildOU: function (rec,rootOU) {
        var me = this,
            path = rec.data.path,
            path = path == 'root' ? '' : path;

        Ext.create('YZSoft.bpm.org.admin.OUDlg', {
            autoShow: true,
            title: Ext.String.format(RS.$('Org_OUProperty_Title'), rec.data.text),
            parentRsid: rec.data.rsid,
            parentou: path,
            fn: function (ou) {
                //这种方式比store.load本rec要平滑
                rec.expand(false, function () {
                    var newrec = me.store.getById(ou.FullName);
                    newrec = newrec || rec.appendChild({
                        path: ou.FullName,
                        text: ou.Name,
                        rsid: ou.RSID,
                        glyph: rootOU ? 0xeb28 : 0xeb26,
                        leaf: false,
                        editable: true,
                        expanded: false,
                        expandable: true
                    });

                    newrec && me.tree.getSelectionModel().select(newrec);
                });
            }
        });
    },

    deleteOU: function (rec) {
        var me = this;

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: Ext.String.format(RS.$('Org_DeleteCfm_Msg'), rec.data.text),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                    params: {
                        method: 'DeleteOU',
                        fullname: rec.data.path
                    },
                    waitMsg: {
                        msg: RS.$('All_Deleting'),
                        target: Ext.getBody(),
                        start: 0
                    },
                    success: function (action) {
                        var nselrec = rec.nextSibling || rec.previousSibling || rec.parentNode;

                        rec.remove();
                        nselrec && me.tree.getSelectionModel().select(nselrec);

                        me.fireEvent('afterdeleterecord', rec);
                    }
                });
            }
        });
    },

    moveOU: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.org.admin.SelMoveTagOUDlg', {
            autoShow: true,
            ou: rec.data.path,
            getRootOUsType: 'MoveOUTo',
            srcoupath: rec.data.path,
            fn: function (data) {

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
                    params: {
                        method: 'MoveOU',
                        src: rec.data.path,
                        tag: data.ou.FullName,
                        copy: data.copy
                    },
                    waitMsg: {
                        msg: data.copy ? RS.$('All_Copying') : RS.$('All_Moving'),
                        target: Ext.getBody(),
                        start: 0
                    },
                    success: function (action) {
                        if (!data.copy) {
                            rec.remove();
                            me.tree.getSelectionModel().selectByPhyPath(data.ou.phyPath + '/' + rec.data.text);

                            me.fireEvent('afterdeleterecord', rec);
                        }
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$('All_Warning'),
                            msg: action.result.errorMessage,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.WARNING
                        });
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
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'RenameOU',
                fullname: rec.data.path,
                newname: context.value
            },
            success: function (action) {
                var ou = action.result;

                rec.set('text', ou.Name);
                rec.set('path', ou.FullName);

                rec.set('expanded', true);
                me.store.load({ node: rec });
            },
            failure: function (action) {
                var me = this;
                YZSoft.alert(action.result.errorMessage, function () {
                    me.exception();
                });
            },
            exception: function () {
                rec.set('text', context.originalValue);
            }
        });
    },

    onGotoClick: function (ouFriendlyName,account) {
        var me = this,
            tree = me.tree,
            sm = tree.getSelectionModel();

        sm.selectByPhyPath('/Root/' + ouFriendlyName, function (record, selected) {
            if (selected) {
                record.fireEvent('gotoAccount', account);
            }
            else {
                record.on({
                    single: true,
                    ouobjectsloaded: function (records, operation, success) {
                        if (success) {
                            record.fireEvent('gotoAccount', account);
                        }
                    }
                });
            }
        });
    }
});
