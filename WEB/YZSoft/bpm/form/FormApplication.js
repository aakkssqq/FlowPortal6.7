
Ext.define('YZSoft.bpm.form.FormApplication', {
    extend: 'YZSoft.bpm.form.BPMFormBase',
    border: false,

    constructor: function (config) {
        var me = this;

        me.btnSave = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_Save'),
            handler: function (item) {
                me.post();
            }
        });

        me.btnClose = me.createButton(true, {
            iconCls: 'yz-glyph yz-glyph-close',
            text: RS.$('All_Close'),
            handler: function (item) {
                me.close();
            }
        });

        me.btnPrint = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-e61f',
            text: RS.$('All_Print'),
            handler: function (item) {
                me.print();
            }
        });

        me.btnRefresh = Ext.create('YZSoft.src.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function (item) {
                me.refresh();
            }
        });

        me.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            cls: ['yz-tbar-module', 'yz-tbar-bpmform', 'yz-tbar-bpmform-loading'],
            items: []
        });

        me.formPanel = Ext.create('YZSoft.src.panel.IFramePanel', {
            region: 'center',
            cls: 'yz-border-t',
            border: false,
            params: config.params,
            listeners: {
                yzafterrender: function () {
                    me.init(config);
                },
                close: function () {
                    me.close();
                }
            }
        });

        var cfg = {
            layout: 'fit',
            tbar: me.toolbar,
            border: false,
            items: [me.formPanel]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    init: function (config) {
        var me = this;

        me.request({
            async: false,
            params: Ext.apply(Ext.clone(config.params), {
                method: 'GetFormStateInfo'
            }),
            success: function (action) {
                me.params.appShortName = action.result.appShortName;
                me.params.token = action.result.token;
                me.params.formstate = action.result.formstate;
                me.validationGroup = action.result.validationGroup;
                me.formPanel.load(action.result.url);

                var btns = [];
                if (action.result.showSaveButton) {
                    btns.push(me.btnSave)
                    btns.push('->');
                    btns.push(me.btnPrint);
                    btns.push('|');
                    btns.push(me.btnRefresh);
                }
                else {
                    btns.push(me.btnClose)
                    btns.push('->');
                    btns.push(me.btnPrint);
                    btns.push('|');
                    btns.push(me.btnRefresh);
                }
                me.toolbar.add(btns);
            },
            failure: function (action) {
                me.reportErrorInForm(action.result.errorMessage);
            }
        });
    },

    post: function (link, persistParams) {
        var me = this;

        var data = {
            Header: {
                Method: 'SaveFormApplication',
                FormApplicationName: me.params.app,
                FormState: me.params.formstate,
                PrimaryKey: me.params.key
            }
        };

        me.callFormApi({
            method: 'saveFormApplication',
            params: {
                validationGroup: me.validationGroup,
                data: data
            },
            success: function (formData) {
                data = me.mergeResponse(data, formData);

                var cfg = {
                    waitMsg: { msg: RS.$('All_Submiting'), target: me },
                    success: function (rv) {
                        me.fireFormEvent({
                            event: 'afterSaveFormApplication',
                            params: rv,
                            success: function () {
                                me.fireEventExt('afterSaveFormApplication', rv);
                                me.fireEventExt('afterSubmit', 'SaveFormApplication', rv);
                                me.fireEventExt('modified', 'SaveFormApplication', rv);
                                me.fireEventExt('submit', 'SaveFormApplication', rv);
                                me.close();
                            }
                        });
                    }
                };

                me.ajaxPost(data, cfg);
            }
        });
    }
});