
Ext.define('YZSoft.bpa.group.toolbar.GroupsTitleBar', {
    extend: 'YZSoft.bpa.src.toolbar.TitleBar',
    layout: {
        type: 'hbox',
        align: 'middle'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.caption = Ext.create('YZSoft.bpa.src.toolbar.items.Caption', {
            html: RS.$('BPA_Group')
        });

        me.btnNewGroup = Ext.create('Ext.button.Button', Ext.apply({
            text: RS.$('BPA_AddGroup'),
            iconCls: 'yz-glyph yz-glyph-e61d'
        }, config.newBtnConfig));

        me.headshort = Ext.create('YZSoft.bpa.src.toolbar.items.Headshort', {
            margin:'0 0 0 4'
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
                me.btnNewGroup,
                me.btnNewGroup.hidden ? null : me.sp,
                me.headshort,
                me.btnUser
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.btnNewGroup, ['click'], 'newbtn');
    }
});