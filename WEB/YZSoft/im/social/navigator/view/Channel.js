
Ext.define('YZSoft.im.social.navigator.view.Channel', {
    extend: 'YZSoft.im.social.navigator.view.Abstract',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.im.src.model.Channel',
    ],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.im.src.model.Channel',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
                extraParams: {
                    method: 'GetNotifyTopics'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.list = Ext.create('Ext.view.View', {
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
                        '<div class="desc">{message:this.renderMessage}</div>',
                    '</div>',
                    '<div class="yz-column-right">',
                        '<div class="date">{date:this.renderDate}</div>',
                        '<div class="badge">{newmessage:this.renderBadge}</div>',
                    '</div>',
                '</div>',
                '</tpl>', Ext.apply({
                }, me.renders)
            ]
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.list.on({
            single: true,
            render: function () {
                me.store.load({
                    loadMask: false,
                    callback: function () {
                        me.on({
                            moduleActivate: function () {
                                me.store.loadPage(1, {
                                    loadMask: false
                                });
                            }
                        });

                        YZSoft.src.ux.Push.subscribe({
                            cmp: me,
                            channel: ['social', 'taskApproved', 'taskRejected', 'processRemind','administratorNotification'],
                            fn: function () {
                                YZSoft.src.ux.Push.on({
                                    scope: me,
                                    social: function (message) {
                                        if (message.clientid == YZSoft.src.ux.Push.clientid)
                                            return;

                                        me.onNotify(message);
                                    },
                                    taskApproved: 'onNotify',
                                    taskRejected: 'onNotify',
                                    processRemind: 'onNotify',
                                    administratorNotification: 'onNotify'
                                });
                            }
                        });
                    }
                });
            }
        });

        me.relayEvents(me.list, ['itemclick'], 'channel');

        Ext.getDoc().on({
            channelopen: function (resType, resId) {
                me.store.each(function (record) {
                    if (record.data.resType == resType && record.data.resId == resId)
                        record.set('newmessage', 0);
                });
            }
        });
    },

    onNotify: function (message) {
        var me = this;
        me.store.loadPage(1, {
            loadMask: false
        });
    }
});