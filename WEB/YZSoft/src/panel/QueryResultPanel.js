
Ext.define('YZSoft.src.panel.QueryResultPanel', {
    extend: 'Ext.panel.Panel',
    gridTemplate: {
        //sortableColumns: false
    },

    constructor: function (config) {
        var me = this,
            ds = config.ds,
            cfg;

        cfg = {
            layout:'card'
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    showResult: function (resultColumns, store) {
        var me = this,
            grid = me.createResultGrid(resultColumns, store);

        me.add(grid);
        me.setActiveItem(grid);

        if (me.grid)
            me.remove(me.grid, true);

        me.grid = grid;
    },

    createResultGrid: function (resultColumns, store) {
        var me = this,
            columns = [],
            grid, column;

        Ext.each(resultColumns, function (resultColumn) {
            column = {
                text: resultColumn.ColumnName,
                dataIndex: resultColumn.ColumnName
            };

            Ext.apply(column, me.getColumnDefaultCfg(resultColumn));

            columns.push(column);
        });

        grid = Ext.create('YZSoft.src.grid.QueryResultGrid', Ext.apply({
            store: store,
            columns: columns
        }, me.gridTemplate));

        return grid;
    },

    getColumnDefaultCfg: function (resultColumn) {
        switch (resultColumn.DataType.name) {
            case 'Decimal':
            case 'Double':
            case 'Single':
                return {
                    align: 'end',
                    dataFormat: {
                        type: 'number',
                        prefix: false,
                        thousands: false
                    }
                };
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                return {
                    align: 'end',
                    dataFormat: {
                        type: 'number',
                        prefix: false,
                        thousands: false,
                        decimal: false
                    }
                };
            case 'DateTime':
                return {
                    dataFormat: {
                        type: 'date',
                        format: 'Y-m-d H:i:s'
                    }
                };
            case 'String':
                return {
                    dataFormat: {
                        type: 'text'
                    }
                };
            case 'Boolean':
                return {
                    dataFormat: {
                        type: 'boolean'
                    }
                };
            case 'Binary':
                return {
                    dataFormat: {
                        type: 'binary'
                    }
                };
        }
    }
});