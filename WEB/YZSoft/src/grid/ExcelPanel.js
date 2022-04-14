
Ext.define('YZSoft.src.grid.ExcelPanel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'YZSoft.src.grid.view.ExcelTable'
    ],
    viewType: 'yzexceltable',
    headerBorders: true,
    columnLines: true,
    rowLines: true,
    sortableColumns: false,
    enableColumnMove: false,
    enableColumnHide: false,
    enableColumnResize: true,

    constructor: function (config) {
        var me = this,
            config = config || {};

        Ext.apply(config,{
            bufferedRenderer: false
        });

        me.callParent([config]);

        me.addCls('yz-grid-excel');
    }
});