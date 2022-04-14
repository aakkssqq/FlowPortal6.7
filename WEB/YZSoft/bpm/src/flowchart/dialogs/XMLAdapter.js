/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.XMLAdapter', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.XMLAdapterGeneral', {
            padding: '26 26 0 26'
        });

        me.pnlExportData = Ext.create('YZSoft.bpm.propertypages.ExportData', {
            title: RS.$('All_FillXML'),
            padding: '15 20 0 20',
            tables: tables,
            nameColumnConfig: {
                text: RS.$('All_XMLField')
            },
            captionConfig: {
                text: RS.$('All_Caption_FillXML')
            },
            genXsdButtonConfig: {
                text: RS.$('All_ExportXMLSchema'),
                exportFileName: 'XMLAdapter.xsd'
            }
        });

        me.pnlExportDataSimple = Ext.create('YZSoft.bpm.propertypages.ExportDataSimple', {
            title: RS.$('All_GenerateXMLByMap'),
            padding: '15 20 0 20',
            tables: tables,
            captionConfig: {
                text: RS.$('All_Caption_GenerateXMLByMap')
            },
            genXsdButtonConfig: {
                text: RS.$('All_ExportXMLSchema'),
                exportFileName: 'XMLAdapter.xsd'
            }
        });

        me.pnlExportData.relayEvents(me.pnlGeneral, ['dataSchemaChanged']);

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlExportData,
                me.pnlExportDataSimple
            ]
        });

        me.pnlGeneral.on({
            scope: me,
            bySchemaChanged: 'onSchemaChanged'
        });

        me.btnOK = Ext.create('Ext.button.Button', {
            text: RS.$('All_OK'),
            cls: 'yz-btn-default',
            handler: function () {
                var data = me.save();
                me.closeDialog(data);
            }
        });

        me.btnCancel = Ext.create('Ext.button.Button', {
            text: RS.$('All_Cancel'),
            handler: function () {
                me.close();
            }
        });

        cfg = {
            buttons: [me.btnOK, me.btnCancel],
            items: [me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this;

        me.onSchemaChanged(data.BySchema);

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,BySchema,ServerName,Path,FileName,EncodeType,Overwrite'));

        if (data.BySchema) {
            me.pnlExportData.fill(data.ExportDataSet);
            me.pnlExportDataSimple.fill({
                tables: me.property.sprite.drawContainer.process.GlobalTableIdentitys,
                ExportDataSet: {Tables:[]}
            });
        }
        else {
            me.pnlExportDataSimple.fill({
                tables: me.property.sprite.drawContainer.process.GlobalTableIdentitys,
                ExportDataSet: data.ExportDataSet
            });
        }
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();

        if (data.BySchema)
            data.ExportDataSet = me.pnlExportData.save();
        else
            data.ExportDataSet = me.pnlExportDataSimple.save();

        return data;
    },

    onSchemaChanged: function (newValue) {
        var me = this;

        if (newValue) {
            me.tabMain.remove(me.pnlExportDataSimple, false);
            if (!me.tabMain.contains(me.pnlExportData))
                me.tabMain.add(me.pnlExportData);
        }
        else {
            me.tabMain.remove(me.pnlExportData, false);
            if (!me.tabMain.contains(me.pnlExportDataSimple))
                me.tabMain.add(me.pnlExportDataSimple);
        }
    }
});