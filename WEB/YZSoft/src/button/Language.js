Ext.define('YZSoft.src.button.Language', {
    extend: 'Ext.button.Button',
    langs: RS.$('All_Languages').split(','),
    cls: 'yz-btn-language',
    menuAlign: 'tr-br?',
    arrowVisible: false,

    constructor: function (config) {
        var me = this,
            langs = config.langs || me.langs,
            lcid = RS.$('All_Languages_Cur_LCID'),
            items = [];

        Ext.each(langs, function (lang) {
            items.push({
                icon: me.getLangIconUrl(lang),
                text: RS.$('All_Languages_' + lang),
                lcid: lang,
                scope: me,
                handler: 'onItemClick'
            });
        });

        cfg = {
            icon: me.getLangIconUrl(lcid),
            menu: {
                cls: 'yz-menu-language',
                shadow: false,
                bodyPadding: '12 0',
                defaults: {
                    padding: '3 16'
                },
                items: items
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getLangIconUrl: function (lang) {
        return YZSoft.$url(Ext.String.format('YZSoft/theme/images/lang_{0}.png', lang));
    },

    onItemClick: function (item) {
        var me = this,
            lcid = item.lcid,
            curlcid = RS.$('All_Languages_Cur_LCID');

        if (lcid == curlcid)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Basic.ashx'),
            params: {
                method: 'SetLanguage',
                lcid: lcid
            },
            success: function () {
                window.location.reload(true);
            }
        });
    }
});