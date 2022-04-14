
Ext.define('YZSoft.bpa.library.toolbar.LibrariesTitleBar', {
    extend: 'YZSoft.bpa.src.toolbar.TitleBar',
    layout: {
        type: 'hbox',
        align: 'middle'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

        me.caption = Ext.create('YZSoft.bpa.src.toolbar.items.Caption', {
            html: RS.$('BPA_Title_Library')
        });

        me.btnNewLib = Ext.create('Ext.button.Button', Ext.apply({
            text: RS.$('BPA_AddLib'),
            iconCls: 'yz-glyph yz-glyph-e61d'
        },config.newBtnConfig));

        me.headshort = Ext.create('YZSoft.bpa.src.toolbar.items.Headshort', {
            margin:'0 0 0 4'
        });

        me.btnUser = Ext.create('YZSoft.bpa.src.toolbar.items.Account', {
            margin:'0 10 0 0'
        });

        cfg = {
            items: [
                me.logo,
                me.sp1,
                me.caption,
                '->',
                me.btnNewLib,
                me.btnNewLib.hidden ? null:me.sp,
                me.headshort,
                me.btnUser
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.btnNewLib, ['click'], 'newbtn');
    }
});