
Ext.define('YZSoft.src.toolbar.item.SpritePattern', {
    extend: 'YZSoft.src.toolbar.item.ListContainer',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlPattern = Ext.create('YZSoft.src.panel.SpritePattern', {
        });

        me.pnlPattern.on({
            itemClick: function (template) {
                me.fireEvent('itemClick', template);
            }
        });

        cfg = {
            items: [me.pnlPattern]
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onMoreClick: function () {
        var me = this,
            menu;

        menu = Ext.create('Ext.menu.Menu', {
            bodyBorder: false,
            bodyStyle: 'background:#f7f8f8; padding:10px; background-image:none',
            showSeparator: false,
            width: me.getWidth(),
            items: [{
                xtype: 'panel',
                border: false,
                scrollable: 'y',
                items: [{
                    xclass: 'YZSoft.src.panel.SpritePattern',
                    listeners: {
                        itemClick: function (template) {
                            Ext.menu.Manager.hideAll();
                            me.fireEvent('itemClick', template);
                        }
                    }
                }]
            }]
        });

        menu.showBy(me, 'tr-tr?');
        menu.focus();
    }
});