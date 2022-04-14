/*
config
storeConfig
gridConfig
*/

Ext.define('YZSoft.bpm.src.editor.SupervisorField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.Supervisor'],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.store = Ext.create('Ext.data.JsonStore', Ext.apply({
            model: 'YZSoft.bpm.src.model.Supervisor',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        }, config.storeConfig || me.storeConfig));

        me.grid = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            border: true,
            flex: 1,
            selModel: { mode: 'MULTI' },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString,
                    sortable: false
                },
                items: [
                    { text: RS.$('All_Account'), dataIndex: 'UserAccount', width: 120 },
                    { text: RS.$('All_UserDisplayName'), dataIndex: 'UserFullName', width: 80 },
                    { text: RS.$('All_BelongOU'), dataIndex: 'MemberFullName', flex: 1 },
                    { text: RS.$('All_FGYW'), dataIndex: 'FGYWs', width: 120, renderer: me.renderFGYWs }
                ]
            },
            listeners: {
                itemdblclick: function (grid, rec) {
                    me.edit(rec);
                }
            }
        }, config.gridConfig || me.gridConfig));

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                YZSoft.SelMemberDlg.show({
                    fn: function (user) {
                        if (!user.Member)
                            return;

                        var spv = {
                            UserAccount: user.Member.UserAccount,
                            UserFullName: user.Member.UserDisplayName,
                            MemberFullName: user.Member.FullName,
                            FGYWEnabled: false,
                            FGYWs: []
                        };

                        me.grid.addRecords(spv, true);
                    }
                });
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Remove'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canDelete());
            },
            handler: function () {
                me.grid.removeAllSelection();
            }
        });

        me.btnMoveUp = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveUp'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveUp());
            },
            handler: function () {
                me.grid.moveSelectionUp();
            }
        });

        me.btnMoveDown = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_MoveDown'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canMoveDown());
            },
            handler: function () {
                me.grid.moveSelectionDown();
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Edit'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            margin: 0,
            updateStatus: function () {
                this.setDisabled(!me.grid.canEdit());
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();

                if (recs.length == 1)
                    me.edit(recs[0]);
            }
        });

        me.panel = Ext.create('Ext.panel.Panel', {
            width: 'auto',
            bodyStyle: 'background-color:transparent',
            padding: '3 0 0 0',
            layout: {
                type: 'hbox',
                pack: 'start'
            },
            border: false,
            defaults: { padding: '3 20', margin: '0 3 0 0' },
            items: [
                me.btnAdd,
                me.btnDelete,
                me.btnMoveUp,
                me.btnMoveDown, {
                    xtype: 'tbfill'
                },
                me.btnEdit
            ]
        });

        var cfg = {
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderFGYWs: function (value, metaData, rec) {
        if (rec.data.FGYWEnabled)
            return YZSoft.Render.renderString(value.join(','));
        else
            return RS.$('All_AllYW');
    },

    edit: function (rec) {
        Ext.create('YZSoft.bpm.src.dialogs.SupervisorDlg', {
            autoShow: true,
            title: Ext.String.format('{0} - {1}', RS.$('All_Supervisor'), rec.data.UserFullName),
            supervisor: rec.data,
            fn: function (supervisor) {
                Ext.apply(rec.data, supervisor);
                rec.commit();
            }
        });
    },

    setValue: function (value) {
        this.store.removeAll();
        this.store.add(value);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            rv.push(rec.data);
        });
        return rv;
    }
});