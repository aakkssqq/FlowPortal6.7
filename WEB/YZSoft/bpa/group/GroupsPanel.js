
Ext.define('YZSoft.bpa.group.GroupsPanel', {
    extend: 'Ext.container.Container',
    layout: 'border',
    style: 'background-color:white',

    constructor: function (config) {
        var me = this,
            cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: YZSoft.WellKnownRSID.BPAGroupRoot,
                perms: 'Write'
            },
            success: function (action) {
                me.modulePerm = action.result;
            }
        });

        me.titlebar = Ext.create('YZSoft.bpa.group.toolbar.GroupsTitleBar', {
            region: 'north',
            height: 64,
            newBtnConfig: {
                hidden: !me.modulePerm.Write
            }
        });

        me.caption = Ext.create('Ext.Component', {
            region: 'north',
            cls: 'bpa-caption',
            html: RS.$('BPA__AllGroups')
        });

        me.view = Ext.create('YZSoft.bpa.group.libs.GroupsView', {
            region: 'center',
            padding: '30 0 0 36'
        });

        me.view.on({
            scope: me,
            itemclick: 'onItemClick',
            itemcontextmenu: 'onItemContextMenu',
            containercontextmenu: 'onContainerContextMenu'
        });

        cfg = {
            items: [me.titlebar, me.caption, me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.titlebar.on({
            newbtnClick: function () {
                me.view.addnew();
            }
        });

        me.on({
            activate: function () {
                if (me.view.store.isLoaded()) {
                    me.view.$refresh($S.loadMask.activate);
                }
            }
        });
    },

    onItemClick: function (view, record) {
        var me = this,
            cnt = me.up(YZSoft.moduleContainerSelector);

        cnt.showModule({
            xclass: 'YZSoft.bpa.group.GroupPanel',
            config: {
                groupid: record.data.GroupID
            },
            match: function (item) {
                return item.groupid == record.data.GroupID;
            }
        });
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            modulePerm = me.modulePerm,
            sm = view.getSelectionModel(),
            menu;

        e.stopEvent();
        sm.select(record);

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'GetGroupAndUserPerm',
                groupid: record.data.GroupID
            },
            success: function (action) {
                var perm = action.result.Perm;

                menu = {
                    $new: {
                        iconCls: 'yz-glyph yz-glyph-new',
                        text: RS.$('BPA_AddGroup'),
                        disabled: !modulePerm.Write,
                        handler: function () {
                            me.view.addnew();
                        }
                    },
                    rename: {
                        iconCls: 'yz-glyph yz-glyph-rename',
                        text: RS.$('All_Rename'),
                        disabled: !perm.Admin,
                        handler: function () {
                            me.view.startEdit(record, {
                                maskTarget: me
                            });
                        }
                    },
                    $delete: {
                        iconCls: 'yz-glyph yz-glyph-delete',
                        text: RS.$('BPA__Disband'),
                        disabled: !perm.Admin,
                        handler: function () {
                            me.view.deleteRecords([record], {
                                maskTarget: me
                            });
                        }
                    },
                    refresh: {
                        iconCls: 'yz-glyph yz-glyph-refresh',
                        text: RS.$('All_Refresh'),
                        handler: function () {
                            me.view.$refresh();
                        }
                    },
                    property: {
                        iconCls: 'yz-glyph yz-glyph-property',
                        text: RS.$('All_Property'),
                        disabled: !perm.Admin,
                        handler: function () {
                            me.view.edit(record);
                        }
                    }
                };

                if (modulePerm.Write && perm.Admin) {
                    menu = [
                        menu.$new,
                        '-',
                        menu.rename,
                        menu.$delete,
                        menu.refresh,
                        '-',
                        menu.property
                    ];
                }
                else if (modulePerm.Write) {
                    menu = [
                        menu.$new,
                        menu.refresh,
                    ];
                }
                else if (perm.Admin) {
                    menu = [
                        menu.rename,
                        menu.$delete,
                        menu.refresh,
                        '-',
                        menu.property
                    ];
                }
                else {
                    menu = [
                        menu.refresh
                    ];
                }

                menu = Ext.create('Ext.menu.Menu', {
                    margin: '0 0 10 0',
                    items: menu
                });

                menu.showAt(e.getXY());
                menu.focus();
            }
        });
    },

    onContainerContextMenu: function (view, e, eOpts) {
        var me = this,
            modulePerm = me.modulePerm,
            menu;

        e.stopEvent();

        menu = {
            $new: {
                iconCls: 'yz-glyph yz-glyph-new',
                text: RS.$('BPA_AddGroup'),
                hidden: !modulePerm.Write,
                handler: function () {
                    me.view.addnew();
                }
            },
            refresh: {
                iconCls: 'yz-glyph yz-glyph-refresh',
                text: RS.$('All_Refresh'),
                handler: function () {
                    me.view.$refresh();
                }
            }
        };

        menu = Ext.create('Ext.menu.Menu', {
            margin: '0 0 10 0',
            items: [menu.$new, menu.refresh]
        });

        menu.showAt(e.getXY());
        menu.focus();
    }
});