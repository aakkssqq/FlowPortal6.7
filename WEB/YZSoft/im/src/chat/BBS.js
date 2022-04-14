/*
resType
resId
*/

Ext.define('YZSoft.im.src.chat.BBS', {
    extend: 'YZSoft.im.src.chat.Abstract',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.src.model.Message',
        'YZSoft.im.src.converts.Converter'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.JsonStore', {
            model: 'YZSoft.src.model.Message',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                extraParams: {
                    Method: 'GetMessages',
                    resType: config.resType,
                    resId: config.resId
                }
            }
        });

        me.store.on({
            load: function (store, records, successful, operation, eOpts) {
                if (!successful)
                    return;

                if (records.length != 0) {
                    me.updateReaded(records[0].getId());
                }
            }
        });

        me.store.on({
            single:true,
            load: function (store, records, successful, operation, eOpts) {
                if (me.disablepush === true)
                    return;

                if (!successful)
                    return;

                YZSoft.src.ux.Push.subscribe({
                    cmp: me,
                    channel: me.channel,
                    fn: function () {
                        YZSoft.src.ux.Push.on({
                            message: 'onNotify',
                            scope: me
                        });
                    }
                });
                me.on({
                    destroy: function () {
                        YZSoft.src.ux.Push.unsubscribe({
                            cmp: me,
                            channel: me.channel
                        });
                    }
                });
            }
        });

        cfg = {
            store: me.store,
            scrollable: false,
            itemCls: 'yz-bbs-list-item',
            itemClsFirst: 'yz-bbs-list-item-first',
            itemClsLast: 'yz-bbs-list-item-last',
            replyClsFirst: 'yz-bbs-reply-wrap-first',
            replyClsLast: 'yz-bbs-reply-wrap-last',
            hideReplyItemCls: 'yz-bbs-list-item-hidereplies',
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.yz-bbs-list-item',
            tpl: [
                '<tpl for=".">',
                '<div class="{cls}">',
                    '<div class="yz-bbs-item-headshot">',
                        '<img src="{url}" />',
                    '</div>',
                    '<div class="yz-bbs-item-content-wrap">',
                        '<div class="yz-bbs-item-title-wrap">',
                            '<span class="yz-bbs-item-user">{UserDisplayName:text}</span><span class="yz-bbs-item-date">{date:date("Y-m-d H:i")}</span>',
                        '</div>',
                        '<div class="yz-bbs-item-txt">',
                            '<div class="yz-bbs-item-txt-inner">',
                                '{message}',
                            '</div>',
                        '</div>',
                        '<div class="yz-bbs-item-comments-wrap">',
                            '<a href="#" class="yz-bbs-item-comments-reply"><span class="yz-bbs-item-comments-text yz-bbs-item-comments-reply-text">' + RS.$('All_Reply') + '</span></a><span class="yz-bbs-item-comments-sp yz-bbs-item-comments-sp1">|</span>',
                            '<a href="#" class="yz-glyph-e926"><span class="yz-bbs-item-comments-text yz-glyph-e926-text">' + RS.$('All_Like')+'</span><span class="yz-bbs-item-comments-praised-wrap">(<span class="yz-bbs-item-comments-praised">{Praised}</span>)</span></a><span class="yz-bbs-item-comments-sp yz-bbs-item-comments-sp2">|</span>',
                            '<a href="#" class="yz-bbs-item-comments-transfer"><span class="yz-bbs-item-comments-text yz-bbs-item-comments-transfer-text">' + RS.$('All_Share')+'</span></a>',
                        '</div>',
                        '<div class="yz-bbs-item-replay-wrap">',
                            '<input type="text" class="yz-bbs-item-input-replay" placeholder="' + RS.$('All_YourComments')+'"/>',
                            '<tpl for="Replies">',
                                '<div class="{cls}">',
                                    '<div class="yz-bbs-item-headshot">',
                                        '<img src="{url}" />',
                                    '</div>',
                                    '<div class="yz-bbs-item-content-wrap">',
                                        '<div class="yz-bbs-reply-title-wrap">',
                                            '<span class="yz-bbs-item-user">{UserDisplayName}</span><span class="yz-bbs-reply-txt">{message}</span>',
                                        '</div>',
                                        '<div class="yz-bbs-reply-date">',
                                            '{date:date("Y-m-d H:i")}',
                                        '</div>',
                                    '</div>',
                                '</div>',
                                '<tpl if="last">',
                                '<tpl else>',
                                    '<div class="yz-bbs-reply-sp"></div>',
                                '</tpl>',
                            '</tpl>',
                        '</div>',
                    '</div>',
                    '<tpl if="last">',
                    '<tpl else>',
                        '<div class="yz-bbs-item-sp"></div>',
                    '</tpl>',
                '</div>',
                '</tpl>', {
                }],
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.resType && config.resId && config.autoLoad !== false) {
            me.store.load({
                loadMask: false
            });
        }

        if (config.resType && config.resId)
            me.channel = Ext.String.format('{0}/{1}', config.resType, config.resId);
    },

    onNotify: function (message) {
        var me = this,
            s = me.getScrollable(),
            r;

        if (message.channel != me.channel || message.clientid == YZSoft.src.ux.Push.clientid)
            return;

        if (me.isVisible(true)) {
            me.store.load({
                loadMask: false
            });
            me.updateReaded(message.message.id);
        }
        else {
            me.lastMessage = message;
        }
    },

    onActivate: function () {
        var me = this;

        if (me.lastMessage) {
            me.store.load({
                loadMask: false
            });
            me.updateReaded(me.lastMessage.message.id);

            delete me.lastMessage;
        }
    },

    setTopic: function (config, loadOption) {
        var me = this,
            params = me.store.getProxy().getExtraParams();

        Ext.apply(params, config);

        Ext.apply(me, config);

        if (config.resType && config.resId)
            me.channel = Ext.String.format('{0}/{1}', config.resType, config.resId);

        me.store.load(loadOption);
    },

    prepareData: function (data, recordIndex, record) {
        var me = this,
            replies = data.Replies || [];

        //头像url
        data.url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'GetHeadshot',
            account: data.uid,
            thumbnail: 'S'
        }));

        //行样式
        data.cls = [me.itemCls];

        if (replies.length == 0)
            data.cls.push(me.hideReplyItemCls);

        if (recordIndex == 0)
            data.cls.push(me.itemClsFirst);

        if (recordIndex == record.store.getCount() - 1) {
            data.cls.push(me.itemClsLast);
            data.last = true;
        }

        data.cls = data.cls.join(' ');

        //回复
        for (var i = 0; i < replies.length; i++) {
            var reply = replies[i];

            reply.url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'GetHeadshot',
                account: reply.uid,
                thumbnail: 'S'
            }));

            reply.cls = ['yz-bbs-reply-wrap'];
            if (i == 0)
                reply.cls.push(me.replyClsFirst);

            if (i == replies.length - 1) {
                reply.cls.push(me.replyClsLast);
                reply.last = true;
            }

            reply.cls = reply.cls.join(' ');
        }

        data.message = YZSoft.im.src.converts.Converter.convert(data.message);

        return this.callParent(arguments);
    },

    onItemKeyDown: function (record, item, index, e) {
        var me = this,
            target = Ext.get(e.getTarget());

        if (target.hasCls('yz-bbs-item-input-replay')) {
            if (e.getKey() == e.ENTER) {
                me.onCommitReply(record, target);
            }
        }

        me.callParent(arguments);
    },

    onItemClick: function (record, item, index, e) {
        var me = this,
            targetReply = Ext.get(e.getTarget('.yz-bbs-item-comments-reply')),
            targetLike = Ext.get(e.getTarget('.yz-glyph-e926'));
        if (targetReply)
            me.onReply(record);

        if (targetLike)
            me.onPraise(record);

        me.callParent(arguments);
    },

    onReply: function (record, inputEl) {
        var me = this,
            node = Ext.fly(me.getNode(record));

        if (!node)
            return;

        if (node.hasCls(me.hideReplyItemCls)) {
            node.removeCls(me.hideReplyItemCls);
        }
        else {
            if (record.data.Replies.length == 0)
                node.addCls(me.hideReplyItemCls);
        }
    },

    onCommitReply: function (record, inputEl) {
        var me = this,
            message = inputEl.getValue();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                method: 'Reply',
                messageid: record.data.id
            },
            jsonData: {
                message: message
            },
            waitMsg: {
                msg: RS.$('All_Replying'),
                target: me
            },
            success: function (action) {
                Ext.apply(record.data, action.result);
                record.commit();
            }
        });
    },

    onPraise: function (record) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                method: 'Praise',
                messageid: record.data.id
            },
            success: function (action) {
                var rv = action.result;
                record.set('Praised', rv.Praised);
            }
        });
    }
});