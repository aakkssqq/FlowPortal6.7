
Ext.define('YZSoft.src.datasource.filter.searchfield.Procedure', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: [
        'YZSoft.src.datasource.model.DSParam'
    ],
    config: {
        datasourceName: null,
        procedureName: null
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
                { text: RS.$('Designer_DataSource_ParamName'), dataIndex: 'name', width: 160 },
                { text: RS.$('All_Type'), dataIndex: 'dataType', width: 120, formatter: 'dataType' },
                { text: RS.$('Designer_DataSource_FillValue'), dataIndex: 'value', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorValue },
                {
                    xtype: 'actioncolumn',
                    text: RS.$('Designer_DataSource_RemoveAllParams'),
                    width: 98,
                    align: 'center',
                    sortable: false,
                    draggable: false,
                    menuDisabled: true,
                    items: [{
                        glyph: 0xe62b,
                        handler: function (view, rowIndex, colIndex, item, e, record) {
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

    updateProcedureName: function (newProcedureName) {
        var me = this,
            datasourceName = me.getDatasourceName(),
            procedureName = newProcedureName,
            ds;

        if (Ext.isEmpty(datasourceName) || Ext.isEmpty(procedureName)) {
            me.store.setData([]);
            return;
        }

        ds = Ext.create('YZSoft.src.datasource.Procedure', {
            datasourceName: datasourceName,
            procedureName: procedureName
        });

        ds.getParams({}, function (params) {

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
            var value = rec.data.value;

            if (!Ext.isEmpty(value)) {
                rv[rec.data.name] = {
                    op: '=',
                    value: value
                };
            }
        });

        return rv;
    }
});