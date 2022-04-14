/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.CallInterface', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.CallInterfaceGeneral', {
            padding: '26 26 0 26',
            tables: tables,
            interfaceStepNames: config.property.sprite.drawContainer.getAllInterfaceStepNames(config.property.sprite)
        });

        me.pnlCallDataMap = Ext.create('YZSoft.bpm.propertypages.ExportData', {
            title: RS.$('All_GenerateExchangeData'),
            padding: '15 20 0 20',
            tables: tables,
            nameColumnConfig: {
                text: RS.$('All_InterfaceData')
            },
            captionConfig: {
                text: RS.$('Process_Caption_TransDataToRemoteServer')
            },
            genXsdButtonConfig: {
                text:RS.$('All_ExportDataExchangeXSD')
            }
        });

        me.pnlCallDataMap.relayEvents(me.pnlGeneral, ['dataSchemaChanged']);

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlCallDataMap
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

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,RemoteServers'));
        me.pnlCallDataMap.fill(data.CallDataMap);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        data.CallDataMap = me.pnlCallDataMap.save();

        return data;
    }
});