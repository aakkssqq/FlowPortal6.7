/*
* initAccounts
* initUsers
* recentlyPanelConfig
* getRootOUsType
* srcoupath
*/

Ext.define('YZSoft.bpm.src.dialogs.SelMembersDlg', {
    extend: 'Ext.window.Window', //111222
    requires: [
        'YZSoft.bpm.src.ux.Render',
        'YZSoft.bpm.src.model.MemberExt',
        'Ext.util.Format'
    ],
    title: RS.$('All_SelUser'),
    layout: 'border',
    width: 870,
    height: 530,
    minWidth: 870,
    minHeight: 530,
    modal: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.srcPanel = Ext.create('YZSoft.bpm.src.panel.SelMemberPanel', {
            region: 'center',
            border: true,
            tree: {
                getRootOUsType: config.getRootOUsType,
                srcoupath: config.srcoupath
            },
            grid: {
                width: 230,
                selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
                viewConfig: {
                    stripeRows: false,
                    selectedItemCls: 'yz-grid-item-select-flat'
                }
            }
        });

        me.tagStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            model: 'YZSoft.bpm.src.model.MemberExt',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPM/Org.ashx'),
                extraParams: { method: 'GetUsersFromAccounts' },
                reader: {
                    rootProperty: 'children'
                }
            },
            listeners: {
                datachanged: function () {
                    me.updateStatus()
                }
            }
        });

        me.tagGrid = Ext.create('Ext.grid.Panel', {
            store: me.tagStore,
            cls: 'yz-grid-actioncol-hidden',
            hideHeaders: true,
            selModel: { mode: 'MULTI' },
            viewConfig: {
                stripeRows: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { text: '', dataIndex: 'Account', align: 'left', flex: 1, renderer: me.renderUser },
                    {
                        xtype: 'actioncolumn',
                        width: 38,
                        align: 'center',
                        items: [{
                            glyph: 0xe62b,
                            iconCls: 'yz-action-delete-msel',
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                me.tagGrid.getStore().remove(record);
                            }
                        }]
                    }
                ]
            },
            listeners: {
                rowdblclick: function (grid, record, tr, rowIndex, e, eOpts) {
                    me.tagStore.remove(record);
                },
                selectionchange: function () {
                    me.updateStatus()
                },
                drop: function () {
                    me.btnMoveUp.updateStatus();
                    me.btnMoveDown.updateStatus();
                }
            }
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xea4f,
            sm: me.tagGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.tagGrid.canMoveUp());
            },
            handler: function () {
                me.tagGrid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            glyph: 0xe601,
            sm: me.tagGrid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.tagGrid.canMoveDown());
            },
            handler: function () {
                me.tagGrid.moveSelectionDown();
            }
        });

        me.tagPanel = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_SelUser_TagPanelTitle'),
            border: true,
            region: 'east',
            layout: 'fit',
            width: 230,
            header: {
                defaults: {
                    cls: ['yz-btn-flat', 'yz-btn-tool-hot'],
                },
                items: [me.btnMoveUp, me.btnMoveDown]
            },
            items: [me.tagGrid]
        });

        me.optBar = Ext.create('YZSoft.src.toolbar.SelectionOptBar', {
            region: 'east'
        });

        me.selectionManager = Ext.create('YZSoft.src.ux.RecordSelection', {
            srcGrid: me.srcPanel.grid,
            tagGrid: me.tagGrid,
            dragGroup: 'Member',
            getDragText: function (record) {
                return Ext.util.Format.text(record.data.DisplayName || record.data.Account);
            }
        });

        me.btnOK = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_OK'),
            cls:'yz-btn-default',
            disabled: true,
            handler: function () {
                me.onOK();
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            items: [me.srcPanel, me.optBar, me.tagPanel],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderUser: function (value, metaData, record) {
        return YZSoft.bpm.src.ux.Render.getUserFriendlyName(record.data.Account, record.data.DisplayName);
    },

    onOK: function () {
        var me = this,
            recs = me.tagStore.getRange(),
            users = [];

        Ext.each(recs, function (rec) {
            users.push(rec.data);
        });

        var params = {
            method: 'CheckUser',
            addtoRecently: true,
            count: users.length
        };

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            params['uid' + i] = user.Account;
            params['member' + i] = user.MemberFullName;
        }

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Employee.ashx'),
            params: params,
            scope: this,
            success: function (action) {
                me.closeDialog(users);
            },
            failure: function (action) {
                alert(action.result.errorMessage);
            }
        });
    },

    show: function (config) {
        var me = this,
            config = config || {},
            title = config.title,
            fn = config.fn,
            scope = config.scope

        if (title)
            me.setTitle(title);

        if (fn) {
            me.fn = fn;
            me.scope = scope;
        }

        me.srcPanel.grid.getSelectionModel().deselectAll();

        var initAccounts = config.initAccounts || me.initAccounts,
            initUsers = config.initUsers || me.initUsers;

        delete me.initAccounts;
        delete me.initUsers;

        if (!initAccounts) {
            initAccounts = [];
            if (initUsers) {
                Ext.each(initUsers, function (user) {
                    initAccounts.push(user.Account);
                });
            }
        }

        if (Ext.isString(initAccounts))
            initAccounts = [initAccounts];

        //选中用户列表是否修改过
        var modified = false;
        if (initAccounts.length != me.tagStore.getCount()) {
            modified = true;
        }
        else {
            for (var i = 0; i < initAccounts.length; i++) {
                if (initAccounts[i] != me.tagStore.getAt(i).data.Account)
                    modified = true;
            }
        }

        //选中用户列表已修改才再加载
        if (modified) {
            me.btnOK.setDisabled(true);
            me.tagStore.removeAll();

            if (initAccounts.length != 0) {
                var params = {};
                params.Count = initAccounts.length;
                for (var i = 0; i < initAccounts.length; i++) {
                    params["Account" + i] = initAccounts[i];
                };

                me.tagStore.load({ params: params });
            }
        }

        me.callParent();
    },

    updateStatus: function () {
        var me = this;

        me.btnOK.setDisabled(me.tagStore.getCount() == 0);
    }
});
