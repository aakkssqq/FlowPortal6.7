
Ext.define('YZSoft.src.form.field.ListItems', {
    extend: 'Ext.form.FieldContainer',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    config: {
        value:null
    },

    initComponent: function () {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            fields: ['value', 'text'],
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

        me.editorValue = {
            xtype: 'textfield',
            cls:'yz-size-s'
        };

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            cls:'yz-grid-listitems',
            rowLines: true,
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
                { text: RS.$('All_ListItems_TextColumn'), dataIndex: 'text', flex: 1, editor: me.editorValue },
                { text: RS.$('All_ListItems_ValueColumn'), dataIndex: 'value', flex: 1, editor: me.editorValue },
                {
                    xtype: 'actioncolumn',
                    width: 44,
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

    updateValue: function (value) {
        var me = this,
            data = [];

        if (me.store) {
            Ext.Array.each(value, function (item) {
                data.push({
                    value: item.value,
                    text: item.text
                });
            });

            me.store.setData(data);
        }
    },

    getValue: function () {
        var me = this,
            rv = [],
            text,value;

        me.store.each(function (record) {
            text = Ext.String.trim(record.data.text);
            value = Ext.String.trim(record.data.value);

            if (Ext.isEmpty(text) && Ext.isEmpty(value))
                return;

            rv.push({
                text: text,
                value: value
            });
        });

        return rv;
    },

    regularStore: function () {
        var me = this,
            store = me.store,
            lastRec = store.last();

        if (!lastRec || !Ext.isEmpty(lastRec.data.value) || !Ext.isEmpty(lastRec.data.text)) {
            store.add({
                value: null,
                text: null
            });
        }
    }
});