
Ext.define('YZSoft.bpm.org.admin.SearchResultPanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.bpm.src.model.MemberExt'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.MemberExt',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: {
                    method: 'SearchMember',
                    includeDisabledUser: true,
                    defaultPosition: true
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            border: false,
            region: 'center',
            store: me.store,
            selModel: { mode: 'MULTI' },
            columns: {
                defaults: {
                    sortable: false,
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { xtype: 'rownumberer', renderer: null },
                    { text: RS.$('All_BelongOU'), dataIndex: 'parentouFullNameFriendly', width: 360 },
                    { text: RS.$('All_Account'), dataIndex: 'Account', width: 120 },
                    { text: RS.$('All_UserDisplayName'), dataIndex: 'DisplayName', width: 120 },
                    { text: RS.$('All_MemberLevel'), dataIndex: 'UserLevel', width: 68, align: 'center' },
                    { text: RS.$('All_LeaderTitle'), dataIndex: 'LeaderTitle', width: 160, align: 'center' },
                    { text: '', flex: 1, align: 'center', draggable: false, menuDisabled: true },
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
                                return record.data.Disabled || record.data.IsDefaultPosition;
                            },
                            handler: function (grid, rowIndex, colIndex, item, e, record) {
                                if (me.isWritable())
                                    me.setDefaultPosition(record);
                            }
                        }, {
                            glyph: 0xead0,
                            iconCls: 'yz-size-icon-13 yz-action-defaultposition-yes',
                            isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                                return record.data.Disabled || !record.data.IsDefaultPosition;
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
                itemclick: function (view, record, item, index, e, eOpts) {
                    if (e.getTarget('.x-action-col-icon'))
                        return;

                    me.fireEvent('gotoclick', record.data.parentouFullNameFriendly, record.data.Account);
                },
                containercontextmenu: function (view, e, eOpts) {
                    e.stopEvent();
                },
                itemcontextmen: function (view, record, item, index, e, eOpts ) {
                    e.stopEvent();
                }
            }
        });

        cfg = {
            closable: true,
            closeAction:'hide',
            border: false,
            layout: 'border',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope:me,
            searchclick: 'onSearchClick',
            clearclick:'onClearClick'
        });

        Ext.getDoc().on({
            userdefaultpositionchanged: function (uid, memberfullname) {
                var store = me.store;

                store.each(function (rec) {
                    if (rec.data.Account == uid)
                        rec.set('IsDefaultPosition', rec.data.MemberFullName == memberfullname);
                });
            }
        });
    },

    onSearchClick: function (kwd) {
        var me = this,
            title = Ext.String.format(RS.$('All_OrgUserPanel_SearchUserResult'), kwd),
            doSearch;

        doSearch = function () {
            var extparams = me.store.getProxy().getExtraParams();

            me.setTitle(title);

            Ext.apply(extparams, {
                kwd: kwd
            });

            me.store.load();
        };

        if (me.hidden) {
            me.show(null, function () {
                doSearch();
            });
        }
        else {
            doSearch();
        }
    },

    setDefaultPosition: function (rec) {
        var me = this,
            uid = rec.data.Account,
            memberfullname = rec.data.MemberFullName;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/OrgAdmin.ashx'),
            params: {
                method: 'SetUserDefaultPosition',
                uid: uid,
                memberFullName: memberfullname
            },
            waitMsg: {
                target: me
            },
            success: function (result) {
                Ext.getDoc().fireEvent('userdefaultpositionchanged', uid, memberfullname);
            }
        });
    },

    onClearClick: function () {

    }
});
