/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.TimeTrigger', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.TimeTriggerGeneral', {
            padding: '26 26 0 26'
        });

        me.pnlFrequency = Ext.create('YZSoft.bpm.propertypages.Frequency', {
            padding: '26 26 0 26'
        });

        me.pnlDataControl = Ext.create('YZSoft.bpm.propertypages.DataControlSimple', {
            padding: '15 20 0 20',
            gridConfig: {
                tablePanelConfig: {
                    allowAddRecordConfig: {
                        hidden: true
                    },
                    filterConfig: {
                        hidden: true
                    }
                }
            }
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlFrequency,
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

        if (config.data)
            me.fill(config.data);
    },

    fill: function (data) {
        var me = this;

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name'));
        me.pnlFrequency.fill(data.Frequency);
        me.pnlDataControl.fill({
            tables: me.property.sprite.drawContainer.process.GlobalTableIdentitys,
            InitCreateRecordSet: data.InitCreateRecordSet,
            ControlDataSet: data.ControlDataSet
        });
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        data.Frequency = me.pnlFrequency.save();
        data.ControlDataSet = me.pnlDataControl.save();

        me.property.sprite.drawContainer.process.GlobalTableIdentitys = me.pnlDataControl.grid.getTableIdentitys();
        data.InitCreateRecordSet = me.pnlDataControl.grid.getInitCreateRecordSet();

        return data;
    }
});