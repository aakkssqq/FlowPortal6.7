
Ext.define('YZSoft.im.contact.Panel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlNavigator = Ext.create('YZSoft.im.contact.navigator.Panel', {
            region: 'west',
            width: 338,
            split: {
                size: 1,
                cls: 'yz-im-channel-split'
            },
            listeners: {
                scope: me,
                userclick: function (view, record, item, index, e, eOpts) {
                    e.stopEvent();

                    YZSoft.Ajax.request({
                        url: YZSoft.$url('YZSoft.Services.REST/core/P2PGroup.ashx'),
                        params: {
                            method: 'OpenOrCreateGroup',
                            peeraccount: record.data.data ? record.data.data.user.Account : record.data.Account
                        },
                        success: function (action) {
                            var cfg,
                                result = action.result;

                            cfg = {
                                title: result.resName,
                                groupid: result.groupid,
                                folderid: result.folderid
                            };

                            cfg.identity = Ext.encode(cfg);

                            record.pnlModule = me.pnlModule.showModule({
                                xclass: 'YZSoft.im.social.chat.SingleChatPanel',
                                config: cfg,
                                match: function (item) {
                                    return item.identity == cfg.identity;
                                }
                            });
                        }
                    });
                }
            }
        });

        me.pnlModule = Ext.create('YZSoft.src.container.ModuleContainer', {
            region: 'center',
            layout: 'card',
            cls: 'yz-identity-modulescontainer'
        });

        cfg = {
            layout: 'border',
            items: [me.pnlNavigator, me.pnlModule]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlModule.relayEvents(me, ['activate']);
    }
});