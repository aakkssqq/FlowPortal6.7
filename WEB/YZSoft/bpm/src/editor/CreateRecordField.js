/*
config
interfaceStepNames
*/

Ext.define('YZSoft.bpm.src.editor.CreateRecordField', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.bpm.src.model.CreateRecord'
    ],
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    config: {
        value: []
    },

    constructor: function (config) {
        var me = this;

        config.buttons = config.buttons || {};

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.bpm.src.model.CreateRecord',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            flex: 1,
            selModel: { mode: 'SINGLE' },
            columns: {
                defaults: {
                    renderer: YZSoft.Render.renderString
                },
                items: [
                    { text: RS.$('All_Table'), dataIndex: 'TableName', width: 118 },
                    { text: RS.$('All_FillWith'), dataIndex: 'Columns', flex: 1, scope: me, renderer: 'renderFill' },
                    { text: RS.$('All_CreateCond'), dataIndex: 'CreateRecordType', width: 118, scope: me, renderer: 'renderType' },
                ]
            },
            listeners: {
                itemdblclick: function (grid, record) {
                    me.edit(record);
                }
            }
        });

        me.btnAdd = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Add'),
            handler: function () {
                Ext.create('YZSoft.bpm.src.dialogs.CreateRecordDlg', {
                    title: Ext.String.format('{0} - {1}', RS.$('All_CreateRecord'), me.tableIdentity.TableName),
                    autoShow: true,
                    tables: me.tables,
                    tableIdentity: me.tableIdentity,
                    value: {
                        CreateRecordType: 'FirstTimeEnterStep',
                        Columns: []
                    },
                    fn: function (value) {
                        me.grid.addRecords(value);
                    }
                });
            }
        });

        me.btnEdit = Ext.create('YZSoft.src.button.Button', {
            text: RS.$('All_Edit'),
            store: me.store,
            sm: me.grid.getSelectionModel(),
            updateStatus: function () {
                this.setDisabled(!me.grid.canEdit());
            },
            handler: function () {
                var recs = me.grid.getSelectionModel().getSelection();
                if (recs.length == 1)
                    me.edit(recs[0]);
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

        me.panel = Ext.create('Ext.container.Container', {
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
                me.btnEdit,
                me.btnDelete,
                me.btnMoveUp,
                me.btnMoveDown
            ]
        });

        var cfg = {
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [me.grid, me.panel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    edit: function (rec) {
        var me = this;

        Ext.create('YZSoft.bpm.src.dialogs.CreateRecordDlg', {
            title: Ext.String.format('{0} - {1}', RS.$('All_CreateRecord'), me.tableIdentity.TableName),
            autoShow: true,
            tables: me.tables,
            tableIdentity: me.tableIdentity,
            value: Ext.apply({}, rec.data),
            fn: function (value) {
                Ext.apply(rec.data, value);
                rec.commit();
            }
        });
    },

    renderFill: function (value, metaData, rec) {
        var rv = [];

        Ext.each(value, function (column) {
            if (!Ext.isEmpty(column.DefaultValue))
                rv.push(Ext.String.format('{0}={1}', column.ColumnName, YZSoft.Render.renderCode5(column.DefaultValue, false)));
        });

        return rv.join(',');
    },

    renderType: function (value, metaData, rec) {
        return RS.$('All_Enum_CreateRecordType_' + value);
    },

    setValue: function (value) {
        this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [],
            data;

        this.store.each(function (rec) {
            data = Ext.apply({}, rec.data);
            delete data.id;
            rv.push(data);
        });
        return rv;
    }
});