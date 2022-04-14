
Ext.define('YZSoft.im.social.navigator.view.SearchResult', {
    extend: 'YZSoft.im.social.navigator.view.Abstract',
    requires: [
        'YZSoft.im.src.model.ChannelSearchResult',
        'YZSoft.bpm.src.model.User',
        'YZSoft.im.src.model.MessageSearchResult'
    ],
    scrollable: true,

    constructor: function (config) {
        var me = this,
            cfg;

        me.cmpEmpty = Ext.create('Ext.Component', {
            hidden: true,
            emptyText: Ext.String.format('<div class="yz-im-list-emptytext">{0}</div>', RS.$('All_IM_Empty_SearchResult')),
        });

        me.storeTopic = Ext.create('Ext.data.Store', {
            model: 'YZSoft.im.src.model.ChannelSearchResult'
        });

        me.listTopic = Ext.create('Ext.view.View', {
            store: me.storeTopic,
            scrollable: false,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-im-list-item-channel',
            tpl: [
                '<tpl for=".">',
                '<div class="d-flex flex-row yz-im-list-item-channel yz-im-list-item-channel-singleline yz-im-list-item-{resType}">',
                    '<div class="yz-column-left">',
                    '<tpl switch="resType">',
                        '<tpl case="Task">',
                            '<div class="type taskimg" style="background-color:{ext:this.renderProcessBackgroundColor}">{ext:this.renderProcessShortName}</div>',
                        '<tpl case="Group">',
                            '<div class="type groupimg" style="background-image:url({ext:this.renderGroupImage})"></div>',
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
                        '<div class="title">{[this.renderTitle(values)]}</div>',
                    '</div>',
                '</div>',
                '</tpl>', Ext.apply({
                }, me.renders)
            ],
            listeners: {
                scope: me,
                select: function (view, record, The, eOpts) {
                    me.listUser.getSelectionModel().deselectAll();
                    me.listMessage.getSelectionModel().deselectAll();
                },
                itemclick: function (view, record, item, index, e, eOpts) {
                    me.fireEvent('searchchannelclick', view, record, item, index, e, eOpts);
                }
            }
        });

        me.cntTopic = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            hidden:true,
            items: [{
                xtype: 'component',
                html: RS.$('All_Social_Search_Group_Title'),
                cls: ['yz-im-searchresult-topic']
            }, me.listTopic]
        });

        me.storeUser = Ext.create('Ext.data.JsonStore', {
            model: YZSoft.bpm.src.model.User
        });

        me.listUser = Ext.create('Ext.view.View', {
            store: me.storeUser,
            scrollable: false,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-im-list-item-channel',
            tpl: [
                '<tpl for=".">',
                '<div class="d-flex flex-row yz-im-list-item-channel yz-im-list-item-channel-singleline yz-im-list-item-user">',
                    '<div class="yz-column-left">',
                        '<div class="type groupimg" style="background-image:url({headsort})"></div>',
                    '</div>',
                    '<div class="flex-fill yz-column-center">',
                        '<div class="title">{ShortName:this.renderString}</div>',
                    '</div>',
                '</div>',
                '</tpl>', Ext.apply({
                }, me.renders)
            ],
            listeners: {
                scope: me,
                select: function (view, record, The, eOpts) {
                    me.listTopic.getSelectionModel().deselectAll();
                    me.listMessage.getSelectionModel().deselectAll();
                },
                itemclick: function (view, record, item, index, e, eOpts) {
                    me.fireEvent('userclick', view, record, item, index, e, eOpts);
                }
            }
        });

        me.cntUser = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            hidden: true,
            items: [{
                xtype: 'component',
                html: RS.$('All_Social_Search_User_Title'),
                cls: ['yz-im-searchresult-topic']
            }, me.listUser]
        });

        me.storeMessage = Ext.create('Ext.data.Store', {
            model: 'YZSoft.im.src.model.MessageSearchResult'
        });

        me.listMessage = Ext.create('Ext.view.View', {
            store: me.storeMessage,
            scrollable: false,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-im-list-item-channel',
            tpl: [
                '<tpl for=".">',
                '<div class="d-flex flex-row yz-im-list-item-channel yz-im-list-item-{resType}-withmsg">',
                    '<div class="yz-column-left">',
                        '<tpl switch="resType">',
                            '<tpl case="Task">',
                                '<div class="type taskimg" style="background-color:{ext:this.renderProcessBackgroundColor}">{ext:this.renderProcessShortName}</div>',
                            '<tpl case="Group">',
                                '<div class="type groupimg" style="background-image:url({ext:this.renderGroupImage})"></div>',
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
                        '<div class="title">{[this.renderTitle(values)]}</div>',
                        '<div class="desc">{[this.renderMessageSearchResult(values)]}</div>',
                    '</div>',
                    '<tpl if="total==1">',
                        '<div class="yz-column-right">',
                            '<div class="date">{date:this.renderDate}</div>',
                        '</div>',
                    '</tpl>',
                '</div>',
                '</tpl>', Ext.apply({
                }, me.renders)
            ],
            listeners: {
                scope: me,
                select: function (view, record, The, eOpts) {
                    me.listTopic.getSelectionModel().deselectAll();
                    me.listUser.getSelectionModel().deselectAll();
                },
                itemclick: function (view, record, item, index, e, eOpts) {
                    if (record.data.total != 1)
                        me.fireEvent('summarymessageclick', view, record, item, index, e, eOpts);
                    else
                        me.fireEvent('messageclick', view, record, item, index, e, eOpts);
                }
            }
        });

        me.cntMessage = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            hidden: true,
            items: [{
                xtype: 'component',
                html: RS.$('All_Social_Search_Message_Title'),
                cls: ['yz-im-searchresult-topic']
            }, me.listMessage]
        });

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.cmpEmpty, me.cntTopic, me.cntUser, me.cntMessage]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    search: function (kwd) {
        var me = this,
            kwd = (kwd || '').trim();

        if (!kwd)
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                method: 'SearchSocial',
                kwd: kwd
            },
            success: function (action) {
                var topics = action.result.topics,
                    users = action.result.users,
                    messages = action.result.messages,
                    total = topics.length + users.length + messages.length;

                me.kwd = kwd;

                me.cmpEmpty[total ? 'hide' : 'show']();

                me.storeTopic.setData(topics);
                me.cntTopic[topics.length ? 'show' : 'hide']();

                me.storeUser.setData(users);
                me.cntUser[users.length ? 'show' : 'hide']();

                me.storeMessage.setData(messages);
                me.cntMessage[messages.length ? 'show' : 'hide']();
            }
        });
    }
});