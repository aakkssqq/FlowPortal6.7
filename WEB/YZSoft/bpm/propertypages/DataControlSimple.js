/*
config:
nameColumnConfig
captionConfig
importdataset,
genXsdButtonConfig

*/
Ext.define('YZSoft.bpm.propertypages.DataControlSimple', {
    extend: 'Ext.panel.Panel',
    requires:[
        'YZSoft.src.ux.File'
    ],
    referenceHolder: true,
    title: RS.$('Process_Title_DataControl'),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    genXsdButtonConfig: {
        hidden: true
    },

    constructor: function (config) {
        var me = this,
            genXsdButtonConfig = config.genXsdButtonConfig = config.genXsdButtonConfig || me.genXsdButtonConfig;

        me.editorConfig = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.importdataset = me.importdataset;
                    this.setTables(me.grid.getTableIdentitys());
                    this.setValueType(context.record.data.DataType);
                },
                selected: function (value) {
                    me.grid.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.grid.cellEditing.startEdit(this.context.record, this.context.column);
                }
            }
        };

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', Ext.apply({
            border: true,
            flex: 1,
            tablePanelConfig: {
                allowAddRecordConfig: {
                    hidden: true
                },
                advBtnConfig: {
                    hidden: true
                }
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    Ext.apply({ text: RS.$('Process_ProcessData'), dataIndex: 'ColumnName', width: 118 }, config.nameColumnConfig),
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('All_FillWith'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
                ]
            }
        },config.gridConfig));

        var cfg = {
            items: [Ext.apply({
                xtype: 'label',
                text: RS.$('Process_DataControlSimple_Title'),
                style: 'display:block',
                margin: '0 0 6 0'
            }, config.captionConfig), me.grid, {
                xtype: 'container',
                layout: 'hbox',
                margin: '5 0 0 0',
                border: false,
                defaults: {
                    xtype: 'button',
                    padding: '3 20',
                    margin: '0 3 0 0',
                    minWidth: 80,
                    disabled: true
                },
                items: [{
                    text: RS.$('All_AddTable'),
                    reference: 'btnAdd',
                    disabled: false,
                    handler: function () {
                        Ext.create('YZSoft.bpm.src.dialogs.SelTableDlg', {
                            autoShow: true,
                            fn: function (value) {
                                me.grid.addTable({
                                    tables: value
                                });
                            }
                        });
                    }
                }, {
                    text: RS.$('Process_RemoveSelectedTables'),
                    reference: 'btnRemove',
                    handler: function () {
                        me.grid.removeSelectedTable();
                        me.updateStatus();
                    }
                }, {
                    xtype: 'tbfill'
                }, Ext.apply({
                    text: RS.$('All_ExportSchema'),
                    margin: 0,
                    reference: 'btnExportXSD',
                    handler: function () {
                        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
                            method: 'XSDFromDataSetMap',
                            fileName: 'interface.xsd',
                            map: Ext.util.Base64.encode(Ext.encode(me.importdataset))
                        });
                    }
                }, genXsdButtonConfig)]
            }]
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
                    var table = me.grid.findTable(data.ControlDataSet, item);
                    if (table)
                        Ext.copyTo(item, table, 'Filter');
                    else {
                        Ext.apply(item, {
                            Filter: { Params: [] }
                        })
                    }

                    if (item.IsRepeatableTable) {
                        var initcreatetables = me.grid.findTables(data.InitCreateRecordSet, item);
                        item.InitCreateRecordSet = initcreatetables;
                    }
                }
                else {
                    var column = me.grid.findColumn(data.ControlDataSet, item);
                    if (column)
                        Ext.copyTo(item, column, 'DefaultValue');
                    else {
                        Ext.apply(item, {
                            DefaultValue: null
                        });
                    }
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
                'Filter'
                ], [
                'ColumnName',
                'DefaultValue'
            ], function (table) {
                return true;
            }, function (column) {
                return column.DefaultValue === null;
            }, true)
        };

        return rv;
    },

    setImportDataSet: function (importdataset) {
        this.importdataset = importdataset;
        this.updateStatus();
    },

    updateStatus: function () {
        var me = this,
            refs = me.getReferences(),
            tableSelection = me.grid.getTableSelection();

        refs.btnRemove.setDisabled(tableSelection.length == 0);
        refs.btnExportXSD.setDisabled(!me.importdataset || me.importdataset.Tables.length == 0);
    }
});