/*
config
storeConfig
gridConfig
addBtnConfig
*/

Ext.define('YZSoft.bpm.src.editor.UsersField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.User'],

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.store = Ext.create('Ext.data.JsonStore', Ext.apply({
            model: 'YZSoft.bpm.src.model.User',
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
            selModel: { mode: 'SINGLE' },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_Account'), dataIndex: 'Account', flex: 1 },
                    { text: RS.$('All_UserDisplayName'), dataIndex: 'DisplayName', flex: 3 }
                ]
            }
        }, config.gridConfig || me.gridConfig));

        me.btnAdd = Ext.create('YZSoft.src.button.Button', Ext.apply({
            text: RS.$('All_Add'),
            handler: function () {
                YZSoft.SelUsersDlg.show({
                    fn: function (users) {
                        me.addbtnHandler(users);
                    }
                });
            }
        },config.addBtnConfig));

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Delete'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(me.readOnly || !me.grid.canDelete());
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
                this.setDisabled(me.readOnly || !me.grid.canMoveUp());
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
                this.setDisabled(me.readOnly || !me.grid.canMoveDown());
            },
            handler: function () {
                me.grid.moveSelectionDown();
            }
        });

        me.panel = Ext.create('Ext.panel.Panel', {
            width: 'auto',
            bodyStyle: 'background-color:transparent',
            padding: '0 0 0 10',
            layout: {
                type: 'vbox',
                pack: 'start',
                align: 'stretch'
            },
            border: false,
            defaults: {
                padding: '5 10',
                margin: '0 0 3 0'
            },
            items: [
                me.btnAdd,
                me.btnDelete,
                me.btnMoveUp,
                me.btnMoveDown
            ]
        });

        var cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setReadOnly: function (readOnly) {
        var me = this;

        me.readOnly = readOnly;
        me.btnAdd.setDisabled(readOnly);
        me.btnDelete.setDisabled(readOnly);
        me.btnMoveUp.setDisabled(readOnly);
        me.btnMoveDown.setDisabled(readOnly);
    },

    addbtnHandler: function (users) {
        this.grid.addRecords(users);
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