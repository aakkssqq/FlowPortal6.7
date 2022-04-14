
Ext.define('YZSoft.personal.LeavingSettingPanel', {
    extend: 'Ext.form.Panel',
    referenceHolder: true,
    border: false,
    bodyPadding: '15px 40px',
    ui: 'light',
    icon: YZSoft.$url('YZSoft/theme/images/icon/outofoffice.png'),
    header: {
        cls: 'yz-header-module'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnSave = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-save',
            text: RS.$('All_Save'),
            handler: function () {
                me.submit();
            }
        });

        cfg = {
            tools: [{
                glyph: 0xe60f,
                handler: function () {
                    me.load({
                        waitMsg: {
                            msg: RS.$('All_Loading'),
                            target: me,
                            start: 0
                        }
                    });
                }
            }],
            tbar: {
                padding: '5 0 10 40',
                items: [me.btnSave]
            },
            defaults: {
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            },
            items: [{
                fieldLabel: RS.$('Org_Leaving_Status'),
                labelAlign: 'top',
                name: 'data',
                labelStyle: 'font-weight:bold;font-size:1.2em;line-height:40px;',
                xclass: 'YZSoft.bpm.src.editor.LeavingField',
                listeners: {
                    change: function () {
                        me.updateStatus();
                    }
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        if (times == 0)
            this.load({
                waitMsg: {
                    msg:RS.$('All_Loading'),
                    target: this
                }
            });
        else {
            this.load();
        }
    },

    fill: function (data) {
        this.getForm().setValues({ data: data });
    },

    save: function () {
        return this.getValuesSubmit().data;
    },

    load: function (config) {
        var me = this;
        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Personal.ashx'),
            params: {
                method: 'GetCurrentLeavingSetting'
            },
            success: function (action) {
                me.fill(action.result);
            }
        }, config));
    },

    submit: function () {
        var me = this,
            data = me.save();

        if (data.State == 'Period' && data.From >= data.To) {
            YZSoft.alert(RS.$('Org_EndTimeLTStartTime_Err'));
            return;
        }

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/BPM/Personal.ashx'),
            params: Ext.apply({
                method: 'SaveLeavingSetting'
            }, data),
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: 'xx',
                    fn: function () {
                        Ext.getDoc().fireEvent('outofofficeChange', data);
                    }
                });
            }
        });
    },

    updateStatus: function () {
        var me = this,
            data = me.save(),
            isPeriodType = data.State == 'Period';

        me.btnSave.setDisabled(isPeriodType && (!data.From || !data.To));
    }
});