/*
resName,
resType,
resId,
total,
kwd
*/

Ext.define('YZSoft.im.social.navigator.view.ChannelResult', {
    extend: 'YZSoft.im.social.navigator.view.Abstract',
    requires: [
        'YZSoft.im.src.model.MessageSearchResult'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.im.src.model.MessageSearchResult',
            pageSize: -1,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
                extraParams: {
                    method: 'SearchSocialMessagesInTopic',
                    resType: config.resType,
                    resId: config.resId,
                    kwd: config.kwd
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.cmpDesc = Ext.create('Ext.Component', {
            region: 'north',
            cls: ['yz-im-searchresult-topic'],
            tpl: RS.$('All_Social_Search_TopicResult_Topic'),
            data: {
                resName: config.resName,
                total: config.total,
                kwd: config.kwd
            }
        });

        me.list = Ext.create('Ext.view.View', {
            region: 'center',
            store: me.store,
            scrollable: true,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-im-list-item-channel',
            tpl: [
                '<tpl for=".">',
                '<div class="d-flex flex-row yz-im-list-item-channel yz-im-list-item-{resType}">',
                    '<div class="yz-column-left">',
                        '<tpl switch="resType">',
                            '<tpl case="Task">',
                                '<div class="type taskimg" style="background-color:{ext:this.renderProcessBackgroundColor}">{ext:this.renderProcessShortName}</div>',
                            '<tpl case="Group">',
                                '<div class="type groupimg" style="background-image:url({headsort})"></div>',
                            '<tpl case="SingleChat">',
                                '<div class="type groupimg" style="background-image:url({ext:this.renderSingleChatPeerHeadshot})"></div>',
                            '<tpl case="TaskApproved">',
                                '<div class="type taskapprovedimg"></div>',
                            '<tpl case="TaskRejected">',
                                '<div class="type taskrejectedimg"></div>',
                            '<tpl case="ProcessRemind">',
                                '<div class="type processremindimg"></div>',
                            '<tpl case="AdministratorNotification">',
                                '<div class="type administratornotificationimg"></div>',
                            '<tpl default>',
                                '<div class="type">{resType}</div>',
                        '</tpl>',
                    '</div>',
                    '<div class="flex-fill yz-column-center">',
                        '<div class="title">{[this.renderUserName(values)]}</div>',
                        '<div class="desc">{message:this.renderMessage}</div>',
                    '</div>',
                    '<div class="yz-column-right">',
                        '<div class="date">{date:this.renderDate}</div>',
                    '</div>',
                '</div>',
                '</tpl>', Ext.apply({
                }, me.renders)
            ],
            listeners: {
                scope: me,
                itemclick: function (view, record, item, index, e, eOpts) {
                    me.fireEvent('messageclick', view, record, item, index, e, eOpts);
                }
            }
        });

        cfg = {
            layout: 'border',
            items: [me.cmpDesc, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.list.on({
            single: true,
            render: function () {
                me.store.load({
                    loadMask: false,
                    callback: function (records, operation, success) {
                        if (success) {
                            me.cmpDesc.setData({
                                resName: me.resName,
                                total: me.store.getTotalCount(),
                                kwd: me.kwd
                            });
                        }
                    }
                });
            }
        });
    }
});