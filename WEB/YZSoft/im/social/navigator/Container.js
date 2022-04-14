
Ext.define('YZSoft.im.social.navigator.Container', {
    extend: 'YZSoft.src.container.ModuleContainer',
    cls: ['yz-identity-modulescontainer'],

    constructor: function (config) {
        var me = this,
            cfg;

        me.pnlChannel = Ext.create('YZSoft.im.social.navigator.ChannelPanel', {
            listeners: {
                scope: me,
                searchFocus:'onSearchFocus'
            }
        });

        cfg = {
            items: [me.pnlChannel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.pnlChannel, ['channelItemclick']);
        me.pnlChannel.relayEvents(me, ['moduleActivate']);
    },

    onSearchFocus: function () {
        var me = this;

        me.searchPanel = me.showModule({
            xclass: 'YZSoft.im.social.navigator.SearchPanel',
            config: {
                listeners: {
                    clearclick: function () {
                        me.pnlChannel.search.focusable = false;
                        me.closeModule(this, true);
                        me.pnlChannel.search.focusable = true;
                    },
                    summarymessageclick: function (view, record, item, index, e, eOpts) {
                        e.stopEvent();

                        me.showModule({
                            xclass: 'YZSoft.im.social.navigator.ChannelResultPanel',
                            config: {
                                resName: record.data.resName,
                                resType: record.data.resType,
                                resId: record.data.resId,
                                total: record.data.total,
                                kwd: me.searchPanel.pnlResult.kwd,
                                listeners: {
                                    back: function () {
                                        me.closeModule(this,true);
                                    }
                                }
                            },
                            match: function (item) {
                                return false;
                            },
                            callback: function (pnl, exist) {
                                if (!exist) {
                                    me.relayEvents(pnl, ['messageclick']);
                                }
                            }
                        });
                    },
                    searchBlur: function (field, e) {
                        var text = field.getValue();
                        if (!text) {
                            me.pnlChannel.search.focusable = false;
                            me.closeModule(this, true);
                            me.pnlChannel.search.focusable = true;
                        }
                    }
                }
            },
            match: function (item) {
                return false;
            },
            callback: function (pnl, exist) {
                if (!exist) {
                    me.relayEvents(pnl, ['searchchannelclick', 'userclick', 'messageclick']);
                }
            }
        });
    }
});