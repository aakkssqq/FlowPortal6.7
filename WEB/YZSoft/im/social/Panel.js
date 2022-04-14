
Ext.define('YZSoft.im.social.Panel', {
    extend: 'Ext.container.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlNavigator = Ext.create('YZSoft.im.social.navigator.Container', {
            region: 'west',
            width: 338,
            split: {
                size: 1,
                cls: 'yz-im-channel-split'
            },
            listeners: {
                channelItemclick: function (view, record, item, index, e, eOpts) {
                    e.stopEvent();
                    me.openChannel(record);
                },
                searchchannelclick: function (view, record, item, index, e, eOpts) {
                    e.stopEvent();
                    me.openChannel(record);
                },
                messageclick: function(view, record, item, index, e, eOpts) {
                    e.stopEvent();
                    me.openChannel(record, {
                        socialPanelConfig: {
                            disablepush:true,
                            msgId: record.data.id
                        }
                    });
                },
                userclick: function (view, record, item, index, e, eOpts) {
                    e.stopEvent();

                    YZSoft.Ajax.request({
                        url: YZSoft.$url('YZSoft.Services.REST/core/P2PGroup.ashx'),
                        params: {
                            method: 'OpenOrCreateGroup',
                            peeraccount: record.data.Account
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
        me.pnlNavigator.relayEvents(me, ['activate'], 'module');
    },

    openChannel: function (record, config) {
        var me = this,
            xclass, cfg;

        switch (record.data.resType) {
            case 'Task':
                xclass = 'YZSoft.im.social.chat.TaskPanel';
                cfg = Ext.apply({
                    title: record.data.resName,
                    tid: Number(record.data.resId)
                }, config);

                break;
            case 'Group':
                xclass = 'YZSoft.im.social.chat.GroupPanel';
                cfg = Ext.apply({
                    title: record.data.resName,
                    groupid: Number(record.data.resId),
                    editable: record.data.ext.GroupType == 'Chat'
                }, config);

                break;
            case 'SingleChat':
                xclass = 'YZSoft.im.social.chat.SingleChatPanel';
                cfg = Ext.apply({
                    title: record.data.resName,
                    groupid: Number(record.data.resId),
                    folderid: record.data.ext.FolderID
                }, config);

                break;
            case 'TaskApproved':
            case 'TaskRejected':
                xclass = 'YZSoft.im.social.notify.Panel';
                cfg = Ext.apply({
                    title: record.data.resName,
                    resType: record.data.resType,
                    resId: record.data.resId,
                }, config);

                break;
            case 'ProcessRemind':
                xclass = 'YZSoft.im.social.notify.Panel';
                cfg = Ext.apply({
                    title: record.data.resName,
                    resType: record.data.resType,
                    resId: record.data.resId,
                    channel: 'processRemind',
                }, config);

                break;
            case 'AdministratorNotification':
                xclass = 'YZSoft.im.social.notify.Panel';
                cfg = Ext.apply({
                    title: record.data.resName,
                    resType: record.data.resType,
                    resId: record.data.resId,
                    channel: 'administratorNotification',
                }, config);

                break;
            default:
                break;
        }

        if (!xclass)
            return;

        Ext.apply(cfg, {
        });

        cfg.identity = Ext.encode(cfg);

        record.pnlModule = me.pnlModule.showModule({
            xclass: xclass,
            config: cfg,
            match: function(item) {
                return item.identity == cfg.identity;
            }
        });
    }
});