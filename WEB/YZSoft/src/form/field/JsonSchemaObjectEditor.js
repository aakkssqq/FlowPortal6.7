
Ext.define('YZSoft.src.form.field.JsonSchemaObjectEditor', {
    extend: 'Ext.form.FieldContainer',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    types: [
        { value: 'string', name: RS.$('All_JSchema_DataType_string') },
        { value: 'number', name: RS.$('All_JSchema_DataType_number') },
        { value: 'integer', name: RS.$('All_JSchema_DataType_integer') },
        { value: 'boolean', name: RS.$('All_JSchema_DataType_boolean') },
        { value: 'datetime', name: RS.$('All_JSchema_DataType_datetime_datetime') },
        { value: 'date', name: RS.$('All_JSchema_DataType_datetime_date') }
    ],
    scrollable: false,
    typeColumn: {
    },
    arrayColumn: {
    },
    config: {
        value: null,
        childFieldColumnName: RS.$('JSchema_ChildFieldColumnName')
    },
    layout: 'fit',
    defaultRecord: {
        type: null,
        isArray: false
    },

    initComponent: function () {
        var me = this,
            types = me.types;

        me.storeDataType = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: types
        });

        me.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'type', 'isArray'],
            data: [],
            listeners: {
                datachanged: function (store, eOpts) {
                    me.regularStore();
                    me.fireEvent('change', me, me.getValue());
                }
            }
        });

        me.updateValue(me.value);
        me.regularStore();

        me.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        });

        me.dd = Ext.create('Ext.grid.plugin.DragDrop', {
            dragZone: {
                getDragText: function () {
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
                    focusenter: function () {
                        this.expand();
                    },
                    select: function() {
                        me.cellEditing.completeEdit();
                    }
                }
            };
        }

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            rowLines: true,
            hideHeaders: false,
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
                selectedItemCls:''
            },
            columns: [
                { text: me.childFieldColumnName, dataIndex: 'name', flex: 1, editor: me.editorName },
                Ext.apply({ text: RS.$('All_Type'), dataIndex: 'type', flex: 1, editor: me.editorType, renderer: me.renderDataType.bind(me) }, me.typeColumn),
                Ext.apply({ xtype: 'checkcolumn', text: RS.$('All_Array'), dataIndex: 'isArray', width:60 }, me.arrayColumn),
                {
                    xtype: 'actioncolumn',
                    width: 60,
                    align: 'right',
                    items: [{
                        glyph: 0xe62b,
                        iconCls: 'yz-action-listitem',
                        handler: function (view, rowIndex, colIndex, item, e, record) {
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

    renderDataType: function (value) {
        var me = this,
            rec = me.storeDataType.findRecord('value', value);

        if (rec)
            return rec.data.name;

        return value;
    },

    updateChildFieldColumnName: function (value) {
        if (this.grid)
            this.grid.getColumns()[0].setText(value);
    },

    updateValue: function (value) {
        var me = this,
            data = [];

        if (me.store) {
            Ext.Object.each(value, function (propertyName, value) {
                data.push({
                    name: propertyName,
                    type: value.type == 'array' ? value.items.type : value.type,
                    isArray: value.type == 'array',
                    tag: value
                });
            });

            me.store.setData(data);
        }
    },

    getValue: function () {
        var me = this,
            rv = {},
            text;

        me.store.each(function (record) {
            name = Ext.String.trim(record.data.name);
            type = record.data.type;

            if (Ext.isEmpty(name) || Ext.isEmpty(type))
                return;

            rv[name] = me.schemaFromRecord(record);
        });

        return rv;
    },

    schemaFromRecord: function (record) {
        var me = this,
            type = record.data.type,
            isArray = record.data.isArray,
            tag = record.data.tag,
            properties, rv;

        switch (type) {
            case 'string':
            case 'number':
            case 'integer':
            case 'boolean':
            case 'number':
                rv = {
                    type: type
                };
                break;
            case 'datetime':
                rv = {
                    type: 'string',
                    format: 'date-time'
                };
                break;
            case 'date':
                rv = {
                    type: 'string',
                    format: 'date'
                };
                break;
            case 'object':
                if (tag && tag.type == 'object')
                    properties = tag.properties;
                else if (tag && tag.type == 'array')
                    properties = tag.items.properties;
                else
                    properties = {};

                rv = {
                    type: 'object',
                    properties: properties
                };
                break;
        }

        if (isArray) {
            rv = {
                type: 'array',
                items: rv
            };
        }

        if (tag && tag.yzext)
            rv.yzext = tag.yzext;

        return rv;
    },

    regularStore: function () {
        var me = this,
            store = me.store,
            lastRec;

        if (me.storeDataType.getTotalCount() == 1) {
            store.each(function (record) {
                if (!Ext.isEmpty(record.data.name) && Ext.isEmpty(record.data.type))
                    record.set('type', me.storeDataType.first().data.value);
            });
        }

        lastRec = store.last(); //不可移到前面，前面代码会使得lastRec值变化
        if (!lastRec || !Ext.isEmpty(lastRec.data.name) || lastRec.data.type != me.defaultRecord.type) {
            store.add(Ext.apply({
                name: null
            }, me.defaultRecord));
        }
    }
});