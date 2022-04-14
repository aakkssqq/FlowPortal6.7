/*
config
    editable 是否允许新建和编辑资源，default:true
*/
Ext.define('YZSoft.security.accesscontrol.Navigator', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.SecurityResourceFolder'
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
            editable = config.editable = config.editable === false ? false : true,
            cfg;

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.bpm.src.model.SecurityResourceFolder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
                extraParams: {
                    method: 'GetFolders',
                    expand: true,
                    perm: editable ? 'Write' :'UserResourceAssignPermision'
                }
            }
        });

        me.tree = Ext.create('Ext.tree.Panel', {
            header: false,
            border: false,
            rootVisible: true,
            useArrows: true,
            store: me.store,
            hideHeaders: true,
            root: {
                text: RS.$('All_AccessControlLib'),
                expanded: false,
                rsid: YZSoft.WellKnownRSID.SecurityResourceRoot
            },
            viewConfig: {
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
    },

    onAfterRender: function (tree, eOpts) {
        var me = this,
            root = tree.getRootNode(),
            sm = tree.getSelectionModel(),
            view = me.tree.getView();

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
            menu;

        e.stopEvent();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: record.isRoot() ? record.data.rsid : record.data.path,
                perms: 'Write,UserResourceAssignPermision'
            },
            success: function (action) {
                var perm = record.data.perm = action.result;

                menu = {
                    $new: {
                        iconCls: 'yz-glyph yz-glyph-new',
                        text: RS.$('Security_AddChildResource'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.onAddChildrenClicked(record);
                        }
                    },
                    edit: {
                        iconCls: 'yz-glyph yz-glyph-property',
                        text: RS.$('Security_ResourceProperty'),
                        handler: function () {
                            me.onEditClicked(record);
                        }
                    },
                    resperm: {
                        iconCls: 'yz-glyph yz-glyph-e611',
                        text: RS.$('All_Permision'),
                        handler: function () {
                            me.onAssignPermClicked(record);
                        }
                    },
                    $delete: {
                        iconCls: 'yz-glyph yz-glyph-delete',
                        text: RS.$('All_Delete'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.onDeleteClicked(record);
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
                            me.onRootPropertyClicked(record);
                        }
                    },
                    sp: {
                        xtype: 'menuseparator'
                    }
                };

                var menufolder = me.editable ? [
                    menu.$new,
                    menu.edit,
                    menu.sp,
                    menu.$delete,
                    menu.refresh,
                    menu.sp,
                    menu.resperm
                ] : [
                    menu.refresh,
                    menu.resperm
                ];

                var menuroot = me.editable ? [
                    menu.$new,
                    menu.refresh,
                    menu.sp,
                    menu.property
                ] : [
                    menu.refresh,
                ];

                menu = Ext.create('Ext.menu.Menu', {
                    margin: '0 0 10 0',
                    items: isRoot ? menuroot : menufolder
                });

                menu.showAt(e.getXY());
                menu.focus();
            }
        });
    },

    onRootPropertyClicked: function (record) {
        var me = this;

        Ext.create('YZSoft.security.WellKnownRSIDAssignPermDlg', {
            autoShow: true,
            title: RS.$('Security_AccessControlLib_Root'),
            rsid: record.data.rsid,
            readOnly: !record.data.perm.Write,
            perms: [{
                PermName: 'Write',
                PermType: 'Module',
                PermDisplayName: RS.$('All_AccessControl_Perm_Write')
            }, {
                PermName: 'UserResourceAssignPermision',
                PermType: 'Module',
                PermDisplayName: RS.$('All_AccessControl_Perm_AssignPermision')
            }],
            fn: function () {
                //me.store.load({ node: record });
            }
        });
    },

    onEditClicked: function (rec) {
        Ext.create('YZSoft.security.accesscontrol.ResourceDlg', {
            rsid: rec.data.path,
            title: Ext.String.format('{0} - {1}', RS.$('Security_Title_ResourceProperty'), rec.data.text),
            readOnly: !rec.data.perm.Write,
            autoShow: true,
            autoClose: false,
            fn: function (resource) {
                var dlg = this;
                rec.set('text', resource.resource.ResourceName);
                rec.fireEvent('itemSaved', resource, dlg);
            }
        });
    },

    onAddChildrenClicked: function (rec) {
        var me = this;

        Ext.create('YZSoft.security.accesscontrol.ResourceDlg', {
            parentRsid: rec.isRoot() ? '' : rec.data.path,
            title: RS.$('Security_ResourceProperty_New'),
            autoShow: true,
            fn: function (resource) {
                rec.expand(false, function () {
                    var newrec = me.store.getById(resource.resource.RSID);
                    newrec = newrec || rec.appendChild({
                        path: resource.resource.RSID,
                        text: resource.resource.ResourceName,
                        leaf: false,
                        expanded: false,
                        expandable: true
                    });

                    newrec && me.tree.getSelectionModel().select(newrec);
                });
            }
        });
    },

    onAssignPermClicked: function (rec) {
        Ext.create('YZSoft.security.UserResourceAssignPermDlg', {
            rsid: rec.data.path,
            title: Ext.String.format('{0} - {1}', RS.$('Security_ResourcePermision'), rec.data.text),
            readOnly: !rec.data.perm.UserResourceAssignPermision,
            autoShow: true,
            autoClose:false,
            fn: function (acl) {
                rec.fireEvent('permSaved', acl, this);
            }
        });
    },

    onDeleteClicked: function (rec) {
        var me = this;

        Ext.Msg.show({
            title: RS.$('All_DeleteConfirm_Title'),
            msg: Ext.String.format(RS.$('Security_DelCfm_Msg'), rec.data.text),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'cancel',
            icon: Ext.Msg.INFO,
            fn: function (btn, text) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/core/UserResourceAccessControl.ashx'),
                    params: {
                        method: 'DeleteResource',
                        rsid: rec.data.path
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
    }
});
