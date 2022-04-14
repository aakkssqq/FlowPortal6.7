
Ext.define('YZSoft.report.grid.Panel', {
    extend: 'YZSoft.src.grid.ExcelPanel',
    requires: [
        'YZSoft.src.ux.Exporter'
    ],
    layout: 'fit',
    border: false,
    sortableColumns: true,
    enableColumnMove: false,
    enableColumnHide: true,
    enableColumnResize: true,
    config: {
        pagingBarDisplay: false,
        export2Excel: false,
        exportTemplate: null
    },
    export2ExcelTool: {
        glyph: 0xeb2a
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            export2Excel = config.export2Excel;

        config.columns = {
            defaults: {
                renderer:me.columnRender
            },
            items:config.columns
        };

        config.bbar = me.pagingBar = Ext.create('Ext.toolbar.Paging', {
            displayInfo: false,
            margin: '8 0 0 0',
            padding:'3 0'
        });

        if (export2Excel) {
            config.tools = config.tools || [];
            config.tools.push(Ext.apply({
                isExportToExcel: true,
                scope: me,
                handler: 'onExport2Excel'
            }, me.export2ExcelTool));
        }

        me.callParent([config]);
    },

    updatePagingBarDisplay: function (value) {
        var me = this,
            pagingBar = me.pagingBar;

        pagingBar[value ? 'show' : 'hide']();
    },

    updateExport2Excel: function (value) {
        var me = this,
            header = me.getHeader(),
            items = header && header.items.items,
            exportTool;

        if (!items) {
            me.on({
                single: true,
                beforerender: function () {
                    me.updateExport2Excel(value);
                }
            });

            return;
        }

        exportTool = Ext.Array.findBy(items, function (item) {
            if (item.isExportToExcel)
                return true;
        });

        if (value) {
            if (!exportTool) {
                header.addTool(Ext.apply({
                    isExportToExcel: true,
                    scope: me,
                    handler: 'onExport2Excel'
                }, me.export2ExcelTool));
            }
        }
        else {
            if (exportTool) {
                header.remove(exportTool,true);
            }
        }
    },

    numberRender: function (value, metaData, record, rowIndex, colIndex, store) {
        var me = this,
            column = metaData.column,
            dataFormat = column.dataFormat,
            prefix = dataFormat.prefix,
            thousands = dataFormat.thousands,
            scale = dataFormat.scale || 1,
            decimal = dataFormat.decimal,
            formattext = [];

        if (decimal === true)
            decimal = 2;

        if (prefix === true)
            prefix = RS.$('All_DefaultCurrency');

        if (prefix)
            formattext.push(prefix);

        if (thousands)
            formattext.push('0,000');
        else
            formattext.push('0');

        if (decimal)
            formattext.push('.' + Ext.String.repeat('0', decimal));
        else
            formattext.push((decimal === false || decimal === 0) ? '' : '.########');

        return Ext.util.Format.number(value / scale, formattext.join(''));
    },

    dateRender: function (value, metaData, record, rowIndex, colIndex, store) {
        var me = this,
            column = metaData.column,
            dataFormat = column.dataFormat,
            format = dataFormat.format || 'Y-m-d';

        return Ext.Date.format(value, format);
    },

    textRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return Ext.util.Format.text(value);
    },

    booleanRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return value ? RS.$('All_Yes'):RS.$('All_No');
    },

    binaryRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return value ? RS.$('All_BinaryData') : '';
    },

    defaultRender: function (value, metaData, record, rowIndex, colIndex, store) {
        return Ext.util.Format.text(value);
    },

    columnRender: function (value, metaData, record, rowIndex, colIndex, store) {
        var me = this,
            column = metaData.column,
            dataFormat = column.dataFormat || {},
            render = me[(dataFormat.type || 'default') + 'Render'],
            text;

        if (value === null)
            return 'NULL';

        return render(value, metaData, record, rowIndex, colIndex, store);
    },

    onExport2Excel: function () {
        var me = this,
            store = me.getStore(),
            rows = store.getTotalCount(),
            exportAsfileName = me.getTitle() || RS.$('All_Report_DefaultExportFileName');

        //导出源不正确
        if (!store || !store.getProxy())
            return;

        //没有可以导出的数据
        if (rows == 0) {
            YZSoft.alert(RS.$('All_Report_Export_EmptyStoreWarn'));
            return;
        }

        //执行导出
        if (me.getPagingBarDisplay()) {
            Ext.create('YZSoft.src.dialogs.ExcelExportDlg', {
                autoShow: true,
                grid: me,
                osfile: true,
                root: 'ReportExportTemplates',
                path: 'Excel',
                templateFileName: me.getExportTemplate(),
                params: {
                },
                fileName: exportAsfileName,
                allowExportAll: true,
                defaultRadio: 'all',
                listeners: {
                    beforeload: function (params) {
                        params.ReportDate = new Date();
                    }
                }
            });
        }
        else {
            YZSoft.src.ux.Exporter.$export({
                grid: me,
                store: store,
                osfile: true,
                root: 'ReportExportTemplates',
                path: 'Excel',
                templateFileName: me.getExportTemplate(),
                params: {
                    ReportDate: new Date()
                },
                fileName: exportAsfileName,
                start: 0,
                limit: rows
            });
        }
    }
});