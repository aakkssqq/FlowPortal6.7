
Ext.define('YZSoft.src.form.field.StringListField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.bpm.src.model.Name'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    columnText: '',

    constructor: function (config) {
        var me = this,
            config = config || {},
            columnText = config.columnText || me.columnText,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.Name',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                validateedit: function (editor, context, eOpts) {

                    if (!context.value) {
                        context.cancel = true;
                        return;
                    }

                    me.store.each(function (rec) {
                        if (rec !== context.record && String.Equ(rec.data.name, context.value)) {
                            context.cancel = true;
                            return false;
                        }
                    });
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            flex: 1,
            border: true,
            selModel: { mode: 'SINGLE' },
            viewConfig: {
                stripeRows: false,
                markDirty: false
            },
            plugins: [me.cellEditing],
            columns: {
                defaults: {
                    sortable: false,
                    menuDisabled: true
                },
                items: [
                    { text: columnText, dataIndex: 'name', flex: 1, editor: {
                        allowBlank: false
                    }
                    }]
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                var rec = me.grid.addRecords({ name: 'name' })[0];
                me.cellEditing.startEdit(rec, 0);
            }
        });

        me.btnDelete = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Delete'),
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

        cfg = {
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setValue: function (value) {
        var me = this,
            data = [];

        Ext.each(value, function (item) {
            data.push({
                name: item
            });
        });

        me.store.removeAll();
        me.store.add(data);
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.store.each(function (rec) {
            rv.push(rec.data.name);
        });

        return rv;
    }
});