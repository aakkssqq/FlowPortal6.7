
Ext.define('YZSoft.im.social.bbs.core.BBS', {
    extend: 'Ext.container.Container',
    layout: 'border',
    style:'background-color:#fff',

    constructor: function (config) {
        var me = this,
            cfg;

        me.view = Ext.create('YZSoft.im.src.chat.BBS', Ext.apply({
            region: 'center',
            scrollable: false,
            resType: config.resType,
            resId: config.resId,
            folderid: config.folderid,
            loadMask: {
                target: me
            }
        }, config.viewConfig));

        me.comments = Ext.create('YZSoft.im.src.comments.BBS', Ext.apply({
            region: 'north',
            height: 128,
            padding: '0 0 30 0'
        }, config.commentsConfig));

        cfg = {
            items: [me.comments, me.view]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.comments.on({
            scope: me,
            send: 'onSendComments'
        });

        me.view.relayEvents(me, ['activate']);
    },

    setTopic: function (config, loadOption) {
        var me = this;

        Ext.apply(me, config);
        me.view.setTopic(config, loadOption);
    },

    onSendComments: function (message) {
        var me = this;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                method: 'PostComments',
                resType: me.resType,
                resId: me.resId
            },
            jsonData: {
                message: message
            },
            waitMsg: {
                msg: RS.$('All_Sending'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.view.store.reload({
                    loadMask: {
                        msg: RS.$('All_Sucess_SendComments'),
                        msgCls: 'yz-mask-msg-success',
                        target: me,
                        start: 0
                    },
                    callback: function () {
                        me.comments.setValue('');
                        me.comments.focus();
                    }
                });
            }
        });
    }
});