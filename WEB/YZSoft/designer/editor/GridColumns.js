
Ext.define('YZSoft.designer.editor.GridColumns', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'vbox',
        align:'stretch'
    },

    initComponent: function () {
        var me = this,
            grid = me.grid,
            schemaColumns = Ext.Array.clone(me.schemaColumns),
            data = [];

        Ext.each(grid.columns, function (column) {
            var dataColumn = Ext.Array.findBy(me.schemaColumns, function (scolumn) {
                return scolumn.ColumnName == column.dataIndex;
            });

            if (dataColumn) {
                data.push({
                    columnName: dataColumn.ColumnName,
                    selected: true,
                    tag: dataColumn
                });

                Ext.Array.remove(schemaColumns, dataColumn);
            }       
        });

        Ext.each(schemaColumns, function (dataColumn) {
            data.push({
                columnName: dataColumn.ColumnName,
                selected: false,
                tag: dataColumn
            });
        });

        me.store = Ext.create('Ext.data.Store', {
            fields: ['columnName', 'selected'],
            data: data
        });

        me.dd = Ext.create('Ext.grid.plugin.DragDrop', {
            dragZone: {
                getDragText: function () {
                    var dragZone = this,
                        data = dragZone.dragData,
                        record = data.records[0];

                    return record.data.columnName;
                }
            }
        });

        me.grid = Ext.create('Ext.grid.Panel', {
            store: me.store,
            cls:'yz-grid-designer-property',
            rowLines: false,
            hideHeaders: true,
            viewConfig: {
                plugins: [me.dd],
                stripeRows: false,
                markDirty: false,
                overItemCls: '',
                selectedItemCls:''
            },
            columns: [
                { dataIndex: 'columnName', flex: 1 },
                { xtype: 'checkcolumn', dataIndex: 'selected', width: 40, align: 'center' },
                {
                    xtype: 'actioncolumn',
                    width: 30,
                    align: 'center',
                    items: [{
                        glyph: 0xeacb,
                        iconCls: ['yz-action-move yz-action-gray yz-size-icon-13']
                    }]
                }
            ]
        });

        me.items = [
            me.grid
        ];

        me.callParent();
    },

    getSelectedColumns: function () {
        var me = this,
            columns = [];

        me.store.each(function (record) {
            if (record.data.selected)
                columns.push(record.data);
        });

        return columns;
    }
});