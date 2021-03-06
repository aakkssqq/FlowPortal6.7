/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.ESBAdapter', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            tables = config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.ESBGeneral', {
            padding: '20 26 0 26',
            tables: tables,
            listeners: {
                flowchange: function (field, newValue, oldValue, eOpts) {
                    me.pnlInput.tagTree.setFlowName(newValue);
                    me.pnlOutput.srcTree.setFlowName(newValue);
                }
            }
        });

        me.pnlInput = Ext.create('YZSoft.src.jmap.BPMProcessCallESBInputMap', {
            padding: '0 0 5 0',
            tables: tables
        });

        me.pnlOutput = Ext.create('YZSoft.src.jmap.BPMProcessCallESBOutputMap', {
            padding: '0 0 5 0',
            tables: tables
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlInput,
                me.pnlOutput
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

        me.pnlGeneral.fill(Ext.copyTo({}, data, 'Name,FlowName,UseQueue,QueueName'));
        me.pnlInput.fill(Ext.copyTo({}, data, 'InputCode'));
        me.pnlOutput.fill(Ext.copyTo({}, data, 'OutputCode'));
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        Ext.apply(data, me.pnlInput.save());
        Ext.apply(data, me.pnlOutput.save());

        return data;
    }
});