/*
config:
drawContainer
folderid
*/
Ext.define('YZSoft.bpa.property.Report', {
    extend: 'Ext.container.Container',
    title: RS.$('BPA_Title_Reports'),
    layout: 'border',
    reportTypes: {
        ActivityManual: {
            name: RS.$('BPA_ReportName_ActivityManual'),
            fileName: RS.$('BPA_ReportFileName_ActivityManual')
        },
        PositionManual: {
            name: RS.$('BPA_ReportName_PositionManual'),
            fileName: RS.$('BPA_ReportFileName_PositionManual')
        },
        SOP: {
            name: RS.$('BPA_ReportName_SOP'),
            fileName: RS.$('BPA_ReportFileName_SOP')
        },
        Activity: ['ActivityManual'],
        ORG: ['PositionManual'],
        Process: ['SOP']
    },

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

        me.storeReportType = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            data: me.reportTypes.process
        });

        me.cmbReportType = Ext.create('Ext.form.field.ComboBox', {
            region: 'north',
            emptyText: RS.$('BPA__SelectReportType'),
            margin: 0,
            store: me.storeReportType,
            editable: false,
            queryMode: 'local',
            valueField: 'value',
            displayField: 'name',
            listeners: {
                scope: me,
                change: 'onReportTypeChanged'
            }
        });

        me.cmbTemplates = Ext.create('YZSoft.bpa.src.form.field.ReportTemplatesComboBox', {
            region: 'north',
            forceSelect: true,
            margin: '8 0 0 0'
        });

        me.menuUpload = Ext.create('YZSoft.src.menu.Item', {
            glyph: 0xe948,
            text: RS.$('All_Upload')
        });

        me.menuReference = Ext.create('YZSoft.src.menu.Item', {
            glyph: 0xe94a,
            text: RS.$('All_Reference'),
            handler: function () {
                me.pnlDocument.addReference('BPADocument');
            }
        });

        me.btnUpload = Ext.create('Ext.button.Button', {
            text: RS.$('All_AddDocument'),
            cls: 'yz-btn-classic-box-hot',
            menu: {
                padding:'2',
                defaults: {
                    padding:'0 0 0 6'
                },
                items:[
                    me.menuUpload,
                    me.menuReference
                ]
            }
        });

        me.uploader = Ext.create('YZSoft.src.ux.Uploader', {
            attachTo: me.menuUpload,
            autoStart: false,
            fileSizeLimit: '100 MB',
            fileTypes: '*.*',
            typesDesc: RS.$('All_FileTypeDesc_All')
        });

        me.btnGenerateReport = Ext.create('Ext.button.Button', {
            text: RS.$('BPA__GenerateReport'),
            cls: 'yz-btn-classic-solid-hot',
            padding:'7 12',
            margin: 0,
            handler: function () {
                var type = me.cmbReportType.getValue(),
                    template = me.cmbTemplates.getValue(),
                    rec;

                if (!type) {
                    YZSoft.alert(RS.$('BPA_Error_ReportTypeConnotBeEmpty'));
                    return;
                }

                if (!template) {
                    YZSoft.alert(RS.$('BPA_Error_ReportTemplateConnotBeEmpty'));
                    return;
                }

                rec = me.storeReportType.findRecord('value', type);
                if (rec) {
                    var cnt = me.drawContainer,
                        fileinfo = cnt.fileinfo,
                        fileid = fileinfo.fileid,
                        process = cnt.saveProcess(cnt),
                        name;

                    name = Ext.String.format(rec.data.fileName, process.Property.Code || RS.$('BPA__FileCode'), fileinfo.processName, process.Property.Version || '1.0', me.selection.spriteName);
                    me.generateDocument(type, template, name);
                }
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            padding: '15 0 0 0',
            style:'background-color:transparent;',
            items: [
                me.btnUpload,
                '->',
                me.btnGenerateReport
            ]
        });

        me.pnlDocument = Ext.create('YZSoft.src.document.Simple', Ext.apply({
            region: 'center',
            folderid: config.folderid,
            uploader: me.uploader
        }, config.pnlDocumentConfig));

        me.toolPanel = Ext.create('Ext.container.Container', Ext.apply({
            xtype: 'container',
            region: 'north',
            padding: '20 14 20 14',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.cmbReportType, me.cmbTemplates, me.toolbar]
        }, config.toolPanelConfig));

        cfg = {
            items: [me.toolPanel, me.pnlDocument]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            updateContext: 'onUpdateContext'
        });

        me.onUpdateContext(config.drawContainer,[])
    },

    setReadOnly: function (readOnly) {
        this.toolPanel.setVisible(!readOnly);
    },

    setFolderID: function (folderid, loadOption) {
        this.folderid = folderid;
        this.pnlDocument.setFolderID(folderid, loadOption);
    },

    onReportTypeChanged: function () {
        var me = this;
        me.cmbTemplates.setReportType(me.cmbReportType.getValue());
    },

    generateDocument: function (type, template, name) {
        var me = this,
            cnt = me.drawContainer,
            fileinfo = cnt.fileinfo,
            fileid = fileinfo.fileid,
            process = cnt.saveProcess(cnt),
            chart = cnt.saveChart();

        process.FileID = fileid;
        process.FileName = fileinfo.processName;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
            params: Ext.apply({
                method: 'Generate' + type + 'Report',
                template: template,
                name: name,
                fileid: fileid,
                tagfolderid: me.folderid
            }, me.params),
            jsonData: {
                process: process,
                chart: chart
            },
            waitMsg: {
                msg: RS.$('All_Generating'),
                target: me.pnlDocument.grid,
                start: 0
            },
            success: function (result) {
                me.pnlDocument.store.reload({
                    loadMask: {
                        msg: RS.$('All_Generated')
                    }
                });
            }
        });
    },

    isPageValiable: function (selection) {
        return true;
    },

    onUpdateContext: function (drawContainer, selection) {
        var me = this,
            fileinfo = drawContainer.fileinfo,
            fileid = fileinfo && fileinfo.fileid,
            sprite = selection[0],
            reportType;

        if (selection.length == 1 && sprite.isShape) {
            reportType = sprite.property.data.reportType;
            me.params = {
                spriteid: sprite.getSpriteId()
            };
            me.selection = {
                spriteName: sprite.getSpriteName()
            };
        }
        else {
            reportType = 'Process';
            me.params = {
                isFile: true
            };
            me.selection = {
            };
        }

        if (me.storeReportType.currentType != reportType) {
            var data = [];

            Ext.each(me.reportTypes[reportType], function (type) {
                data.push(Ext.apply({
                    value: type
                }, me.reportTypes[type]));
            });
            me.storeReportType.currentType = reportType;

            me.storeReportType.setData(data);
            me.cmbReportType.setValue(null);
            me.onReportTypeChanged();
        }
    }
});