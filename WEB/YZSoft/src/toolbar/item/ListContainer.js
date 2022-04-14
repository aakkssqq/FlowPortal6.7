
Ext.define('YZSoft.src.toolbar.item.ListContainer', {
    extend: 'Ext.panel.Panel',
    layout: 'hbox',
    scrollable: {
        x: false,
        y: false
    },
    height: 64,
    onMoreClick: Ext.emptyFn,

    constructor: function (config) {
        var me = this,
            spConfig = config.spConfig || me.spConfig,
            cfg;

        me.btnUp = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-arrow-up',
            disabled: true,
            handler: function () {
                me.setScrollY(Math.max(me.getScrollY() - 62, 0), true);
            }
        });

        me.btnDown = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-arrow-down',
            handler: function () {
                me.setScrollY(me.getScrollY() + 62, true);
            }
        });

        me.btnMore = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e92a',
            cls: 'yz-btn-listcnt yz-btn-listcnt-last',
            scope: me,
            handler: 'onMoreClick'
        });


        cfg = {
            dockedItems: [{
                xtype: 'toolbar',
                cls: 'yz-listcnt-toolbar',
                dock: 'right',
                padding: 0,
                layout: {
                    type: 'vbox'
                },
                defaults: {
                    cls: 'yz-btn-listcnt',
                    ui: 'yzflat',
                    height: 20
                },
                items: [me.btnUp, me.btnDown, me.btnMore]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        var scroller = me.getScrollable();
        if (scroller) {
            scroller.on({
                scroll: function () {
                    var pos = this.getPosition(),
                        posMin = 0,
                        posMax = this.getMaxPosition();

                    me.btnUp.setDisabled(pos.y <= posMin.y);
                    me.btnDown.setDisabled(pos.y >= posMax.y);
                }
            });
        }
    }
});