
Ext.define('YZSoft.src.dialogs.ExcelDataImportDlg', {
    extend: 'Ext.window.Window', //111111
    title: RS.$('All_Excel_ImportDlg_Title'),
    layout: 'card',
    width: 890,
    height: 546,
    minWidth: 680,
    minHeight: 546,
    modal: false,
    maximizable: true,
    buttonAlign: 'right',

    constructor: function (config) {
        var me = this,
            config = config || {},
            cfg;

        me.edtFileName = Ext.create('Ext.form.field.Text', {
            width: 260
        });

        me.btnSelFile = Ext.create('Ext.button.Button', {
            text: Ext.String.format('{0}...', RS.$('All_SelectFile')),
        });

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.btnSelFile,
            loadMask: {
                msg: RS.$('All_DataImport_Uploading'),
                target: me
            },
            fileTypes: '*.xls;*.xlsx',
            typesDesc: 'Excel',
            fileSizeLimit: '100 MB',
            params: {
                Method: 'Excel2DataSet',
                titleRowIndex: config.titleRowIndex,
                dataRowIndex: config.dataRowIndex
            },
            listeners: {
                scope: me,
                uploadSuccess: function (file, data) {
                    YZSoft.Ajax.request({
                        url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
                        params: {
                            method: 'GetTempStorageData',
                            id: data.id
                        },
                        waitMsg: {
                            msg: RS.$('All_DataImport_DataLoading'),
                            target: me,
                            start: 0
                        },
                        success: function (action) {
                            me.onUploadSuccess(file, action.result);
                        }
                    });
                }
            }
        });

        me.labCaption = Ext.create('Ext.toolbar.TextItem', {
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            cls: 'yz-border',
            tabBar: {
                cls:'yz-tab-bar-window-select'
            },
            items: [],
            listeners: {
                scope: 'tabchange',
                tabchange: function () {
                    me.updateStatus();
                },
                add: function () {
                    me.setActiveItem(me.tabMain);
                },
                remove: function (tab) {
                    if (tab.items.getCount() == 0) {
                        me.setActiveItem(me.pnlEmpty);
                        me.updateStatus();
                    }
                }
            }
        });

        me.pnlEmpty = Ext.create('Ext.Component', {
            tpl: [
                '<div class="d-flex flex-column justify-content-center align-items-center h-100">',
                    '<img src="{img}"></img>',
                    '<div style="color:#d3d3d3;margin-top:40px;margin-bottom:30px;font-size:16px;">{text}</div>',
                '</div > '
            ],
            data: {
                img: YZSoft.$url('YZSoft/theme/images/empty/excel.png'),
                text: RS.$('All_ExcelDataImportDlg_EmptyText')
            }
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            disabled: true,
            handler: function () {
                var grid = me.tabMain.getActiveTab(),
                    sm = grid.getSelectionModel(),
                    recs = sm.getSelection();

                if (recs) {
                    var rows = [];
                    Ext.each(recs, function (v) {
                        rows.push(v.data);
                    });

                    me.closeDialog(rows);
                }
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            scope: this,
            handler: function () {
                me.close();
            }
        });

        cfg = {
            tbar: {
                padding:'5 16 10 16',
                items: [RS.$('All_Excel_ImportFile'), me.edtFileName, me.btnSelFile, '->', me.labCaption]
            },
            items: [me.pnlEmpty, me.tabMain],
            buttons: [me.btnCancel, me.btnOK]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onUploadSuccess: function (file, data) {
        var me = this,
            insertedGrids = [];

        for (var tableName in data.schema) {
            var schema = data.schema[tableName],
                rows = data.data[tableName];

            if (!Ext.isEmpty(schema) && rows.length != 0) {
                var grid = me.createGrid(tableName, schema, rows, file);

                grid.getSelectionModel().selectAll(true);
                me.tabMain.add(grid);
                insertedGrids.push(grid);
            }
        }

        if (insertedGrids.length != 0)
            me.tabMain.setActiveItem(insertedGrids[0]);
    },

    createGrid: function (tableName, schema, rows, file) {
        var me = this,
            fields = [],
            columns = [];

        columns.push({
            xtype: 'rownumberer',
            width: 34
        });

        for (var columnName in schema) {
            fields.push(columnName);

            columns.push({
                text: schema[columnName] || columnName,
                dataIndex: columnName,
                flex: 1,
                minWidth: 100,
                renderer: YZSoft.Render.renderString
            });
        }

        store = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            fields: fields,
            data: rows
        });

        grid = Ext.create('Ext.grid.Panel', {
            title: Ext.String.format(RS.$('All_Excel_SheetTitle'), file.name, tableName),
            closable: true,
            bufferedRenderer: true,
            store: store,
            file: file,
            sheetName: tableName,
            viewConfig: {
                markDirty: false
            },
            selModel: Ext.create('Ext.selection.CheckboxModel', {
                injectCheckbox: 1, //*****
                mode: 'SIMPLE',
                listeners: {
                    scope: me,
                    selectionchange: function () {
                        me.updateStatus();
                    }
                }
            }),
            columns: {
                defaults: {
                    sortable: true
                },
                items: columns
            }
        });

        return grid;
    },

    updateStatus: function () {
        var me = this;

        if (me.tabMain.items.getCount() == 0) {
            me.edtFileName.setValue('');
            me.labCaption.setText('');
            me.btnOK.setDisabled(true);
            return;
        }

        var grid = me.tabMain.getActiveTab(),
            sm = grid.getSelectionModel(),
            recs = sm.getSelection(),
            countText;

        me.edtFileName.setValue(grid.file.name);
        countText = Ext.String.format('<span style="color:red;font-weight:bold;padding:0px 3px">{0}</span>', grid.getStore().getCount());
        me.labCaption.setText(Ext.String.format(RS.$('All_Excel_SheetSummaryInfo'), grid.sheetName, countText));
        me.btnOK.setDisabled(recs.length == 0);
    }
});
