
Ext.define('YZSoft.src.frame.classic.MainTab', {
    extend: 'Ext.tab.Panel',
    tabBar: {
        height: 60,
        cls: ['yz-tab-default', 'yz-tab-main'],
        layout: {
            pack: 'end'
        }
    },
    border: false,
    plain: true,
    cls: 'yz-tab-wrap',
    bodyCls: 'yz-tab-body',
    deferredRender: true,
    hideTab: false,
    fixpackendbug: true,

    onAdd: function (item, index) {
        var me = this;

        item.tabConfig = item.tabConfig || {};

        if (me.hideTab === true) {
            if (index == 0)
                item.tabConfig.hidden = true;
            else
                me.items.getAt(0).tab.show();
        }

        item.tabConfig.baseCls = 'yz-tab';

        var cls = ['x-tab'];
        if (index == 0)
            cls.push('yz-tab-first');

        cls.push('yz-tab-zi-' + (30 - index));
        item.tabConfig.cls = cls.join(' ');

        item.tabConfig.listeners = {
            click: function (tab, e, eOpts) {
                var closeEl = e.getTarget('.yz-tab-close-btn');

                if (!closeEl)
                    return;

                tab.onCloseClick();
                tab.beforeClick(true);
            }
        };

        me.callParent(arguments);
    },

    onRemove: function (item, destroying) {
        var me = this;

        me.callParent(arguments);

        if (me.hideTab === true && me.items.getCount() == 1)
            me.items.getAt(0).tab.hide();
    },

    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        me.tabBar.renderTpl = [
        '<div class="yz-tab-banner">',
            me.bannerHtml || me.bannerTpl,
        '</div>',
        '<div id="{id}-body" data-ref="body" role="presentation" class="{baseBodyCls} {baseBodyCls}-{ui} ',
            '{bodyCls} {bodyTargetCls}{childElCls}"<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
            '{%this.renderContainer(out,values)%}',
        '</div>',
        '<div id="{id}-strip" data-ref="strip" role="presentation" class="{stripCls} {stripCls}-{ui}{childElCls}"></div>'
        ]

        Ext.apply(me.tabBar.renderData, me.bannerData);

        if (me.fixpackendbug) {
            me.tabBar.on({
                afterlayout: function (tabBar, layout, eOpts) {
                    if (layout.getPack() != 'start' && layout.overflowHandler && layout.overflowHandler.beforeRepeater && layout.overflowHandler.beforeRepeater.el && layout.overflowHandler.beforeRepeater.el.isVisible()) {
                        layout.setPack('start');
                        me.tabBar.updateLayout();
                    }
                    if (layout.getPack() != 'end' && layout.overflowHandler && layout.overflowHandler.beforeRepeater && layout.overflowHandler.beforeRepeater.el && !layout.overflowHandler.beforeRepeater.el.isVisible()) {
                        layout.setPack('end');
                        me.tabBar.updateLayout();
                    }
                }
            });
        }
    }
});