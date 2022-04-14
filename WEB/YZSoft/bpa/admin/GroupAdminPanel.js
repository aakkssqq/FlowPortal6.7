
Ext.define('YZSoft.bpa.admin.GroupAdminPanel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.grouplist = Ext.create('YZSoft.bpa.admin.group.GroupListPanel', {
            maskTarget: me
        });

        me.pnlMenu = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_Navigate'),
            header: false,
            border: false,
            region: 'west',
            width: 240,
            scrollable: true,
            split: {
                cls: 'yz-splitter-light',
                size: 4,
                collapsible: true
            },
            bodyPadding: 10,
            style: 'background-color:#fff;',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.grouplist, { xtype: 'tbfill'}],
            listeners: {
                element: 'body',
                contextmenu: function (e, t, eOpts) {
                    var menu;

                    e.stopEvent();
                    menu = Ext.create('Ext.menu.Menu', {
                        margin: '0 0 10 0',
                        items: [{
                            iconCls: 'yz-glyph yz-glyph-new',
                            text: RS.$('BPA_AddGroup'),
                            handler: function () {
                                me.grouplist.addnew();
                            }
                        }, {
                            iconCls: 'yz-glyph yz-glyph-refresh',
                            text: RS.$('All_Refresh'),
                            handler: function () {
                                me.grouplist.$refresh();
                            }
                        }]
                    });

                    menu.showAt(e.getXY());
                    menu.focus();

                }
            }
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlMenu, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            activate: function () {
                if (me.grouplist.store.isLoaded()) {
                    me.grouplist.$refresh($S.loadMask.activate);
                }
            }
        });

        me.grouplist.store.on({
            update: function (store, record, operation, modifiedFieldNames, details, eOpts) {
                var sm = me.grouplist.grid.getSelectionModel();

                if (sm.isSelected(record))
                    me.updateGroupSummaryPanel(record);
            },
            refresh: function (store, eOpts) {
                var sm = me.grouplist.grid.getSelectionModel(),
                    recs = sm.getSelection(),
                    rec = recs[0];

                if (rec)
                    me.updateGroupSummaryPanel(rec);
            }
        });

        me.grouplist.store.on({
            single: true,
            load: function (store, records, successful, operation, eOpts) {
                if (successful && records.length != 0) {
                    me.grouplist.grid.getSelectionModel().select(records[0]);
                }
            }
        });

        me.grouplist.grid.on({
            selectionchange: function (sm, selected, eOpts) {
                if (selected.length == 0) {
                    me.pnlModule.hide();
                    return;
                }

                me.pnlModule.show();
                var record = selected[0];
                var pnl = me.pnlModule.showModule({
                    xclass: 'YZSoft.bpa.admin.group.GroupPanel',
                    config: {
                        groupInfo: {
                            Group: record.data,
                            Member: {},
                            Perm: {
                                Admin: true,
                                Edit: true,
                                Auth: true,
                                Read: true,
                                FullControl: true
                            }
                        }
                    },
                    match: function (item) {
                        return item.groupInfo.Group.GroupID == record.data.GroupID;
                    },
                    callback: function (pnl, exist) {
                        pnl.pnlMember.store.load({
                            params: {
                                groupid: record.data.GroupID
                            }
                        });

                        if (exist)
                            me.updateGroupSummaryPanel(record);
                    }
                });
            }
        });
    },

    updateGroupSummaryPanel: function (record) {
        var me = this,
            pnl = me.pnlModule.getActiveItem();

        if (pnl) {
            pnl.cmpGroupName.update({
                url: record.data.ImageUrl,
                groupid: record.data.GroupID,
                name: record.data.Name
            });
        }
    }
});