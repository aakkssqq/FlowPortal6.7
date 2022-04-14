/*
config:
tables
nameColumnConfig
captionConfig
data:{
tables
Tables
}
*/
Ext.define('YZSoft.bpm.propertypages.ExportData', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.src.ux.File'
    ],
    referenceHolder: true,
    title: RS.$('Process_Title_ExportData'),
    removeDefaultColumn: false,
    removeDefaultTable: false,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    genXsdButtonConfig: {
    },

    constructor: function (config) {
        var me = this,
            genXsdButtonConfig = config.genXsdButtonConfig = config.genXsdButtonConfig || me.genXsdButtonConfig,
            cfg;

        me.editorConfig = {
            xclass: 'YZSoft.src.form.field.CodeField5',
            listeners: {
                beforeedit: function (context) {
                    this.context = context;
                    this.setTables(me.tables);
                    this.setValueType(context.record.data.DataType);
                },
                selected: function (value) {
                    me.grid.cellEditing.cancelEdit();
                    this.context.record.set(this.context.column.dataIndex, value);
                    me.grid.cellEditing.startEdit(this.context.record, this.context.column);
                }
            }
        };

        me.grid = Ext.create('YZSoft.bpm.src.grid.DataSetSchemaGrid', {
            region: 'center',
            border: true,
            flex: 1,
            tablePanelConfig: {
                editable: false
            },
            columns: {
                defaults: {
                    sortable: false,
                    hideable: false,
                    menuDisabled: true
                },
                items: [
                    { dataIndex: '', width: 32, resizable: false, tdCls: 'yz-grid-cell-static' },
                    Ext.apply({ text: RS.$('All_DataField'), dataIndex: 'ColumnName', width: 118 }, config.nameColumnConfig),
                    { text: RS.$('All_Type'), dataIndex: 'DataType', width: 80, formatter: 'dataType' },
                    { text: RS.$('All_FillWith'), dataIndex: 'DefaultValue', flex: 1, renderer: YZSoft.Render.renderCode5, editor: me.editorConfig }
                ]
            }
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

        me.on({
            scope: me,
            dataSchemaChanged: 'onSchemaChanged'
        });

        if (config.data)
            me.fill(config.data);
    },

    onSchemaChanged: function (tables) {
        var me = this,
            data = me.save();

        me.fill(Ext.apply({
            tables: tables
        }, data));
    },

    fill: function (data) {
        var me = this,
            refs = me.getReferences();

        if (!data.tables)
            data.tables = data.Tables

        Ext.copyTo(me, data, 'ServerName,CallProcess');

        me.grid.addTableWithSchema({
            tables: data.tables,
            fn: function (item) {
                if (item.isTable) {
                }
                else {
                    var column = me.grid.findColumn(data, item);
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
                'TableName'
                ], [
                'ColumnName',
                'DataType',
                'DefaultValue'
            ], function (table) {
                return true;
            }, function (column) {
                return me.removeDefaultColumn && column.DefaultValue === null;
            }, me.removeDefaultTable)
        }

        return rv;
    }
});