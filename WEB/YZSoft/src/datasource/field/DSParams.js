
Ext.define('YZSoft.src.datasource.field.DSParams', {
    extend: 'YZSoft.src.form.FieldContainer',
    requires: ['YZSoft.src.datasource.model.DSParam'],
    config: {
        value: null
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

        me.editorDefaultValue = {
            xclass: 'YZSoft.src.form.field.CodeField',
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
                    this.setValueType(context.record.data.dataType);
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
            border: false,
            viewConfig: {
                markDirty: false
            },
            flex: 1,
            height: 238,
            plugins: [me.cellEditing],
            defaults: {
                renderer: YZSoft.Render.renderString
            },
            columns: [
                { xtype: 'rownumberer' },
                { text: RS.$('All_Parameter'), dataIndex: 'name', width: 160 },
                { text: RS.$('All_Type'), dataIndex: 'dataType', width: 120, formatter: 'dataType', editor: {
                    xtype: 'combobox',
                    store: Ext.create('YZSoft.src.store.DataTypeSimpleStore'),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    forceSelection: true,
                    value2Record: function (cmb, value) {
                        var rv = null;

                        value = value || { name:'String', fullName:'System.String' };
                        cmb.getStore().each(function (rec) {
                            if (rec.data.value.fullName == value.fullName) {
                                rv = rec;
                                return false;
                            }
                        });

                        return rv;
                    }
                }},
                { text: RS.$('All_InitValue'), dataIndex: 'defaultValue', flex: 1, renderer: YZSoft.Render.renderCode, editor: me.editorDefaultValue },
                { xtype: 'checkcolumn', text: RS.$('Designer_DataSource_InnerParam'), dataIndex: 'internalParam', width:80}
            ]
        });

        cfg = {
            layout: 'fit',
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    setParams: function (paramNames) {
        var me = this;

        //remove
        var rms = []
        me.store.each(function (rec) {
            if (!Ext.Array.contains(paramNames, rec.data.name))
                rms.push(rec);
        });
        me.store.remove(rms);

        //add
        Ext.each(paramNames, function (paramName) {
            if (!me.store.getById(paramName)) {
                me.store.add({
                    name: paramName,
                    displayName: null,
                    dataType: null,
                    defaultValue:null,
                    desc: null,
                    supportOp: false,
                    internalParam: false
                });
            }
        });
    },

    setValue: function (value) {
        if (value)
            this.grid.addRecords(value, false);
    },

    getValue: function () {
        var rv = [];
        this.store.each(function (rec) {
            var v = Ext.apply({}, rec.data);
            rv.push(v);
        });
        return rv;
    }
});