/*
config
*/

Ext.define('YZSoft.bpm.src.flowchart.dialogs.Join', {
    extend: 'YZSoft.bpm.src.flowchart.dialogs.Abstract', //999999

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlGeneral = Ext.create('YZSoft.bpm.propertypages.JoinGeneral', {
            padding: '26 26 0 26'
        });

        me.pnlRules = Ext.create('YZSoft.bpm.propertypages.Rules', {
            padding: '20 20 0 20',
            navBar: {
                width: 246
            },
            tables: config.property.sprite.drawContainer.process.GlobalTableIdentitys,
            rules: [{
                name: 'JoinPassRule',
                xclass: 'YZSoft.bpm.src.editor.VoteRuleEditor'
            }, {
                name: 'JoinRejectRule',
                xclass: 'YZSoft.bpm.src.editor.VoteRuleEditor'
            }]
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            tabBar: {
                cls: 'yz-tab-bar-window-main'
            },
            items: [
                me.pnlGeneral,
                me.pnlRules
            ]
        });

        me.pnlGeneral.on({
            scope: me,
            joinTypeChanged: 'onJoinTypeChanged'
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
        me.pnlRules.fill(data.Rules);
    },

    save: function () {
        var me = this,
            data;

        data = me.pnlGeneral.save();
        data.Rules = me.pnlRules.save();

        return data;
    },

    onJoinTypeChanged: function (joinType) {
        var me = this;

        if (joinType == 'Normal') {
            me.tabMain.remove(me.pnlRules, false);
        }
        else {
            if (!me.tabMain.contains(me.pnlRules))
                me.tabMain.add(me.pnlRules);
        }
    }
});