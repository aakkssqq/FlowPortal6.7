/*
config:
url
backPanel
*/

Ext.define('YZSoft.src.panel.SiteMapPanel', {
    extend: 'Ext.panel.Panel',
    //floating: true,
    //renderTo: Ext.getBody(),
    border: false,
    region: 'center',
    width: 300,
    height: 300,

    constructor: function (config) {
        var me = this,
            html = '',
            groups;

        YZSoft.Ajax.request({
            url: YZSoft.$url(config.url || 'YZSoft.Services.REST/core/Sitemap.ashx'),
            async: false,
            params: { method: 'GetSitemap' },
            success: function (action) {
                groups = action.result;
            }
        });

        html = '<div class="caption">' +
                    '<div class="caption-title">' + 'FlowPortal BPM Utilits' + '</div>' +
                    '<a href="#" class="caption-close">' + RS.$('All_Close') + '</a>' +
                '</div>';

        Ext.each(groups, function (group) {
            var expanded = group.expanded !== false;

            var items = group.items,
                innerHtml = '';

            Ext.each(items, function (item) {
                if (item.hidden)
                    return;

                innerHtml +=
                    '<a class="item" href="' + item.url + '">' +
                        '<div class="item-icon-wrap icon-border-hexagon" style="color:' + (group.color || '#8fc33a') + '">' +
                            '<div class="item-icon icon-' + item.icon + '"></div>' +
                        '</div>' +
                        '<div class="item-text-wrap">' +
                            '<div class="item-text-wrap-inner">' +
                                '<div class="item-title">' + item.text + '</div>' +
                                '<div class="item-desc">' + item.desc + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</a>';
            });

            html +=
                '<div class="group">' +
                    '<div class="group-title">' + YZSoft.Render.renderString(group.title) + '</div>' +
                    '<div class="group-body">' +
                    innerHtml +
                    '</div>' +
                '</div>';
        });

        var cfg = {
            layout: 'anchor',
            cls: 'yz-sitemap-panel',
            scrollable: true,
            html: html,
            listeners: {
                afterrender: function () {
                    var ele = me.getEl().down('.caption-close');
                    me.mon(ele, 'click', function () {
                        YZSoft.frame123.getLayout().setActiveItem(me.backPanel);
                        YZSoft.frame123.remove(me);
                        me.destroy();
                    });
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});