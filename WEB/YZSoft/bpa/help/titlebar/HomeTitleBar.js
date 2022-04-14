
Ext.define('YZSoft.bpa.help.titlebar.HomeTitleBar', {
    extend: 'YZSoft.bpa.src.toolbar.TitleBar',
    layout: {
        type: 'hbox',
        align: 'middle'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.caption = Ext.create('YZSoft.bpa.src.toolbar.items.Caption', {
            html: RS.$('BPA_Title_Help')
        });

        me.headshort = Ext.create('YZSoft.bpa.src.toolbar.items.Headshort', {
            margin: '0 0 0 4'
        });

        me.btnUser = Ext.create('YZSoft.bpa.src.toolbar.items.Account', {
            margin: '0 10 0 0'
        });

        cfg = {
            items: [
                me.logo,
                me.sp1,
                me.caption,
                '->',
                me.headshort,
                me.btnUser
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});