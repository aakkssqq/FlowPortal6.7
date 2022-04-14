
Ext.define('YZSoft.bpa.library.LibrariesPanel', {
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
                rsid: YZSoft.WellKnownRSID.BPALibraryRoot,
                perms: 'Write'
            },
            success: function (action) {
                me.modulePerm = action.result;
            }
        });

        me.titlebar = Ext.create('YZSoft.bpa.library.toolbar.LibrariesTitleBar', {
            region: 'north',
            height: 64,
            newBtnConfig: {
                hidden: !me.modulePerm.Write
            }
        });

        me.caption = Ext.create('Ext.Component', {
            region: 'north',
            cls: 'bpa-caption',
            html: RS.$('BPA_AllLibrary')
        });

        me.view = Ext.create('YZSoft.bpa.library.libs.LibrariesView', {
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
            xclass: 'YZSoft.bpa.library.LibraryPanel',
            config: {
                libid: record.data.LibID
            },
            match: function (item) {
                return item.libid == record.data.LibID;
            }
        });
    },

    onItemContextMenu: function (view, record, item, index, e, eOpts) {
        var me = this,
            sm = view.getSelectionModel(),
            modulePerm = me.modulePerm,
            menu;

        e.stopEvent();
        sm.select(record);

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/SystemAccessControl.ashx'),
            params: {
                method: 'CheckPermisions',
                rsid: record.getRsid(),
                perms: 'Write,AssignPermision'
            },
            success: function (action) {
                var perm = action.result;

                menu = {
                    $new: {
                        iconCls: 'yz-glyph yz-glyph-new',
                        text: RS.$('BPA_AddLib'),
                        disabled: !modulePerm.Write,
                        handler: function () {
                            me.view.addnew();
                        }
                    },
                    rename: {
                        iconCls: 'yz-glyph yz-glyph-rename',
                        text: RS.$('All_Rename'),
                        disabled: !perm.Write,
                        handler: function () {
                            me.view.startEdit(record, {
                                maskTarget: me
                            });
                        }
                    },
                    $delete: {
                        iconCls: 'yz-glyph yz-glyph-delete',
                        text: RS.$('All_Delete'),
                        disabled: !perm.Write,
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
                        handler: function () {
                            me.view.edit(record, {
                                perm: perm
                            });
                        }
                    }
                };

                if (modulePerm.Write) {
                    if (perm.Write) {
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
                    else if (perm.AssignPermision) {
                        menu = [
                            menu.$new,
                            '-',
                            menu.refresh,
                            menu.property
                        ];
                    }
                    else {
                        menu = [
                            menu.$new,
                            menu.refresh
                        ];
                    }
                }
                else {
                    if (perm.Write) {
                        menu = [
                            menu.rename,
                            menu.$delete,
                            menu.refresh,
                            '-',
                            menu.property
                        ];
                    }
                    else if (perm.AssignPermision) {
                        menu = [
                            menu.refresh,
                            menu.property
                        ];
                    }
                    else {
                        menu = [
                            menu.refresh
                        ];
                    }
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
                text: RS.$('BPA_AddLib'),
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