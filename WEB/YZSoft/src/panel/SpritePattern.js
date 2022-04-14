
Ext.define('YZSoft.src.panel.SpritePattern', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'table',
        columns: 4
    },

    constructor: function (config) {
        var me = this,
            items = [];

        //line 3
        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#f5b027',
            strokeOpacity: 1,
            fillStyle: {
                type: 'linear',
                degrees: 270,
                stops: [{
                    offset: 0,
                    color: '#f7ee13'
                }, {
                    offset: 0.8,
                    color: '#f8b82b'
                }, {
                    offset: 1,
                    color: '#f8b82b'
                }]
            }
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#e93c2f',
            strokeOpacity: 1,
            fillStyle: {
                type: 'linear',
                degrees: 270,
                stops: [{
                    offset: 0,
                    color: '#f18d56'
                }, {
                    offset: 0.8,
                    color: '#ea5413'
                }, {
                    offset: 1,
                    color: '#ea5413'
                }]
            }
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#faa533',
            strokeOpacity: 1,
            fillStyle: {
                type: 'linear',
                degrees: 270,
                stops: [{
                    offset: 0,
                    color: '#fbe490'
                }, {
                    offset: 0.8,
                    color: '#efaf1e'
                }, {
                    offset: 1,
                    color: '#efaf1e'
                }]
            }
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#14ae67',
            strokeOpacity: 1,
            fillStyle: {
                type: 'linear',
                degrees: 270,
                stops: [{
                    offset: 0,
                    color: '#d5e7b7'
                }, {
                    offset: 0.80,
                    color: '#7cc05a'
                }, {
                    offset: 1,
                    color: '#7cc05a'
                }]
            }
        }));

        //line 1
        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#f5b027',
            strokeOpacity: 1
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#e93c2f',
            strokeOpacity: 1
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#faa533',
            strokeOpacity: 1
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#14ae67',
            strokeOpacity: 1
        }));

        //line 2
        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#f5b027',
            strokeOpacity: 1,
            fillStyle: '#f8b82b'
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#e93c2f',
            strokeOpacity: 1,
            fillStyle: '#ea5413'
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#faa533',
            strokeOpacity: 1,
            fillStyle: '#efaf1e'
        }));

        items.push(me.createItem({
            lineWidth: 1,
            strokeStyle: '#14ae67',
            strokeOpacity: 1,
            fillStyle: '#7cc05a'
        }));

        var cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createItem: function (config) {
        var me = this,
            btn, cfg = {};

        cfg.sprite = Ext.create('Ext.draw.sprite.Rect', Ext.apply({
            x: 2,
            y: 2,
            width: 46,
            height: 46,
            radius: 8
        }, config));

        cfg.template = config;

        cfg.bbox = cfg.sprite.getBBox();

        cfg.drawContainer = Ext.create('Ext.draw.Container', {
            border: false,
            width: 50,
            height: 50,
            bodyStyle: 'background-color:transparent;',
            sprites: [cfg.sprite]
        });

        btn = Ext.create('Ext.container.Container', Ext.apply({
            layout: 'fit',
            border: true,
            cls: 'yz-pattern-button-cnt',
            overCls: 'yz-pattern-button-over',
            margin: 5,
            addOverCls: function () {
                this.addCls(this.overCls);
            },
            removeOverCls: function () {
                this.removeCls(this.overCls);
            },
            items: [cfg.drawContainer]
        }, cfg));

        btn.on({
            afterrender: function () {
                this.getEl().on({
                    scope:this,
                    mousedown: function (e) {
                        e.stopEvent();
                        me.fireEvent('itemClick', this.template, this, e);
                    }
                });
            }
        });

        return btn;
    }
});