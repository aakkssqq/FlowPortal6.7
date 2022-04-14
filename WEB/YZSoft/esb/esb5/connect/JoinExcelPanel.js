//访问面板
Ext.define('YZSoft.esb.esb5.connect.JoinExcelPanel', {
    extend: 'Ext.window.Window', //222222
    layout: 'anchor',
    bodyBorder: false,
    formTitle:'',
    jointype: '',
    connectId:'',
    connectName: '',
    excelPath: '',
    caption:'',
    formWidth: '',
    resizable:false,

    constructor: function (config) {
        var me = this;
        var uploadfile = Ext.create('YZSoft.src.form.field.OpenFile',{
            fieldLabel: RS.$('All_FileUpload'),
            onUploadSuccess:function(file, data){
                me.joinPanel.getForm().findField('excelPath').setValue(file.name);
            }
        });
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
            border: false,
            items: [{
                xtype: 'fieldset',
                title: Ext.String.format(RS.$('ESB_Title_Connection'),'Excel'),
                defaultType: 'textfield',
                defaults: {
                    width: config.formWidth
                },
                items: [{
                        fieldLabel: RS.$('ESB_ConnectionName'),
                        name: 'connectName',
                        value: config.connectName,
                        emptyText:RS.$('ESB_ValidationErr_EnterConnectionName'),
                        afterLabelTextTpl: required,
                        allowBlank: false
                    },{
                        fieldLabel: Ext.String.format(RS.$('ESB_ServerAddress'),'Excel'),
                        name: 'excelPath',
                        value: config.excelPath,
                        emptyText:RS.$('ESB_ValidationErr_EnterExcelPath'),
                        afterLabelTextTpl: required,
                        allowBlank: false
                    },{
                        xclass: 'YZSoft.src.form.field.OpenFile',
                        fieldLabel: Ext.String.format(RS.$('ESB_UploadFileWithType'),'Excel'),
                        flex: 1,
                        reference:'edtSchema',
                        upload: {
                            fileTypes: '*.xls;*.xlsx',
                            typesDesc: 'Excel',
                            fileSizeLimit: '100 MB',
                            params: {
                                Method: 'SaveExcel'
                            }
                        },
                        listeners: {
                            uploadSuccess: function (file, data) {
                                me.joinPanel.getForm().findField('excelPath').setValue(data.filePath);
                            }
                        }
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
                cls: 'yz-btn-default',
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
            params: { method: 'JoinExcel'},
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
                var spath = form.findField('excelPath').value;
                //连接webservcie获取所有接口信息
                form.submit({
                    waitMsg: RS.$('All_Saving'),
                    waitMsgOK: RS.$('All_Save_Succeed'),
                    params: { method: 'SaveExcelConnect' ,jointype:me.jointype,connectId:me.connectId,spath:spath},
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
        form.findField('excelPath').setValue('');
        form.findField('caption').setValue('');
    }
});