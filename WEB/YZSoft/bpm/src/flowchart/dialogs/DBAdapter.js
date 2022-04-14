/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.DBAdapter', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.DBAdapterGeneral', {
            padding: '26 26 0 26'
        });

        me.pnlMap = Ext.create('YZSoft.bpm.propertypages.DBAdapterMap', {
            padding: '20 20 5 20',
            tables: tables
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlMap
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

        me.pnlGeneral.fill(data);
        me.pnlMap.fill(Ext.copyTo({}, data, 'UpdateType,ExportDataSet'));
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        Ext.apply(data, me.pnlMap.save());

        return data;
    }
});