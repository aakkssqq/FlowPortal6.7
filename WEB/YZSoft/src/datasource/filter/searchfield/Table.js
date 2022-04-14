
Ext.define('YZSoft.src.datasource.filter.searchfield.Table', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.src.datasource.model.DSParam',
        'YZSoft.src.datasource.util.OP'
    ],
    config: {
        datasourceName: null,
        tableName: null
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.datasource.model.DSParam',
            listeners: {
                datachanged: function () {
                    me.fireEvent('change');
                }
            }
        });

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        me.editorOp = {
            xtype: 'combobox',
            store: Ext.create('Ext.data.Store', {
                fields: ['value', 'name'],
                data: []
            }),
            queryMode: 'local',
            displayField: 'name',
            valueField: 'op',
            editable: false,
            forceSelection: true,
            listeners: {
                beforeedit: function (context) {
                    var ops = YZSoft.src.datasource.util.OP.getOPs(context.record.data.dataType.name,true);
                    this.getStore().setData(ops);
                }
            }
        };

        me.editorValue = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            dlgConfig: {
                stepOwner: false,
                agentUser: false,
                taskInitiator: false,
                dayofweek: false,
                formfields: false
            },
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.setValueType(context.record.data.dataType.name);
                },
                selected: function (value) {
                    me.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.cellEditing.startEdit(this.context.record, this.context.column);
                }
            }
        };

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            border: true,
            viewConfig: {
                markDirty: false
            },
            flex: 1,
            plugins: [me.cellEditing],
            defaults: {
                renderer: YZSoft.Render.renderString
            },
            columns: [
                { xtype: 'rownumberer' },
                { text: RS.$('Designer_DataSource_ColumnName'), dataIndex: 'name', width: 160 },
                { text: RS.$('Designer_DataSource_DataType'), dataIndex: 'dataType', width: 120, formatter: 'dataType' },
                { text: RS.$('Designer_DataSource_OP'), dataIndex: 'op', width: 80, editor: me.editorOp, renderer: YZSoft.src.datasource.util.OP.renderOp },
                { text: RS.$('Designer_DataSource_CompareValue'), dataIndex: 'value', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorValue },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('Designer_DataSource_RemoveAllCondition'),
                    width: 98,
                    align: 'center',
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    items: [{
                        glyph: 0xe62b,
                        handler: function (view, rowIndex, colIndex, item, e, record) {
                            record.set('op', null);
                            record.set('value', null);
                        }
                    }]
                }
            ]
        });

        cfg = {
            layout: 'fit',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateTableName: function (newTableName) {
        var me = this,
            datasourceName = me.getDatasourceName(),
            tableName = newTableName,
            ds;

        if (Ext.isEmpty(datasourceName) || Ext.isEmpty(tableName)) {
            me.store.setData([]);
            return;
        }

        ds = Ext.create('YZSoft.src.datasource.Table', {
            datasourceName: datasourceName,
            tableName: tableName
        });

        ds.getParams({}, function (params) {

            Ext.Array.each(params, function (param) {
                param.op = '=';
            });

            if (!me.initDone) {
                me.applyFilter(params, me.value);
                me.initDone = true;
            }

            me.store.setData(params);
        }, function (action) {
            YZSoft.alert(Ext.String.format('{0}', action.result.errorMessage), function () {
            });
        });          
    },

    applyFilter: function (params,filter) {
        var me = this,
            filter = filter || {},
            filterItem;

        Ext.each(params, function (param) {
            filterItem = filter[param.name];
            if (filterItem) {
                Ext.apply(param, {
                    op: filterItem.op,
                    value: filterItem.value
                });
            }
        });
    },

    getValue: function () {
        var me = this,
            rv = {};

        if (!me.initDone)
            return me.value || {};

        this.store.each(function (rec) {
            var op = rec.data.op,
                value = rec.data.value;

            if (!Ext.isEmpty(op) && !Ext.isEmpty(value)) {
                rv[rec.data.name] = {
                    op: op,
                    value: value
                };
            }
        });

        return rv;
    }
});