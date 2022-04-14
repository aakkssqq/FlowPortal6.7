/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Interface', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.InterfaceGeneral', {
            padding: '26 26 0 26',
            tables: tables
        });

        me.pnlDataControl = Ext.create('YZSoft.bpm.propertypages.DataControlSimple', {
            title: RS.$('All_ImportCallData'),
            padding: '15 20 0 20',
            genXsdButtonConfig: {
                text:RS.$('All_ExportDataExchangeXSD')
            },
            nameColumnConfig: {
                text: RS.$('Process_ProcessData')
            },
            captionConfig: {
                text: RS.$('All_Caption_ImportCallData')
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
                me.pnlDataControl.setImportDataSet({ Tables: tables });
            }
        });

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,InterfaceName'));
        me.pnlDataControl.setImportDataSet(data.InterfaceDataSet);
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
        data.InterfaceDataSet = me.pnlDataControl.importdataset;
        me.property.sprite.drawContainer.process.GlobalTableIdentitys = me.pnlDataControl.grid.getTableIdentitys();

        return data;
    }
});