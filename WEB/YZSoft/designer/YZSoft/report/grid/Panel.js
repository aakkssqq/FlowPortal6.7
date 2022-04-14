

Ext.define('YZSoft.designer.YZSoft.report.grid.Panel', {
    extend: 'Ext.panel.Panel',
    bodyPadding: 20,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this,
            part = me.part,
            grid = part.getComp(),
            schemaColumns = part.dsNode.schemaColumns;

        me.edtCaption = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: RS.$('ReportDesigner_GridTitle'),
            labelAlign: 'top',
            cls: 'yz-textarea-3line',
            value: grid.getTitle(),
            enableKeyEvents: true,
            applySetting: function () {
                var value = Ext.String.trim(this.getValue());

                grid.setTitle(value);
                me.toggleGridHeader(grid);
            },
            listeners: {
                keyup: 'applySetting',
                change: 'applySetting'
            }
        });

        me.captionAlign = Ext.create('Ext.button.Segmented', {
            items: [{
                value: 'left',
                glyph: 0xe930
            }, {
                value: 'center',
                glyph: 0xe92e
            }, {
                value: 'right',
                glyph: 0xe92f
            }],
            value: grid.getTitleAlign(),
            listeners: {
                change: function () {
                    var value = this.getValue();

                    grid.setTitleAlign(value);
                }
            }
        });

        me.columnsEditor = Ext.create('YZSoft.designer.editor.GridColumns', {
            grid: grid,
            schemaColumns: schemaColumns
        });

        me.columnsEditor.store.on({
            datachanged: function (store, eOpts) {
                var displayColumns = me.columnsEditor.getSelectedColumns(),
                    columns = [], orgColumn, column;

                Ext.each(displayColumns, function (displayColumn) {
                    var dataColumnDefine = displayColumn.tag,
                        orgColumn = me.tryGetColumn(grid, dataColumnDefine.ColumnName);

                    column = {
                        text: dataColumnDefine.ColumnName,
                        dataIndex: dataColumnDefine.ColumnName,
                        renderer: grid.columnRender.bind(grid),
                        width: 120
                    };

                    Ext.apply(column, part.self.getColumnDefaultCfg(dataColumnDefine));

                    if (orgColumn)
                        Ext.apply(column, part.saveColumnInfo(orgColumn));

                    columns.push(column);
                });

                grid.setColumns(columns);
            }
        });

        me.columns = Ext.create('Ext.panel.Panel', {
            title: RS.$('ReportDesigner_Grid_Title_DisplayColumns'),
            cls: 'yz-property-fieldset-chart',
            margin:'10 0 0 0',
            bodyPadding: 0,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.columnsEditor]
        });

        me.pagingBarDisplay = Ext.create('Ext.button.Segmented', {
            items: [{
                value: true,
                text: RS.$('All_Diaplay_Yes')
            }, {
                value: false,
                text: RS.$('All_Diaplay_No')
            }],
            value: grid.getPagingBarDisplay(),
            listeners: {
                change: function () {
                    var value = this.getValue();
                    grid.setPagingBarDisplay(value);
                }
            }
        });

        me.segPagingBarDisplay = Ext.create('Ext.panel.Panel', {
            title: RS.$('All_Paging'),
            cls: 'yz-property-fieldset-chart',
            margin:'10 0 0 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportX_PagingBar_IsDisplay'),
                margin: '10 0 7 0',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [
                    me.pagingBarDisplay
                ]
            }]
        });

        me.export2Excel = Ext.create('Ext.button.Segmented', {
            items: [{
                value: true,
                text: RS.$('All_Enable')
            }, {
                value: false,
                text: RS.$('All_Disable')
            }],
            value: grid.getExport2Excel(),
            listeners: {
                change: function () {
                    var value = this.getValue();

                    grid.setExport2Excel(value);
                    me.toggleGridHeader(grid);
                }
            }
        });

        me.downloadTemplate = Ext.create('Ext.button.Button', {
            text: RS.$('All_Download'),
            cls: 'yz-btn-flat',
            padding: '7 0',
            handler: function () {
                me.excelTemplate.download();
            }
        });

        me.clearTemplate = Ext.create('Ext.button.Button', {
            text: RS.$('All__Clear'),
            cls: 'yz-btn-flat',
            padding: '7 0',
            handler: function () {
                me.excelTemplate.setValue(null);
            }
        });

        me.excelTemplate = Ext.create('YZSoft.src.form.field.DocTemplateField', {
            labelAlign: 'top',
            root: 'ReportExportTemplates',
            templateType: 'Excel',
            emptyText:RS.$('All__UploadExportTemplate'),
            uploaderConfig: {
                fileTypes: '*.xls'
            },
            buttonConfig: {
                text: '',
                glyph: 0xe948,
                padding: '0 5',
                margin: '0 0 0 -1',
            },
            value: grid.getExportTemplate(),
            listeners: {
                change: function () {
                    var value = Ext.String.trim(this.getValue());

                    grid.setExportTemplate(value);
                }
            }
        });

        me.segExport = Ext.create('Ext.panel.Panel', {
            title: RS.$('All__Export'),
            cls: 'yz-property-fieldset-chart',
            margin: '10 0 0 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                margin: '0 0 7 0'
            },
            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All_ExportToExcel'),
                margin: '10 0 7 0',
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [
                    me.export2Excel
                ]
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('All__ExportTemplate'),
                margin: '0 0 5 0',
                layout: {
                    type: 'hbox',
                    pack: 'end',
                    align: 'middle'
                },
                items: [
                    me.downloadTemplate,
                    me.clearTemplate
                ]
            }, me.excelTemplate]
        });

        me.items = [
            me.edtCaption, {
                xtype: 'fieldcontainer',
                fieldLabel: RS.$('ReportDesigner_TitleAlign'),
                layout: {
                    type: 'hbox',
                    pack: 'end'
                },
                items: [me.captionAlign]
            },
            me.segPagingBarDisplay,
            me.segExport,
            me.columns
        ];

        me.callParent();
    },

    tryGetColumn: function (grid, columnName) {
        return Ext.Array.findBy(grid.getColumns(), function (column) {
            return column.dataIndex == columnName;
        });
    },

    toggleGridHeader: function (grid) {
        var me = this,
            header = grid.getHeader(),
            title = grid.getTitle(),
            export2Excel = grid.getExport2Excel();

        if (!title && !export2Excel)
            header && header.hide();
        else
            header && header.show();
    }
});