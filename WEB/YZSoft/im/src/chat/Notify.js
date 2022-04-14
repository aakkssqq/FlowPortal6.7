
/*
resType
resId
msgId
*/

Ext.define('YZSoft.im.src.chat.Notify', {
    extend: 'YZSoft.im.src.chat.Abstract',
    style: 'background-color:#e6eaec',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.src.model.Message',
        'YZSoft.im.src.converts.Converter'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.channel = config.channel || Ext.String.format('{0}/{1}', config.resType, config.resId);

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.Message',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                extraParams: {
                    method: 'GetSocialMessages',
                    resType: config.resType,
                    resId: config.resId,
                    msgId: 'msgId' in config ? Number(config.msgId) + 1 : undefined,
                    dir: 'prev',
                    rows: 20
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.store.on({
            load: function (store, records, successful, operation, eOpts) {
                if (!successful)
                    return;

                var params = operation.getRequest().getParams() || {};
                if (records.length != 0 && (params.dir == 'next' || !params.msgId)) {
                    me.updateReaded(records[records.length - 1].getId());
                }
            }
        });

        cfg = {
            store: me.store,
            scrollable: true,
            overItemCls: 'yz-item-over',
            selectedItemCls: 'yz-item-select',
            itemSelector: '.x-dataview-item-wrap',
            tpl: [
                '<tpl for=".">',
                '<div class="x-dataview-item-wrap d-flex flex-row justify-content-center">',
                    '<div class="x-dataview-item yz-list-item-notify">',
                        '<div class="time">{date:this.renderDate}</div>',
                        '<div class="message-wrap">',
                            '<div class="message">{message:this.renderMessage}</div>',
                        '</div>',
                    '</div>',
                '</div>',
                '</tpl>', {
                    renderDate: function (value) {
                        return Ext.Date.toFriendlyString(value);
                    },
                    renderMessage: function (value) {
                        var messages = me.messages = me.messages || {},
                            message = me.messages[value];

                        if (!message) {
                            message = YZSoft.im.src.converts.Converter.convert(value);
                            messages[value] = message;
                        }

                        return message;
                    }
                }
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            render: function () {
                me.store.load({
                    callback: function () {
                        me.getScrollable().scrollTo(0, -1);

                        if (me.disablepush !== true) {
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
                    }
                });
            }
        });
    }
});