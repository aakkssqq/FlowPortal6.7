//访问面板
Ext.define('YZSoft.esb.esb5.connect.JoinWebPanel', {
    extend: 'Ext.window.Window', //222222
    layout: 'anchor',
    bodyBorder: false,
    formTitle:'',
    jointype: '',
    connectId:'',
    connectName: '',
    webPath: '',
    caption:'',
    formWidth:'',
    formHeight:'',
    resizable:false,

    constructor: function (config) {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',win;
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
            border:false,
            items: [{
                xtype: 'fieldset',
                title: Ext.String.format(RS.$('ESB_Title_Connection'),'WebService'),
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
                },{
                    fieldLabel: Ext.String.format(RS.$('ESB_ServerAddress'),'WebService'),
                    name: 'webPath',
                    value: config.webPath,
                    afterLabelTextTpl: required,
                    allowBlank: false
                },{
                    fieldLabel:RS.$('All_Comments'),
                    xtype:'textareafield',
                    name: 'caption',
                    value: config.caption
                }]
            }]
        });
        if (config.jointype=='TheEdit') {
            //编辑模式下禁止修改名称
            me.joinPanel.getForm().findField('connectName').setDisabled(true);
        }
        Ext.apply(config, {
            items: [
                me.joinPanel
            ],
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
                        //访问服务
                        me.onSaveForm(me.joinPanel.getForm());
                    }
                    else {
                        Ext.Msg.show({
                            title: RS.$('ESB_SavePrompt'),
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
                    me.onResetForm(me.joinPanel.getForm(), config.jointype);
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
            params: { method: 'JoinWebService'},
            success: function (form, data) {
                Ext.Msg.show({
                    title:RS.$('ESB_ConnectionPrompt'),
                    msg:data.result.errorMessage,
                    buttons: Ext.Msg.OK
                });
            },
            failure: function (form, data) {
                 Ext.Msg.show({
                        title:RS.$('ESB_ConnectionPrompt'),
                        msg:data.result.errorMessage,
                        buttons: Ext.Msg.OK
                });
            }
        });
    },
    //保存
    onSaveForm:function(form){
        var me = this;
        Ext.Msg.show({
            title:RS.$('ESB_SavePrompt'),
            msg:RS.$('ESB_SaveCfm_Msg'),
            buttons: Ext.Msg.OKCANCEL,
            defaultButton: 'ok',
            fn:function(btn){
                if (btn!='ok') return false;
                //连接webservcie获取所有接口信息
                form.submit({
                    waitMsg: RS.$('All_Saving'),
                    waitMsgOK: RS.$('All_Save_Succeed'),
                    params: { method: 'SaveWebConnect' ,jointype:me.jointype,connectId:me.connectId},
                    success: function (form, data) {
                        me.closeDialog(data.result.connectId);
                    },
                    failure: function (form,data) {
                            Ext.Msg.show({
                            title:RS.$('ESB_SavePrompt'),
                            msg:data.result.errorMessage,
                            buttons: Ext.Msg.OK
                        });
                    }
                });
            }
        });
    },
     //重置表单
    onResetForm:function(form,jointype){
        if (jointype=='TheAdd') {
            form.findField('connectName').setValue('');
        }
        form.findField('webPath').setValue('');
        form.findField('caption').setValue('');
    }
});