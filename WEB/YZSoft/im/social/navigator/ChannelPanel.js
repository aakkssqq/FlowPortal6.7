
Ext.define('YZSoft.im.social.navigator.ChannelPanel', {
    extend: 'Ext.container.Container',
    cls: ['yz-im-social-navigator'],

    constructor: function (config) {
        var me = this,
            cfg;

        me.search = Ext.create('Ext.form.field.Text', {
            cls: 'yz-field-im-search',
            margin: '0px 35px'
        });

        me.pnlSearch = Ext.create('Ext.container.Container', {
            region: 'north',
            height: 100,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack:'center'
            },
            items: [me.search]
        });

        me.pnlChannel = Ext.create('YZSoft.im.social.navigator.view.Channel', {
            region: 'center',
            layout: 'card'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlSearch, me.pnlChannel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.pnlChannel, ['channelItemclick']);
        me.relayEvents(me.search, ['focus'],'search');

        me.pnlChannel.relayEvents(me, ['moduleActivate']);
    }
});