
/*
tabBar
btnConfig
*/
Ext.define('YZSoft.src.tab.TabBarColumnWrap', {
    extend: 'Ext.container.Container',
    layout: {
        type: 'hbox',
        align: 'start'
    },
    cls:'yz-container-columntabwrap',
    expandCls: 'yz-container-columntabwrap-expanded',

    constructor: function (config) {
        var me = this,
            columns = me.columns = config.tabBar.getLayout().columns,
            cfg;

        me.btnMore = Ext.create('Ext.button.Button', Ext.apply({
            cls: 'yz-btn-portal-title yz-size-icon-22 more',
            glyph: 0xe960,
            height: config.height,
            hidden:true,
            scope:me,
            handler: 'onButtonClick'
        }, config.btnConfig));

        cfg = {
            items: [config.tabBar, me.btnMore]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.tabBar.on({
            change: function (tabBar, tab, card, eOpts) {
                me.removeCls(me.expandCls);
            },
            add: function () {
                if (me.tabBar.items.items.length >= me.columns)
                    me.btnMore.show();
            }
        });
    },

    onFocusLeave: function () {
        var me = this;

        me.removeCls(me.expandCls);
    },

    onButtonClick: function () {
        var me = this;

        if (me.hasCls(me.expandCls))
            me.removeCls(me.expandCls);
        else
            me.addCls(me.expandCls);
    }
});