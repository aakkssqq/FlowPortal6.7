
Ext.define('YZSoft.src.form.field.ExtAttributes', {
    extend: 'YZSoft.src.form.FieldContainer',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    types: [
        { value: 'String', name: RS.$('All_JSchema_DataType_string') },
        { value: 'Int32', name: RS.$('All_JSchema_DataType_integer') },
        { value: 'Decimal', name: RS.$('All_JSchema_DataType_number') },
        { value: 'Boolean', name: RS.$('All_JSchema_DataType_boolean') },
        { value: 'DateTime', name: RS.$('All_JSchema_DataType_datetime') }
    ],
    selectOnFocus: true,
    dateFormat: 'Y-m-d',
    typeColumn: {
    },
    config: {
        value: null
    },

    constructor: function(config) {
        var me = this;

        if (config.types && Ext.isString(config.types)) {
            config.types = Ext.Array.findBy(me.types, function(type) {
                return type.value == config.types;
            });
        }

        me.callParent(arguments);
    },

    initComponent: function() {
        var me = this,
            types = me.types,
            selectOnFocus = me.selectOnFocus;

        if (Ext.isString(types)) {
            types
        }

        me.storeDataType = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: types
        });

        me.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'type', 'value'],
            data: [],
            listeners: {
                datachanged: function(store, eOpts) {
                    me.regularStore();
                    me.fireEvent('change', me, me.getValue());
                }
            }
        });

        me.updateValue(me.value);
        me.regularStore();

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,
            listeners: {
                scope: me,
                validateedit: 'onValidateEdit'
            }
        });

        me.dd = Ext.create('Ext.grid.plugin.DragDrop', {
            dragZone: {
                getDragText: function() {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.text || record.data.value;
                }
            }
        });

        me.editorName = {
            xtype: 'textfield'
        };

        if (me.storeDataType.getTotalCount() == 1) {
            me.editorType == null;
        }
        else {
            me.editorType = {
                xtype: 'combo',
                store: me.storeDataType,
                valueField: 'value',
                displayField: 'name',
                editable: false,
                listeners: {
                    focusenter: function() {
                        this.expand();
                    },
                    select: function() {
                        me.cellEditing.completeEdit();
                    }
                }
            };
        }

        me.valueEditors = {
            String: new Ext.grid.CellEditor({
                field: Ext.create('Ext.form.field.Text', {
                    selectOnFocus: selectOnFocus
                })
            }),
            Int32: Ext.create('Ext.grid.CellEditor', {
                field: new Ext.form.field.Number({
                    selectOnFocus: selectOnFocus,
                    allowDecimals: false
                })
            }),
            Decimal: Ext.create('Ext.grid.CellEditor', {
                field: new Ext.form.field.Number({
                    selectOnFocus: selectOnFocus
                })
            }),
            Boolean: Ext.create('Ext.grid.CellEditor', {
                field: new Ext.form.field.ComboBox({
                    editable: false,
                    store: [[true, RS.$('All_Yes')], [false, RS.$('All_No')]],
                    listeners: {
                        focusenter: function() {
                            this.expand();
                        },
                        select: function() {
                            me.cellEditing.completeEdit();
                        }
                    }
                })
            }),
            DateTime: Ext.create('Ext.grid.CellEditor', {
                field: new Ext.form.field.Date({
                    editable: false,
                    listeners: {
                        focusenter: function() {
                            this.expand();
                        },
                        select: function() {
                            me.cellEditing.completeEdit();
                        }
                    }
                })
            })
        };

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            rowLines: true,
            bodyBorder: false,
            sortableColumns: false,
            enableColumnMove: false,
            enableColumnHide: false,
            enableColumnResize: true,
            plugins: [me.cellEditing],
            viewConfig: {
                plugins: [
                    me.dd
                ],
                stripeRows: false,
                markDirty: false,
                overItemCls: '',
                selectedItemCls: ''
            },
            columns: [
                { text: RS.$('All_Property'), dataIndex: 'name', flex: 3, editor: me.editorName },
                Ext.apply({ text: RS.$('All_Type'), dataIndex: 'type', flex: 3, editor: me.editorType, renderer: me.renderDataType.bind(me) }, me.typeColumn),
                { text: RS.$('All_Value'), dataIndex: 'value', flex: 4, getEditor: me.getValueEditor.bind(me), renderer:me.renderValue.bind(me) },
                {
                    xtype: 'actioncolumn',
                    width: 80,
                    align: 'right',
                    items: [{
                        glyph: 0xe62b,
                        iconCls: 'yz-action-listitem',
                        handler: function(view, rowIndex, colIndex, item, e, record) {
                            if (record !== me.store.last())
                                me.store.remove(record);
                        }
                    }, {
                        glyph: 0xeacb,
                        iconCls: ['yz-action-move yz-action-listitem']
                    }]
                }
            ]
        });

        me.items = [
            me.grid
        ];

        me.callParent();
    },

    renderDataType: function(value) {
        var me = this,
            rec = me.storeDataType.findRecord('type', value);

        if (rec)
            return rec.data.name;

        return value;
    },

    renderValue: function(value) {
        var me = this;

        if (Ext.isDate(value))
            return Ext.Date.format(value, me.dateFormat);

        return value;
    },

    updateValue: function(value) {
        var me = this,
            data = [];

        if (me.store) {
            Ext.Array.each(value, function(item) {
                data.push({
                    name: item.name,
                    type: item.type,
                    value: me.changeType(item.value, item.type)
                });
            });

            me.store.setData(data);
        }
    },

    getValue: function() {
        var me = this,
            rv = [],
            text;

        me.store.each(function(record) {
            name = Ext.String.trim(record.data.name),
                type = record.data.type,
                value = record.data.value;

            if (Ext.isString(value))
                value = Ext.String.trim(value);

            if (Ext.isEmpty(name) || Ext.isEmpty(type))
                return;

            rv.push({
                name: name,
                type: type,
                value: me.changeType(value,type)
            });
        });

        return rv;
    },

    getValueEditor: function(record, column) {
        var me = this,
            type = record.data.type;

        return me.valueEditors[type];
    },

    onValidateEdit: function(editor, context, eOpts) {
        var me = this,
            rec = context.record,
            orgType = context.originalValue;
            newType = context.value;

        if (orgType == newType)
            return;

        if (context.field != 'type')
            return;

        rec.set('value', me.changeType(rec.data.value, newType));
    },

    changeType: function(value, type) {
        var me = this;

        switch (type) {
            case 'String':
                if (Ext.isDate(value))
                    return Ext.Date.format(value, me.dateFormat);
                return (value || '').toString();
            case 'Int32':
                return Ext.Number.parseInt(value);
            case 'Decimal':
                return Ext.Number.parseFloat(value);
            case 'Boolean':
                return !!value;
            case 'DateTime':
                if (Ext.isDate(value))
                    return value;
                else if (Ext.isString(value))
                    return Ext.Date.parse(value, me.dateFormat) || Ext.Date.parse(value, me.dateFormat + ' H:i:s');
                else
                    return null;
        }
    },

    regularStore: function () {
        var me = this,
            store = me.store,
            lastRec;

        if (me.storeDataType.getTotalCount() == 1) {
            store.each(function(record) {
                if (!Ext.isEmpty(record.data.name) && Ext.isEmpty(record.data.type))
                    record.set('type', me.storeDataType.first().data.value);
            });
        }

        lastRec = store.last(); //不可移到前面，前面代码会使得lastRec值变化
        if (!lastRec || !Ext.isEmpty(lastRec.data.name) || !Ext.isEmpty(lastRec.data.type) || !Ext.isEmpty(lastRec.data.value)) {
            store.add({
                name: null,
                type: null,
                value: null
            });
        }
    }
});