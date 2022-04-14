/*
config
params
*/

Ext.define('YZSoft.mobile.form.PreviewPanel', {
    extend: 'YZSoft.src.panel.IFramePanel',
    requires: [
        'YZSoft.core.MessageClient'
    ],
    autoReload: false,
    border: false,
    bodyStyle:'background-color:#eee',

    constructor: function (config) {
        var me = this,
            hasUrl = me.hasUrl = userInfo.emipUrl ? true : false;

        config.url = hasUrl ? userInfo.emipUrl : YZSoft.$url(me, 'MobileFormPreviewError.aspx');
        if (hasUrl) {
            config.params = config.params || {};
            Ext.apply(config.params, {
                mode: 'FormPreview'
            });
        }

        me.callParent([config]);
    },

    updateParams:function(params){
        var me = this;

        Ext.apply(me.params,params);
        me.reload();
    },

    update: function (mobileFormSetting) {
        var me = this;

        if (me.timer) {
            clearTimeout(me.timer);
            delete me.timer;
        }

        me.callFormApi({
            method: 'updateSimulateData',
            params: {
                mobileFormSetting: mobileFormSetting
            },
            success: function (data,opt) {
                if (opt.result == 'shakehandsTimeout') {
                    me.timer = Ext.defer(function () {
                        me.update(mobileFormSetting);
                    }, 100);
                }
            }
        });
    },

    callFormApi: function (config) {
        var me = this;

        var beforeend = function () {
        };

        //alert(me.formPanel.contentWindow.agent);
        var cfg = {
            target: me.contentWindow,
            channel: 'BPM:990',
            params: {
                method: 'call',
                callmethod: config.method,
                params: config.params
            },
            success: function (e, params) {
                beforeend();
                config.success.call(config.scope || config, params.data, { result: 'success' });
            },
            shakehandsTimeout: function () {
                beforeend();
                config.success.call(config.scope || config, null, { result: 'shakehandsTimeout' });
            },
            notImplement: function (e, params) {
                beforeend();
                YZSoft.alert(params.errorMessage || Ext.String.format('The form not implement the {0} function!', config.method));
            },
            failure: function (e, params) {
                beforeend();
                if (params.errorMessage !== false)
                    YZSoft.alert(params.errorMessage);
            },
            requestTimeout: function () {
                beforeend();
                YZSoft.alert(RS.$('Form_PostTimeout'));
            }
        };

        YZSoft.core.MessageClient.request(cfg);
    }
});