/*
config
tables:
*/
Ext.define('YZSoft.bpm.src.dialogs.XSDFromDataSetMapDlg', {
    extend: 'Ext.window.Window', //222222
    requires: [
        'YZSoft.bpm.src.model.DataColumnSchema',
        'YZSoft.src.ux.File'
    ],
    title: RS.$('All_XSDFromDataSetMap'),
    layout: 'fit',
    width: 700,
    height: 510,
    minWidth: 700,
    minHeight: 510,
    modal: true,
    maximizable: true,
    bodyPadding: '5 20',
    buttonAlign: 'right',
    referenceHolder: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetMapGrid', {
            border: true
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_GenXSDAndDownload'),
            cls: 'yz-btn-default',
            handler: function () {
                var dataset = me.save();
                YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                    method: 'XSDFromDataSetMap',
                    fileName: 'interface.xsd',
                    map: Ext.util.Base64.encode(Ext.encode(dataset))
                });
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnCancel, me.btnOK],
            items: [me.grid]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.grid.addTable({ tables: config.tables });
    },

    save: function () {
        var me = this,
            rv = [];

        rv = {
            Tables: me.grid.save([
                'DataSourceName',
                'TableName',
                'MapTo'
                ], [
                'ColumnName',
                'DataType',
                'MapTo'
            ], function (table) {
                return !table.AllowExport;
            }, function (column) {
                return !column.AllowExport;
            }, true)
        };

        return rv;
    }
});