/*
config
processName
version
record
*/
Ext.define('YZSoft.mobile.form.Panel', {
    extend: 'Ext.panel.Panel',
    header: false,
    requires: [
    ],

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

        me.btnRefresh = Ext.create('Ext.button.Button', {
            iconCls: 'yz-glyph yz-glyph-refresh',
            text: RS.$('All_Refresh'),
            handler: function () {
                me.editor.load({
                    waitMsg: {
                        msg: RS.$('All_Loading'),
                        target: me,
                        start: 0
                    }
                });
            }
        });

        me.btnVersions = Ext.create('YZSoft.bpm.src.button.ProcessVersion', {
            processName: config.processName,
            version: config.version,
            listeners: {
                itemClick: function (version) {
                    if (me.version == version)
                        return;

                    me.version = version;
                    me.editor.load({
                        version: version,
                        waitMsg: {
                            msg: RS.$('All_Loading'),
                            target: me,
                            start: 0
                        }
                    });

                    me.pnlPreview.updateParams({
                        version: version
                    });
                }
            }
        });

        me.editor = Ext.create('YZSoft.mobile.form.Editor', {
            region: 'center',
            processName: config.processName,
            version: config.version,
            record: config.record
        });

        me.pnlPreview = Ext.create('YZSoft.mobile.form.PreviewPanel', {
            title: RS.$('All_MobileFormSetting_Caption_FormPreview'),
            ui: 'light',
            header: {
                cls: ['yz-header-submodule','yz-header-submodule-gray']
            },
            flex: 1,
            border: false,
            params: {
                processName: config.processName,
                version: config.version,
                uid: userInfo.Account
            }
        });

        cfg = {
            layout: 'border',
            tbar: {
                cls:'yz-tbar-module',
                items: [me.btnSave, me.btnRefresh, '->', me.btnVersions]
            },
            items: [me.editor, {
                xtype: 'container',
                region: 'east',
                width: 300,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                split: {
                    cls: 'yz-spliter',
                    size: 5,
                    collapseOnDblClick: false,
                    collapsible: true
                },
                items: [
                    me.pnlPreview, {
                        xtype: 'component',
                        region: 'south',
                        html: Ext.String.format('<span style="color:red;font-weight:bold">{0}</span><span style="color:#aaa;">{1}</span>',
                            RS.$('All_Caution'),
                            RS.$('All_MobileFormSetting_PreviewCaution')),
                        style: 'background-color:#fff;padding:3px;border-top:solid 5px #ddd'
                    }
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (config.record) {
            config.record.on({
                pathchanged: function (path) {
                    me.path = path;
                    me.store.getProxy().getExtraParams().path = path;
                    me.sts.request.params.path = path;
                }
            });
        }

        me.editor.on({
            scope: me,
            settingChanged: 'onSettingChanged'
        });
    },

    onActivate: function (times) {
        if (!this.processName)
            return;

        if(times == 0)
            this.editor.load({
                msg: RS.$('All_Loading'),
                target:this
            });
        else
            this.editor.load();
    },

    onSettingChanged: function (mobileFormSetting) {
        var me = this;
        me.pnlPreview.update(mobileFormSetting);
    },

    submit: function () {
        var me = this,
            data = me.editor.save();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/Mobile/Form.ashx'),
            method: 'POST',
            params: {
                method: 'SaveMobileFormSetting',
                processName: me.processName,
                version: me.version
            },
            jsonData: data,
            waitMsg: {
                msg: RS.$('All_Saving'),
                target: me,
                start: 0
            },
            success: function (action) {
                me.mask({
                    msg: RS.$('All_Save_Succeed'),
                    msgCls: 'yz-mask-msg-success',
                    autoClose: 'xx'
                });
            }
        });
    }
});