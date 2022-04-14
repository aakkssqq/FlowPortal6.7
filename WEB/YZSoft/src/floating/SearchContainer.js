
/*
config
container
*/
Ext.define('YZSoft.src.floating.SearchContainer', {
    extend: 'Ext.container.Container',
    cls:'yz-pnl-searchcontainer-floating',
    width: '100%',
    scrollable: true,
    floating: true,
    shadow:true,
    draggable: false,
    constrain: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.searchPanel = Ext.create(Ext.apply({}, {
            popup: true,
            margin: '20 20 0 20'
        }, config.searchPanel));
        delete config.searchPanel;

        me.btnSearch = Ext.create('Ext.button.Button', {
            text: RS.$('All_Search'),
            cls:'yz-btn-submit yz-btn-round3',
            handler: function () {
                me.hide(null, function () {
                    Ext.defer(function () {
                        me.searchPanel.onSearchClick();
                    },0);
                });
            }
        });

        me.btnClear = Ext.create('Ext.button.Button', {
            text: RS.$('All_Reset'),
            cls: 'yz-btn-round3',
            handler: function () {
                me.searchPanel.onResetClick();
            }
        });

        me.btnClose = Ext.create('Ext.button.Button', {
            text: RS.$('All_Close'),
            cls: 'yz-btn-round3',
            handler: function () {
                me.hide();
            }
        });

        cfg = {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: [me.searchPanel, {
                xtype: 'toolbar',
                border: false,
                padding: '25 0 38 0',
                layout: {
                    type: 'hbox',
                    pack: 'middle'
                },
                defaults: {
                    padding: '8 26',
                    margin: '0 5'
                },
                items: [me.btnSearch, me.btnClear, me.btnClose]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});