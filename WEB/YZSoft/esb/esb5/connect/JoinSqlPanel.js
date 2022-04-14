//访问面板
Ext.define('YZSoft.esb.esb5.connect.JoinSqlPanel', {
    extend: 'Ext.window.Window', //222222
    layout: 'anchor',
    bodyBorder: false,
    formTitle: '',
    jointype: '',
    connectId: '',
    connectName: '',
    dataSource: '',
    user: '',
    pwd: '',
    dataBase: '',
    caption: '',
    formWidth: '',
    resizable: false,

    constructor: function (config) {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>', win;
        me.store = Ext.create('Ext.data.Store', {
            remoteSort: true,
            fields: ['text', 'value'],
            proxy: {
                type: 'ajax',
                url: 'YZSoft.Services.REST/ESB5/Connect.ashx',
                reader: {
                    type: 'json',
                    rootProperty: 'dbName'
                }
            }
        });
        //连接面板
        me.joinPanel = Ext.create('Ext.form.Panel', {
            title: config.formTitle,
            layout: 'form',
            url: 'YZSoft.Services.REST/ESB5/Connect.ashx',
            defaults: {
                anchor: '100%'
            },
            defaultType: 'textfield',
            buttonAlign: 'center',
            bodyStyle: 'background-color:transparent',
            border: false,
            items: [{
                xtype: 'fieldset',
                title: Ext.String.format(RS.$('ESB_Title_Connection'), 'SqlServer'),
                defaultType: 'textfield',
                defaults: {
                    width: config.formWidth
                },
                items: [{
                    fieldLabel: RS.$('ESB_ConnectionName'),
                    name: 'connectName',
                    value: config.connectName,
                    afterLabelTextTpl: required,
                    allowBlank: false
                }, {
                    fieldLabel: Ext.String.format(RS.$('ESB_ServerNameFmt'), 'SqlServer'),
                    name: 'dataSource',
                    value: config.dataSource,
                    afterLabelTextTpl: required,
                    allowBlank: false
                }, {
                    fieldLabel: RS.$('All_UID'),
                    name: 'user',
                    value: config.user,
                    afterLabelTextTpl: required,
                    allowBlank: false
                }, {
                    fieldLabel: RS.$('All_Pwd'),
                    name: 'pwd',
                    value: config.pwd,
                    afterLabelTextTpl: required,
                    inputType: 'password',
                    allowBlank: false
                }, {
                    xtype: 'combobox',
                    fieldLabel: RS.$('All_Database'),
                    name: 'dataBase',
                    store: me.store,
                    displayField: 'text',
                    valueField: 'value',
                    emptyText: RS.$('ESB_SpecifyDatabaseName_EmptyText') + '...',
                    blankText: RS.$('ESB_SpecifyDatabaseName_EmptyText'),
                    queryMode: 'local',
                    afterLabelTextTpl: required,
                    allowBlank: false,
                    listeners: {
                        afterrender: function (combo) {
                            combo.setValue(config.dataBase);
                        },
                        expand: {
                            scope: this,
                            fn: function (combo, value, option) {
                                var form = me.joinPanel.getForm();
                                var dataSource = form.findField('dataSource').value;
                                var user = form.findField('user').value;
                                var pwd = form.findField('pwd').value;
                                //当服务器、用户名、密码有值的时候加载数据库列表
                                if (dataSource != '' && user != '' && pwd != '') {
                                    me.store.load({ params: { method: 'GetSqlServerDBList', dataSource: dataSource, user: user, pwd: pwd} });
                                }
                            }
                        }
                    }
                }, {
                    fieldLabel: RS.$('All_Comments'),
                    xtype: 'textareafield',
                    name: 'caption',
                    value: config.caption
                }]
            }]
        });
        if (config.jointype == 'TheEdit') {
            //编辑模式下禁止修改名称
            me.store.load({ params: { method: 'GetSqlServerDBList', dataSource: config.dataSource, user: config.user, pwd: config.pwd} });
            me.joinPanel.getForm().findField('connectName').setDisabled(true);
        }
        Ext.apply(config, {
            items: [me.joinPanel],
            buttons: [{
                text: RS.$('ESB_ConnectionTest'),
                iconCls: 'yz-glyph yz-glyph-e997',
                scope: this,
                handler: function () {
                    //验证
                    if (me.joinPanel.getForm().isValid()) {
                        //访问服务
                        me.onJoinForm(me.joinPanel.getForm());
                    }
                    else {
                        Ext.Msg.show({
                            title: RS.$('ESB_ConnectionPrompt'),
                            msg: RS.$('ESB_EnterForm'),
                            buttons: Ext.Msg.OK
                        });
                    }

                }
            }, {
                text: RS.$('ESB_SaveConnectionInfo'),
                iconCls: 'yz-glyph yz-glyph-save',
                cls:'yz-btn-default',
                scope: this,
                handler: function () {
                    //验证
                    if (me.joinPanel.getForm().isValid()) {
                        me.onSaveForm(me.joinPanel.getForm());
                    }
                    else {
                        Ext.Msg.show({
                            title: RS.$('ESB_ConnectionPrompt'),
                            msg: RS.$('ESB_EnterForm'),
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            }, {
                text: RS.$('All_Reset'),
                iconCls: 'yz-glyph yz-glyph-refresh',
                scope: this,
                handler: function () {
                    me.onFormreset(me.joinPanel.getForm(), config.jointype);
                }
            }]
        });
        me.callParent([config]);
    },
    //连接服务
    onJoinForm: function (form) {
        var me = this;
        //连接webservcie获取所有接口信息
        form.submit({
            waitMsg: RS.$('ESB_Connecting'),
            params: { method: 'JoinSqlServer' },
            success: function (form, data) {
                Ext.Msg.show({
                    title: RS.$('ESB_ConnectionPrompt'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            },
            failure: function (form, data) {
                Ext.Msg.show({
                    title: RS.$('ESB_ConnectionPrompt'),
                    msg: data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            }
        });
    },
    //保存
    onSaveForm: function (form) {
        var me = this;
        Ext.Msg.show({
            title: RS.$('ESB_SavePrompt'),
            msg: RS.$('ESB_SaveCfm_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'ok',
            fn: function (btn) {
                if (btn == 'ok') {
                    form.submit({
                        waitMsg: RS.$('All_Saving'),
                        waitMsgOK: RS.$('All_Save_Succeed'),
                        params: { method: 'SaveSQLConnect', jointype: me.jointype, connectId: me.connectId },
                        success: function (form, data) {
                            me.closeDialog(data.result.connectId);
                        },
                        failure: function (form, data) {
                            Ext.Msg.show({
                                title: RS.$('ESB_SavePrompt'),
                                msg: data.result.errorMessage,
                                buttons: Ext.Msg.OK
                            });
                        }
                    });
                }
            }
        });
    },
    onFormreset: function (form, jointype) {
        if (jointype == 'TheAdd') {
            form.findField('connectName').setValue('');
        }
        form.findField('dataSource').setValue('');
        form.findField('user').setValue('');
        form.findField('pwd').setValue('');
        form.findField('dataBase').setValue('');
        form.findField('caption').setValue('');
    }
});