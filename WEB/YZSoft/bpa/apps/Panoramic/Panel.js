
/*
libInfo
*/
Ext.define('YZSoft.bpa.apps.Panoramic.Panel', {
    extend: 'Ext.container.Container',
    requires: [
        'YZSoft.src.model.Folder',
        'YZSoft.src.ux.File'
    ],
    style: 'background-color:white',

    constructor: function (config) {
        var me = this,
            cfg;

        me.min = Ext.create('Ext.toolbar.TextItem', {
            text: RS.$('BPA_Panoramic_20Per')
        });

        me.slider = Ext.create('Ext.slider.Single', {
            width: 200,
            value: 100,
            increment: 10,
            minValue: 20,
            maxValue: 100,
            tipText: function (thumb) {
                return String(thumb.value) + '%';
            },
            listeners: {
                change: function (slider, newValue, thumb, type, eOpts) {
                    me.zoom(newValue);
                    me.cur.setText(Ext.String.format(RS.$('BPA_Panoramic_CurZoom'), newValue));
                }
            }
        });

        me.cur = Ext.create('Ext.toolbar.TextItem', {
            text: Ext.String.format(RS.$('BPA_Panoramic_CurZoom'), 100)
        });

        me.btnExportPdf = Ext.create('Ext.button.Button', {
            cls: 'bpa-btn-flat',
            glyph: 0xeaeb,
            text: RS.$('All_Draw_Export_Pdf'),
            handler: function () {
                me.exportPdf();
            }
        });

        me.btnExportPng = Ext.create('Ext.button.Button', {
            cls: 'bpa-btn-flat',
            glyph: 0xeaea,
            text: RS.$('All_Draw_Export_Png'),
            handler: function () {
                me.exportPng();
            }
        });

        me.btnRefresh = Ext.create('Ext.button.Button', {
            text: RS.$('All_Refresh'),
            cls: 'bpa-btn-flat',
            iconCls: 'yz-glyph yz-glyph-refresh',
            margin: '0 20 0 0',
            handler: function () {
                me.store.reload({
                    loadMask: true
                });
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            region: 'north',
            height: 48,
            defaults: {
            },
            items: [
                me.min,
                me.slider,
                me.cur,
                '->',
                me.btnExportPdf,
                me.btnExportPng,
                me.btnRefresh
            ]
        });

        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: false,
            model: 'YZSoft.src.model.Folder',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/BPA/ProcessReports.ashx'),
                extraParams: {
                    method: 'GetPanoramicTree'
                }
            },
            root: {
                path: config.libInfo.FolderID,
                text: config.libInfo.Name,
                type: 'Lib'
            }
        });

        me.view = Ext.create('YZSoft.bpa.apps.Panoramic.Tree', {
            border: false,
            store: me.store,
            region: 'center',
            listeners: {
                single: true,
                load: function (bbox) {
                    var scale

                    scale = Math.min(me.view.getWidth() / bbox.width, me.view.getHeight() / bbox.height);
                    scale = Math.min(scale, 1);
                    me.slider.setValue(scale * 100);
                }
            }
        });

        cfg = {
            layout: 'border',
            items: [
                me.toolbar,me.view
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.loadMask = Ext.create('Ext.LoadMask', {
            target: me,
            store: me.store
        });

        me.on({
            silgle: true,
            render: function () {
                me.store.load($S.loadMask.first);
            }
        });
    },

    exportPdf: function () {
        var me = this,
            dcnt = me.view.drawContainer,
            processName = Ext.String.format(RS.$('BPA_Panoramic_ExportFileName'), me.libInfo.Name),
            chart, process;

        chart = dcnt.saveChart({
            paddingTop: 30,
            paddingLeft: 30,
            paddingRight: 80,
            paddingBottom: 80
        });
        process = {};

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'ExportProcessAsPdf',
            fileName: processName,
            ext: '.flo',
            process: Ext.util.Base64.encode(Ext.encode(process)),
            chart: Ext.util.Base64.encode(Ext.encode(chart))
        });
    },

    exportPng: function () {
        var me = this,
            dcnt = me.view.drawContainer,
            processName = Ext.String.format(RS.$('BPA_Panoramic_ExportFileName'), me.libInfo.Name),
            chart, process;

        chart = dcnt.saveChart({
            paddingTop: 30,
            paddingLeft: 30,
            paddingRight: 80,
            paddingBottom: 80
        });
        process = {};

        YZSoft.src.ux.File.download(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), {
            method: 'ExportProcessAsPng',
            fileName: processName,
            ext: '.flo',
            process: Ext.util.Base64.encode(Ext.encode(process)),
            chart: Ext.util.Base64.encode(Ext.encode(chart))
        });
    },

    zoom: function (per, deletage) {
        var me = this,
            el = me.view.el,
            el = el.down('.x-surface');


        el.setStyle({
            transformOrigin: 'left top',
            transform: {
                scale: per / 100
            }
        });
    }
});