
Ext.define('YZSoft.src.ux.Push', {
    extend: 'Ext.Evented',
    singleton: true,
    disabled: false,
    subscribes: {},

    init: function (args) {
        var me = this;
        args = args || {};

        if (me.disabled) {
            if (args.fn)
                args.fn.call(args.scope);
            return;
        }

        me.stoped = false;
        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/PushAssist.ashx'),
            exception: false,
            params: {
                method: 'RegisterClient'
            },
            success: function (action) {
                var subscribes = me.subscribes = me.subscribes || {},
                    channels = [],
                    fn;

                me.clientid = action.result.clientid;

                Ext.Object.each(subscribes, function (channel, cmps) {
                    if (cmps.length != 0)
                        channels.push(channel);
                });

                fn = function () {
                    me.receive();
                    me.fireEvent('inited');
                    if (args.fn)
                        args.fn.call(args.scope);
                };

                if (channels.length == 0) {
                    fn();
                }
                else {
                    me.subscribe({
                        ignoreRegister: true,
                        channel: channels,
                        fn: function () {
                            fn();
                        }
                    });
                }
            },
            failure: function (action) {
                Ext.defer(function () {
                    me.init();
                }, 3000);
            }
        });
    },

    receive: function () {
        if (this.disabled)
            return;

        var me = this;

        if (me.stoped)
            return;

        me.request = YZSoft.Ajax.request({
            exception: false,
            timeout: 30000,
            url: YZSoft.$url('YZSoft.Services.REST/core/Push.ashx'),
            params: {
                method: 'Receive',
                clientid: me.clientid
            },
            success: function (action) {
                delete me.request;
                var messages = action.result;
                me.processMessages(messages);
            },
            failure: function (action) {
                delete me.request;
                Ext.defer(function () {
                    me.receive();
                }, 3000);
            }
        });
    },

    stop: function () {
        if (this.disabled)
            return;

        var me = this;

        me.stoped = true;
        if (me.request) {
            Ext.Ajax.abort(me.request);
            delete me.request;
        }

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/PushAssist.ashx'),
            params: {
                method: 'UnRegisterClient',
                clientid: me.clientid
            },
            success: function (action) {
            }
        });
    },

    pause: function () {
        this.stop();
    },

    resume: function () {
        if (this.stoped)
            this.init();
    },

    subscribe: function (args) {
        if (this.disabled)
            return;

        var me = this,
            subscribes = me.subscribes = me.subscribes || {},
            args = args || {},
            cmp = args.cmp,
            channels = Ext.isArray(args.channel) ? args.channel : [args.channel],
            newchannels = [];

        if (args.ignoreRegister !== true) {
            Ext.each(channels, function (channel) {
                var cmps = subscribes[channel] = subscribes[channel] || [];
                if (cmps.length == 0) {
                    newchannels.push(channel);
                }

                if (!Ext.Array.contains(cmps, cmp))
                    cmps.push(cmp);
            });

            if (newchannels.length == 0) {
                if (args.fn)
                    args.fn.call(args.scope);

                return;
            }
        }
        else {
            newchannels = channels;
        }

        if (me.clientid) {
            YZSoft.Ajax.request({
                method: 'POST',
                exception: false,
                url: YZSoft.$url('YZSoft.Services.REST/core/PushAssist.ashx'),
                params: {
                    method: 'Subscribe',
                    clientid: me.clientid
                },
                jsonData: newchannels,
                success: function (action) {
                    if (args.fn)
                        args.fn.call(args.scope);
                },
                failure: function (action) {
                }
            });
        }
        else {
            if (args.fn)
                args.fn.call(args.scope);
        }
    },

    unsubscribe: function (args) {
        if (this.disabled)
            return;

        var me = this,
            subscribes = me.subscribes = me.subscribes || {},
            args = args || {},
            cmp = args.cmp,
            channels = Ext.isArray(args.channel) ? args.channel : [args.channel],
            removechannels = [];

        Ext.each(channels, function (channel) {
            var cmps = subscribes[channel] = subscribes[channel] || [];
            Ext.Array.remove(cmps, cmp);
        });

        Ext.each(channels, function (channel) {
            var cmps = subscribes[channel] = subscribes[channel] || [];
            if (cmps.length == 0)
                removechannels.push(channel);
        });

        if (removechannels.length == 0) {
            if (args.fn)
                args.fn.call(args.scope);
            return;
        }

        YZSoft.Ajax.request({
            method: 'POST',
            exception: false,
            url: YZSoft.$url('YZSoft.Services.REST/core/PushAssist.ashx'),
            params: {
                method: 'UnSubscribe',
                clientid: me.clientid
            },
            jsonData: removechannels,
            success: function (action) {
                if (args.fn)
                    args.fn.call(args.scope);
            },
            failure: function (action) {
            }
        });
    },

    processMessages: function (messages) {
        if (this.disabled)
            return;

        var me = this;

        if (messages.length == 1) {
            switch (messages[0].result) {
                case 'InvalidClientId':
                    me.init();
                    return;
            }
        }

        try {
            Ext.Array.each(messages, function (message) {
                me.fireEvent('message', message);

                if (message.channel)
                    me.fireEvent(message.channel, message);
            });
        }
        catch (e) {
        }

        me.receive();
    }
});