/*
config:
nameColumnConfig
captionConfig
importdataset,
genXsdButtonConfig

*/
Ext.define('YZSoft.bpm.propertypages.ExportDataSimple', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.File'
    ],
    referenceHolder: true,
    title: RS.$('Process_Title_ExportDataSimple'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    genXsdButtonConfig: {
        hidden: true
    },

    constructor: function (config) {
        var me = this,
            genXsdButtonConfig = config.genXsdButtonConfig = config.genXsdButtonConfig || me.genXsdButtonConfig,
            cfg;

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetMapGrid', {
            flex: 1,
            border: true
        });

        cfg = {
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                margin: '0 0 3 0',
                defaults: {
                },
                items: [Ext.apply({
                    xtype: 'label',
                    text: RS.$('Process_ExportData_ExportTitle'),
                    style: 'display:block',
                    padding: '4 0 0 1'
                }, config.captionConfig), {
                    xtype: 'tbfill'
                }, Ext.apply({
                    xclass: 'YZSoft.src.button.Button',
                    padding: '3 20',
                    text: RS.$('All_ExportSchema'),
                    disabled: true,
                    store: me.grid.getStore(),
                    updateStatus: function () {
                        this.setDisabled(me.grid.getStore().getCount() == 0);
                    },
                    handler: function () {
                        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                            method: 'XSDFromDataSetMap',
                            fileName: genXsdButtonConfig.exportFileName || 'data.xsd',
                            map: Ext.util.Base64.encode(Ext.encode(me.save()))
                        });
                    }
                }, genXsdButtonConfig)]
            }, me.grid
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.grid, ['tablesChanged']);

        me.grid.on({
            tablecheckchanged: function () {
                me.updateStatus();
            }
        });

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        me.grid.addTable({
            tables: data.tables,
            fn: function (item) {
                if (item.isTable) {
                    var table = me.grid.findTable(data.ExportDataSet, item);
                    if (table) {
                        item.AllowExport = true;
                        Ext.copyTo(item, table, 'MapTo');
                    }
                }
                else {
                    var column = me.grid.findColumn(data.ExportDataSet, item);
                    if (column)
                        Ext.copyTo(item, column, 'AllowExport,MapTo');
                }
            },
            clear: true
        });
    },

    save: function () {
        var me = this,
            refs = me.getReferences(),
            rv;

        rv = {
            Tables: me.grid.save([
                'DataSourceName',
                'TableName',
                'MapTo'
                ], [
                'ColumnName',
                'DataType',
                'AllowExport',
                'MapTo'
            ], function (table) {
                return !table.AllowExport;
            }, function (column) {
                return !column.AllowExport;
            }, true)
        };

        return rv;
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences();

        refs.btnExportXSD.setDisabled(!me.importdataset || me.importdataset.Tables.length == 0);
    }
});