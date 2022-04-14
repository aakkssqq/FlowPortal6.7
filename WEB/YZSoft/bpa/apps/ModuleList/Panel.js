
Ext.define('YZSoft.bpa.apps.ModuleList.Panel', {
    extend: 'Ext.container.Container',
    scrollable: true,
    style: 'background-color:white',
    padding: '10 20 20 30',

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            fields: [],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
                extraParams: {
                    method: 'GetModuleList'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (successful) {
                        //var column = me.grid.headerCt.down('[cls~=yz-filegroup]'); 无法获得
                        var column = me.grid.headerCt.items.findBy(function (cmp) {
                            return cmp.hasCls('yz-filegroup');
                        });

                        if (column)
                            column.setText(Ext.String.format(RS.$('BPA_Report_FileCounts'), records.length));
                    }
                }
            }
        });

        me.grid = Ext.create('YZSoft.src.grid.ExcelPanel', {
            store: me.store,
            viewConfig: {
                loadMask: {
                    target: me
                }
            },
            columns: {
                defaults: {
                },
                items: [
                    { text: RS.$('BPA__ModuleType'), dataIndex: 'Category', width: 180, group: true, formatter:'text' },
                    { text: RS.$('All_File'), cls: 'yz-filegroup', columns: [
                        { xtype: 'rownumberer', text: RS.$('All_Index'), width: 80, align: 'center' },
                        { text: RS.$('All_FileCode'), dataIndex: 'FileCode', width: 180, formatter:'text' },
                        { text: RS.$('All_FileName1'), dataIndex: 'FileName', width: 400, formatter: 'text' },
                    ]
                    },
                    { text: RS.$('BPA__ResponsibleDept'), dataIndex: 'Responsible', width: 180, formatter: 'text' }
                ]
            }
        });

        me.pnlSearch = me.createSearchPanel(config);

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                me.pnlSearch,
                me.grid
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            silgle: true,
            render: function () {
                me.doSearch();
            }
        });
    },

    createSearchPanel: function (config) {
        var me = this;

        me.edtLibs = Ext.create('YZSoft.bpa.src.form.field.LibrariesField', {
            fieldLabel: RS.$('KM_Scope')
        });

        me.edtResponsible = Ext.create('YZSoft.bpa.src.form.field.ReportSpriteField', {
            fieldLabel: RS.$('KM_R'),
            width: 400,
            padding: '0 0 0 200',
            btnConfig: {
                text: RS.$('BPA__SelResponsible')
            },
            dlgConfig: {
                title: RS.$('KM_R'),
                folderType: 'BPAOU'
            }
        });

        me.edtMilestone = Ext.create('YZSoft.bpa.src.form.field.MilestoneField', {
            fieldLabel: RS.$('BPA__Milestone')
        });

        me.edtModuleType = Ext.create('YZSoft.bpa.src.form.field.FileTypesField', {
            fieldLabel: RS.$('BPA__ModuleType')
        });

        me.edtFileColor = Ext.create('YZSoft.bpa.src.form.field.FileColorField', {
            fieldLabel: RS.$('ReportDesigner_Seg_Color')
        });

        me.edtExecuteStatus = Ext.create('YZSoft.bpa.src.form.field.ExecuteStatusField', {
            fieldLabel: RS.$('BPA__ExecuteStatus')
        });

        me.btnSearch = Ext.create('Ext.button.Button', {
            text: RS.$('All_Report_Statistic'),
            padding: '7 10',
            iconCls: 'yz-glyph yz-glyph-search',
            cls:'yz-btn-submit',
            scope: me,
            handler: 'doSearch'
        });

        me.btnExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid,
            templateExcel: YZSoft.$url(me, Ext.String.format('ModuleList{0}.xls', RS.$('All_LangPostfix'))),
            params: {},
            fileName: RS.$('BPA__ModuleList'),
            defaultRadio: 'all',
            radioDisabled: true,
            btnConfig: {
                margin: '0 0 0 5'
            },
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date();
                }
            }
        });

        me.btnCollapse = Ext.create('Ext.button.Button', {
            cls: 'bpa-btn-flat',
            glyph: 0xe60a,
            handler: function () {
                me.pnlSearch.collapse('top', false);
            }
        });

        return Ext.create('Ext.panel.Panel', {
            cls: 'yz-panel-header-collpased-light',
            bodyPadding: '20 0 20 0',
            collapsed: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container'
            },
            items: [{
                padding: '0 0 0 0',
                layout: {
                    type: 'hbox',
                    align: 'start'
                },
                items: [me.edtLibs, me.edtResponsible, { xtype: 'tbfill' }, me.btnCollapse]
            }, {
                padding: '10 0 0 0',
                items: [me.edtMilestone]
            }, {
                padding: '0 0 0 0',
                items: [me.edtModuleType]
            }, {
                padding: '0 0 0 0',
                items: [me.edtFileColor]
            }, {
                padding: '0 0 0 0',
                items: [me.edtExecuteStatus]
            }, {
                padding: '4 0 0 105',
                layout: {
                    type: 'hbox'
                },
                items: [me.btnSearch, me.btnExport]
            }]
        });
    },

    doSearch: function () {
        var me = this;

        me.store.load({
            params: {
                rootfolders: Ext.encode(me.edtLibs.getValue()),
                responsible: Ext.encode(me.edtResponsible.getValue()),
                milestones: Ext.encode(me.edtMilestone.getValue()),
                moduletypes: Ext.encode(me.edtModuleType.getValue()),
                colors: Ext.encode(me.edtFileColor.getValue()),
                executeStatus: Ext.encode(me.edtExecuteStatus.getValue())
            },
            loadMask: {
                msg: RS.$('All_Loading'),
                start: 0
            }
        });
    }
});