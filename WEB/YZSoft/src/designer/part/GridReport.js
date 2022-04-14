
Ext.define('YZSoft.src.designer.part.GridReport', {
    extend: 'YZSoft.src.designer.part.GridAbstract',
    requires: [
        'YZSoft.src.designer.runtime.ClassManager'
    ],
    cls:'yz-part-grid',
    optHtml: '<div class="opt delete"></div>',
    draggable: {
        ddGroup: 'chart'
    },
    gridTemplate: {
        //sortableColumns: false,
        plugins: [{
            xclass: 'YZSoft.src.designer.plugin.Grid'
        }]
    },
    inheritableStatics: {
        onDrop: function (dcnt, data, fn) {
            var me = this,
                designer = dcnt.designer,
                cfg;

            designer.selDSNode(function (dsNode) {
                if (!dsNode) {
                    YZSoft.alert(RS.$('Designer_Warn_SettingDataSourceFirst'));
                    return;
                }

                cfg = me.getDefaultGridConfig(dsNode);
                fn && fn(cfg);
            });
        },
        getDefaultGridConfig: function (dsNode) {
            var me = this,
                schemaColumns = dsNode.schemaColumns,
                columns = [],
                grid, column;

            Ext.each(schemaColumns, function (dataColumn) {
                column = {
                    text: dataColumn.ColumnName,
                    dataIndex: dataColumn.ColumnName,
                    width: 120
                };

                Ext.apply(column, me.getColumnDefaultCfg(dataColumn));

                columns.push(column);
            });

            return {
                dsid: dsNode.get('text'),
                columns: columns
            };
        },
        getColumnDefaultCfg: function (dataColumn) {
            switch (dataColumn.DataType.name) {
                case 'Decimal':
                case 'Double':
                case 'Single':
                    return {
                        align: 'end',
                        width: 120,
                        dataFormat: {
                            type: 'number',
                            prefix: false,
                            thousands: true,
                            decimal: 2
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
                            thousands: true,
                            decimal: false
                        }
                    };
                case 'DateTime':
                    return {
                        width: 140,
                        dataFormat: {
                            type: 'date',
                            format: 'Y-m-d'
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
    },

    initComponent: function () {
        var me = this,
            grid;

        Ext.apply(me.ccfg, me.gridTemplate);
        grid = Ext.create(me.ccfg);
        grid.headerCt.sortOnClick = false; //禁用点击标题排序
        me.items = [grid];

        me.callParent();

        me.relayEvents(grid, ['columnClick']);

        me.on({
            columnClick: function (column, e) {
                me.designer.dcnt.select(me, column);
            },
            innerComponentDeselect: function (column) {
            }
        });
    },

    saveColumnInfo: function (column) {
        var rv;

        rv = {
            text: column.text,
            dataIndex: column.dataIndex,
            align: column.align,
            dataFormat: column.dataFormat,
            group: column.group
        };

        if (column.flex) {
            Ext.apply(rv, {
                flex: column.flex
            });
        }
        else {
            Ext.apply(rv, {
                width: column.getWidth()
            });
        }

        return rv;
    }
});