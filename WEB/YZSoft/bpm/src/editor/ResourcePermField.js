
Ext.define('YZSoft.bpm.src.editor.ResourcePermField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.bpm.src.model.UserResourcePermision'],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.UserResourcePermision',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            viewConfig: {
                markDirty: false
            },
            flex: 1,
            height: 238,
            selModel: Ext.create('Ext.selection.CheckboxModel', { mode: 'SIMPLE' }),
            plugins: [me.cellEditing],
            defaults: {
                renderer: YZSoft.Render.renderString
            },
            columns: [
                { text: RS.$('All_Permision'), dataIndex: 'PermName', width: 100, editor: {
                    allowBlank: false
                }
                },
                { text: RS.$('All_DisplayName'), dataIndex: 'PermDisplayName', flex: 1, editor: {
                    allowBlank: true
                }
                },
                { text: RS.$('All_PermisionType'), dataIndex: 'PermType', width: 100, editor: {
                    xtype: 'combobox',
                    store: {
                        fields: ['name', 'value'],
                        data: [
                            { name: 'Module', value: 'Module' },
                            { name: 'Record', value: 'Record' }
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true
                }
                },
                { xtype: 'checkcolumn', text: RS.$('All_LeadshipToken'), dataIndex: 'LeadershipTokenEnabled', width: 100 },
            ]
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                var rec = me.grid.addRecords({ PermType: 'Module' })[0];
                me.cellEditing.startEdit(rec, 1);
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

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.apply({}, rec.data);
            delete v.RSID;
            delete v.id;
            rv.push(v);
        });
        return rv;
    }
});