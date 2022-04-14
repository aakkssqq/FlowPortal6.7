/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.CodePlugin', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.CodePluginGeneral', {
            border: false,
            bodyStyle: 'background-color:transparent',
            padding: '26 20 0 20',
            tables:tables
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral
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

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,Code'));
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();

        return data;
    }
});