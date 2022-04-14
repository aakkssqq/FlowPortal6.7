/*
config
stepid
*/
Ext.define('YZSoft.bpm.km.sprite.StepOverview', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlMain = Ext.create('YZSoft.bpm.km.sprite.StepOverviewMainPanel', {
            descPanelConfig: {
                title: RS.$('KM_StepOverview')
            }
        });

        me.pnlProperty = Ext.create('YZSoft.bpm.km.sprite.Property', {
        });

        me.pnlMain.pnlProperty = me.pnlProperty;

        cfg = {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                scrollable: true,
                flex: 10,
                padding: '10 18',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    border: false
                },
                items: [me.pnlMain]
            }, {
                xtype: 'container',
                scrollable: true,
                flex: 5,
                padding: '10 16',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                style: 'border-left:solid 1px #d6d6d6;',
                items: [me.pnlProperty]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            single: true,
            render: 'onPanelRender'
        });
    },

    onPanelRender: function () {
        var me = this;

        me.pnlMain.showSprite({
            stepid: me.stepid
        });
    }
});