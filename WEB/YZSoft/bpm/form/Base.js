
Ext.define('YZSoft.bpm.form.Base', {
    extend: 'Ext.panel.Panel',
    requires: [
        'YZSoft.core.MessageClient'
    ],
    cls: 'yz-panel-form',

    constructor: function () {
        var me = this;

        me.callParent(arguments);

        me.on({
            afterRender: function () {
                me.loadMask = Ext.create('Ext.LoadMask', {
                    msg: RS.$('All_Form_Loading'),
                    target: me
                });

                me.loadMask.show();
            }
        });

        me.formPanel.on({
            onload: function () {
                if (me.toolbar)
                    me.toolbar.removeCls('yz-tbar-bpmform-loading');

                if (me.loadMask) {
                    me.loadMask.destroy();
                    delete me.loadMask;
                }
            }
        });
    },

    onBeforeRequest: function (params) {
        if (this.params.stk)
            params.stk = this.params.stk;
        return params;
    },

    isBPMForm: function () {
        var me = this;

        try {
            return me.formPanel.contentWindow.agent ? true : false;
        }
        catch (e) {
            return false;
        }
    },

    onAdd: function (item, index) {
        item.addCls('yz-func-panel');
        item.addBodyCls('yz-func-panel-body');

        this.callParent(arguments);
    },

    createButton: function (button, config) {
        var xclass = button ? 'YZSoft.src.button.Button' : 'YZSoft.src.menu.Item';

        if (config.perm) {
            Ext.apply(config, {
                disabled: true
            });
        }

        var btn = Ext.create(xclass, config);

        this.optButtons = this.optButtons || [];
        this.optButtons.push(btn);

        return btn;
    },

    request: function (config) {
        var me = this,
            perms = [],
            params;

        Ext.each(me.optButtons, function (btn) {
            if (!btn.perm)
                return;

            if (!Ext.Array.contains(perms, btn.perm))
                perms.push(btn.perm);
        });

        params = Ext.apply(config.params, {
            Permisions: perms.join(',')
        });

        me.onBeforeRequest(params);

        YZSoft.Ajax.request({
            async: config.async,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Form.ashx'),
            params: params,
            success: function (action) {
                var perm = action.result.perm;
                if (perm) {
                    Ext.each(me.optButtons, function (btn) {
                        if (btn.perm) {
                            btn.setDisabled(!perm[btn.perm]);
                        }
                    });
                }

                if (config.success)
                    config.success.call(config.scope || config, action);
            },
            failure: config.failure
        });
    },

    fireEventExt: function (eventName) {
        var args = Array.prototype.slice.call(arguments, 1);
        args.push(false);
        this.fireEventArgs(eventName, args);
    },

    mergeResponse: function (pd, data) {
        if (data && data.Header && !data.Header.Comment)
            delete data.Header.Comment;

        return Ext.merge(pd, data);
    },

    callFormApi: function (config) {
        var me = this,
            bpmform = me.isBPMForm(),
            beforeend, cfg;

        if (me.toolbar) {
            me.callApiMask = Ext.create('Ext.LoadMask', {
                userCls: 'yz-mask-nomsg', 
                target: me.toolbar
            });
            me.callApiMask.show();
        }

        beforeend = function () {
            if (me.callApiMask) {
                me.callApiMask.destroy();
                delete me.callApiMask;
            }
        };

        cfg = {
            target: me.formPanel.contentWindow,
            channel: 'BPM:1010',
            timeout: bpmform ? 10000 : 0,
            shakehandstimeout: bpmform ? 5000 : 0,
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

                if (bpmform) {
                    if (config.failure)
                        config.failure.call(config.scope || config, { result: 'shakehandsTimeout' });

                    YZSoft.alert(RS.$('Form_PostTimeout'));
                }
                else
                    config.success.call(config.scope || config, null, { result: 'shakehandsTimeout' });
            },
            notImplement: function (e, params) {
                beforeend();

                if (config.failure)
                    config.failure.call(config.scope || config, { result: 'notImplement' });

                YZSoft.alert(params.errorMessage || Ext.String.format('The form not implement the {0} function!', config.method));
            },
            failure: function (e, params) {
                beforeend();

                if (config.failure)
                    config.failure.call(config.scope || config, { result: 'failure' });

                if (params.errorMessage !== false)
                    YZSoft.alert(params.errorMessage);
            },
            requestTimeout: function () {
                beforeend();

                if (config.failure)
                    config.failure.call(config.scope || config, { result: 'requestTimeout' });

                YZSoft.alert(RS.$('Form_PostTimeout'));
            }
        };

        YZSoft.core.MessageClient.request(cfg);
    },

    fireFormEvent: function (config) {
        var me = this,
            bpmform = me.isBPMForm();

        if (me.toolbar) {
            me.fireFormEventMask = Ext.create('Ext.LoadMask', {
                userCls: 'yz-mask-nomsg', 
                target: me.toolbar
            });
            me.fireFormEventMask.show();
        }

        var beforeend = function () {
            if (me.fireFormEventMask) {
                me.fireFormEventMask.destroy();
                delete me.fireFormEventMask;
            }
        };

        var cfg = {
            target: me.formPanel.contentWindow,
            channel: 'BPM:1010',
            timeout: bpmform ? 10000 : 0,
            shakehandstimeout: bpmform ? 5000 : 0,
            params: {
                method: 'fire',
                event: config.event,
                params: config.params
            },
            success: function (e, params) {
                beforeend();

                if (config.success)
                    config.success.call(config.scope || config, params.data, { result: 'success' });
            },
            shakehandsTimeout: function () {
                beforeend();

                if (bpmform) {
                    if (config.failure)
                        config.failure.call(config.scope || config, { result: 'shakehandsTimeout' });

                    YZSoft.alert(RS.$('Form_PostTimeout'));
                }
                else {
                    if (config.success)
                        config.success.call(config.scope || config, null, { result: 'shakehandsTimeout' });
                }
            },
            notImplement: function (e) {
                beforeend();

                if (config.success)
                    config.success.call(config.scope || config, null, { result: 'notImplement' });
            },
            failure: function (e, params) {
                beforeend();

                if (config.failure)
                    config.failure.call(config.scope || config, { result: 'failure' });

                if (params.errorMessage !== false)
                    YZSoft.alert(params.errorMessage);
            },
            requestTimeout: function () {
                beforeend();

                if (config.failure)
                    config.failure.call(config.scope || config, { result: 'requestTimeout' });

                YZSoft.alert(RS.$('Form_PostTimeout'));
            }
        };

        YZSoft.core.MessageClient.request(cfg);
    },

    ajaxPost: function (pd, config) {
        var me = this,
            xe = YZSoft.util.xml,
            rv = {},
            xmlData = xe.encode('XForm', pd);

        config = config || {};

        var cfg = {
            method: 'POST',
            disableCaching: true,
            params: {
                method: 'Post',
                uid: me.uid
            },
            xmlData: xmlData,
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Post.ashx')
        };

        me.onBeforeRequest(cfg.params);
        Ext.apply(cfg, config);

        Ext.apply(cfg, {
            success: function (action) {
                var rv = me.PostResult = action.result;

                if (config.success)
                    config.success.call(this.scope || this, rv);
            }
        });

        YZSoft.Ajax.request(cfg);
        return rv;
    },

    postConfirm: function (link, fn) {
        var me = this;

        if (link.ProcessConfirmType == 'Prompt') {
            var msg = Ext.String.trim(link.PromptMessage);
            Ext.Msg.show({
                title: RS.$('Form_SubmitAuthDlg_Title'),
                msg: RS.$1(msg || Ext.String.format(RS.$('Form_SubmitAuthDlg_Msg'), link.DisplayString)),
                buttons: Ext.Msg.OKCANCEL,
                defaultButton: 'ok',
                icon: Ext.Msg.INFO,
                fn: function (btn, text) {
                    if (btn == 'ok')
                        fn.call(me)
                }
            });
        }
        else if (link.ProcessConfirmType == 'EnterPassword') {
            Ext.create('YZSoft.bpm.src.dialogs.SubmitAuthDlg', {
                autoShow: true,
                actionName: link.DisplayString,
                fn: function () {
                    fn.call(me)
                }
            });
        }
        else {
            fn.call(me)
        }
    },

    print: function () {
        var me = this;
        if (me.formPanel)
            me.formPanel.print();
    },

    refresh: function () {
        var me = this;
        if (me.formPanel && me.formPanel)
            me.formPanel.reload();
    },

    reportErrorInForm: function (errorMessage) {
        this.toolbar.hide();
        this.params.error = errorMessage;
        this.formPanel.load(YZSoft.$url(this, 'Error.aspx'));
    }
});