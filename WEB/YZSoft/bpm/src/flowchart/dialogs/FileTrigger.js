/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.FileTrigger', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.FileTriggerGeneral', {
            padding: '26 26 0 26'
        });

        me.pnlDataControl = Ext.create('YZSoft.bpm.propertypages.DataControlSimple', {
            title: RS.$('All_ImportFileData'),
            padding: '20 20 0 20',
            genXsdButtonConfig: {
                text: RS.$('All_ExportTriggerFileXSD')
            },
            nameColumnConfig: {
                text: RS.$('Process_ProcessData')
            },
            captionConfig: {
                text: RS.$('All_ImportTriggerFileDataToTask')
            }
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlDataControl
            ]
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

        me.pnlGeneral.on({
            dataSchemaChanged: function (tables) {
                me.xmlfileTables = tables;
                me.pnlDataControl.setImportDataSet(me.regularImportDataSet({ Tables: tables }));
            },
            triggerTypeChange: function (type) {
                if (type == 'ImportData') {
                    me.pnlDataControl.setImportDataSet(me.regularImportDataSet({ Tables: me.xmlfileTables }));
                }
                else {
                    me.pnlDataControl.setImportDataSet(me.regularImportDataSet({ Tables: [] }));
                }
            }
        });

        if (config.data)
            me.fill(config.data);
    },

    regularImportDataSet: function (dataset) {
        var me = this;

        dataset = dataset || { Tables: [] };

        var tableAttach = Ext.Array.findBy(dataset.Tables, function (table) {
            if (table.TableName == 'Attachment')
                return true;
        });

        if (!tableAttach) {
            Ext.Array.insert(dataset.Tables, 0, [{
                DataSourceName: 'Default',
                TableName: 'Attachment',
                Columns: [
                    { ColumnName: 'FileID', DataType: { name: 'String', fullName: 'System.String'} },
                    { ColumnName: 'Name', DataType: { name: 'String', fullName: 'System.String'} },
                    { ColumnName: 'Ext', DataType: { name: 'String', fullName: 'System.String'} },
                    { ColumnName: 'Size', DataType: { name: 'Int32', fullName: 'System.Int32'} },
                    { ColumnName: 'LastUpdate', DataType: { name: 'DateTime', fullName: 'System.DateTime'} },
                    { ColumnName: 'OwnerAccount', DataType: { name: 'String', fullName: 'System.String'} },
                    { ColumnName: 'FullName', DataType: { name: 'String', fullName: 'System.String'} }
                ]
            }]);
        }

        return dataset;
    },

    fill: function (data) {
        var me = this;

        data.XmlDataSet = me.regularImportDataSet(data.XmlDataSet);
        me.xmlfileTables = Ext.Array.slice(data.XmlDataSet.Tables, 1);

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,MonitorFolder,FileFilter,TriggerType,ArchiveAfterExecute'));
        me.pnlDataControl.setImportDataSet(data.XmlDataSet);
        me.pnlDataControl.fill({
            tables: me.property.sprite.drawContainer.process.GlobalTableIdentitys,
            ControlDataSet: data.ControlDataSet
        });
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        data.ControlDataSet = me.pnlDataControl.save();
        data.XmlDataSet = me.pnlDataControl.importdataset;
        me.property.sprite.drawContainer.process.GlobalTableIdentitys = me.pnlDataControl.grid.getTableIdentitys();

        return data;
    }
});