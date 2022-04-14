/*
config
    millis: 100,
    timeout: 3000
*/

Ext.define('YZSoft.src.ux.Signal', {
    singleton: true,

    wait: function (config) {
        var me = this,
            request = {};

        Ext.applyIf(config, {
            timeout: 3000,
            millis: 100,
            beginTime: Ext.Date.now()
        });

        Ext.apply(request, config.request);
        Ext.apply(request, {
            success: function (action) {
                if (config.success)
                    config.success.call(config.scope || config, action);
            },
            failure: function (action) {
                var tick = Ext.Date.getElapsed(config.beginTime);

                if (tick < config.timeout) {
                    Ext.defer(function () {
                        me.wait(config);
                    }, config.millis);
                }
                else {
                    if (config.failure)
                        config.failure.call(config.scope || config, action);
                }
            },
            exception: function (response) {
                if (config.exception) {
                    config.exception.call(config.scope || config, response);
                }
                else {
                    var errorMessage = Ext.String.format(RS.$('All_Ajax_HttpFail_Msg'), request.url) + (response.status == 404 ? response.statusText : (response.responseText || ''));
                    YZSoft.alert(errorMessage, function () {
                    });
                }
            }
        });

        me.request(request);
    },

    request: function (config) {
        var me = this,
            cfg = {};

        Ext.apply(cfg, config);

        Ext.apply(cfg, {
            success: function (response) {
                var action = {
                    result: Ext.decode(response.responseText),
                    responseText: response.responseText
                };

                if (action.result.success === false)
                    config.failure.call(config.scope || config, action);
                else
                    config.success.call(config.scope || config, action);
            },
            failure: function (response) {
                config.exception.call(config.scope || config, response);
            }
        });

        Ext.Ajax.request(cfg);
    }
});
