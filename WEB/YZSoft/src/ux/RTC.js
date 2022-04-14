/*
config
    bind: me.grid,
    millis: 1000,
    timeout: 3000,
    request:{
*/

Ext.define('YZSoft.src.ux.RTC', {
    millisWakeup: 3000,
    timeout: 3000,
    millis: 1000,

    constructor: function (config) {
        var me = this;

        me.callParent();
        Ext.apply(me, config);

        Ext.apply(me.request, {
            failure: function (action) {
                Ext.log.warn(Ext.String.format('[RTC request]: {0},Error: {1}', me.request.url, action.result.errorMessage));
            }
        });

        if (me.bind) {
            me.bind.on({
                afterrender: function () {
                    me.waitOne();
                },
                destroy: function () {
                    me.stop();
                }
            });
        }
    },

    waitOne: function (millis) {
        var me = this;

        if (me.timerTimeout) {
            clearTimeout(me.timerTimeout);
            delete me.timerTimeout;
        }

        if (me.timer) {
            clearTimeout(me.timer);
            delete me.timer;
        }

        if (!me.bind.getEl().isVisible(true)) {
            me.timer = Ext.defer(function () {
                me.waitOne(0);
            }, me.millisWakeup);
        }
        else {
            me.timer = Ext.defer(function () {
                if (me.request) {
                    me.ajaxRequest(me.request);
                    me.timerTimeout = Ext.defer(function () {
                        me.waitOne(0);
                    }, me.timeout);
                }
            }, (millis || millis === 0) ? millis : me.millis);
        }
    },

    stop: function () {
        var me = this;

        if (me.timer) {
            clearTimeout(me.timer);
            delete me.timer;
        }

        if (me.timerTimeout) {
            clearTimeout(me.timerTimeout);
            delete me.timerTimeout;
        }
    },

    ajaxRequest: function (config) {
        var me = this,
            cfg = {};

        Ext.apply(cfg, config);

        Ext.apply(cfg, {
            url: config.url,
            success: function (response) {
                var action = {
                    result: Ext.decode(response.responseText),
                    responseText: response.responseText
                };

                var rv = action.result;
                if (rv.success === false)
                    Ext.log.warn(Ext.String.format('[RTC request]: {0},Error: {1}', config.url, rv.errorMessage));
                else
                    config.success.call(config.scope || config, action);
            },
            failure: function (response) {
                Ext.log.warn(Ext.String.format('[RTC request]: {0},Error: {1}', config.url, (response || {}).responseText));
            }
        });

        Ext.Ajax.request(cfg);
    }
});
